/*
  # Fix database functions and triggers

  1. Functions
    - Drop and recreate all game-related functions
    - Handle dependencies properly for trigger functions
    
  2. Triggers
    - Drop dependent triggers before dropping functions
    - Recreate triggers after functions are created
    
  3. Security
    - Grant proper permissions to authenticated users
*/

-- Drop functions that don't have dependencies first
DROP FUNCTION IF EXISTS start_game_session(UUID, INTEGER);
DROP FUNCTION IF EXISTS start_round(UUID, TEXT);
DROP FUNCTION IF EXISTS submit_answer(UUID, INTEGER, TEXT, INTEGER);
DROP FUNCTION IF EXISTS get_user_stats(UUID);
DROP FUNCTION IF EXISTS get_random_question(TEXT, TEXT, UUID[]);
DROP FUNCTION IF EXISTS complete_game_session(UUID);

-- Drop triggers that depend on handle_updated_at function
DROP TRIGGER IF EXISTS on_profiles_updated ON profiles;
DROP TRIGGER IF EXISTS on_game_sessions_updated ON game_sessions;
DROP TRIGGER IF EXISTS on_question_bank_updated ON question_bank;

-- Drop trigger that depends on handle_new_user function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Now we can safely drop and recreate both trigger functions
DROP FUNCTION IF EXISTS handle_updated_at();
DROP FUNCTION IF EXISTS handle_new_user();

-- Helper function to update updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, current_points)
  VALUES (NEW.id, '', 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the updated_at triggers
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_game_sessions_updated
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_question_bank_updated
  BEFORE UPDATE ON question_bank
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Recreate trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to start a new game session
CREATE OR REPLACE FUNCTION start_game_session(
  p_user_id UUID,
  p_max_rounds INTEGER DEFAULT 10
)
RETURNS UUID AS $$
DECLARE
  session_id UUID;
BEGIN
  -- End any existing active sessions for this user
  UPDATE game_sessions 
  SET status = 'completed', completed_at = now(), updated_at = now()
  WHERE user_id = p_user_id AND status = 'active';
  
  -- Create new session
  INSERT INTO game_sessions (user_id, max_rounds, status)
  VALUES (p_user_id, p_max_rounds, 'active')
  RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get a random question
CREATE OR REPLACE FUNCTION get_random_question(
  p_category TEXT DEFAULT NULL,
  p_difficulty TEXT DEFAULT 'medium',
  p_exclude_ids UUID[] DEFAULT ARRAY[]::UUID[]
)
RETURNS TABLE(
  id UUID,
  category TEXT,
  difficulty TEXT,
  question_text TEXT,
  question_type TEXT,
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  points_value INTEGER,
  scenario_data JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    q.id,
    q.category,
    q.difficulty,
    q.question_text,
    q.question_type,
    q.options,
    q.correct_answer,
    q.explanation,
    q.points_value,
    q.scenario_data
  FROM question_bank q
  WHERE 
    (p_category IS NULL OR q.category = p_category)
    AND q.difficulty = p_difficulty
    AND NOT (q.id = ANY(p_exclude_ids))
  ORDER BY RANDOM()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to start a new round
CREATE OR REPLACE FUNCTION start_round(
  p_session_id UUID,
  p_round_type TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  session_record RECORD;
  question_record RECORD;
  round_record RECORD;
  categories TEXT[] := ARRAY['budgeting', 'investing', 'savings', 'debt_management', 'insurance'];
  selected_category TEXT;
  used_question_ids UUID[];
BEGIN
  -- Get session info
  SELECT * INTO session_record
  FROM game_sessions
  WHERE id = p_session_id AND status = 'active';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session not found or not active';
  END IF;
  
  -- Check if session is complete
  IF session_record.rounds_completed >= session_record.max_rounds THEN
    RAISE EXCEPTION 'Session already complete';
  END IF;
  
  -- Get used question IDs for this session
  SELECT ARRAY_AGG(question_id) INTO used_question_ids
  FROM session_rounds
  WHERE session_id = p_session_id AND question_id IS NOT NULL;
  
  IF used_question_ids IS NULL THEN
    used_question_ids := ARRAY[]::UUID[];
  END IF;
  
  -- Select category (use provided or random)
  IF p_round_type IS NOT NULL THEN
    selected_category := p_round_type;
  ELSE
    selected_category := categories[1 + floor(random() * array_length(categories, 1))];
  END IF;
  
  -- Get random question
  SELECT * INTO question_record
  FROM get_random_question(selected_category, 'medium', used_question_ids)
  LIMIT 1;
  
  IF NOT FOUND THEN
    -- Try with easy difficulty if no medium questions available
    SELECT * INTO question_record
    FROM get_random_question(selected_category, 'easy', used_question_ids)
    LIMIT 1;
  END IF;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No questions available for category: %', selected_category;
  END IF;
  
  -- Create round record
  INSERT INTO session_rounds (
    session_id,
    round_number,
    round_type,
    question_id,
    question_data,
    correct_answer
  ) VALUES (
    p_session_id,
    session_record.rounds_completed + 1,
    selected_category,
    question_record.id,
    row_to_json(question_record),
    question_record.correct_answer::jsonb
  ) RETURNING * INTO round_record;
  
  -- Return round data with question
  RETURN json_build_object(
    'round_number', round_record.round_number,
    'category', selected_category,
    'difficulty', question_record.difficulty,
    'question', row_to_json(question_record)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to submit an answer
CREATE OR REPLACE FUNCTION submit_answer(
  p_session_id UUID,
  p_round_number INTEGER,
  p_user_answer TEXT,
  p_time_taken INTEGER DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  round_record RECORD;
  session_record RECORD;
  is_correct BOOLEAN := FALSE;
  points_earned INTEGER := 0;
  question_data JSONB;
  correct_answer TEXT;
  explanation TEXT;
  new_total_score INTEGER;
  session_complete BOOLEAN := FALSE;
BEGIN
  -- Get round record
  SELECT * INTO round_record
  FROM session_rounds
  WHERE session_id = p_session_id AND round_number = p_round_number;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Round not found';
  END IF;
  
  -- Check if already answered
  IF round_record.completed_at IS NOT NULL THEN
    RAISE EXCEPTION 'Round already completed';
  END IF;
  
  -- Extract question data
  question_data := round_record.question_data;
  correct_answer := (round_record.correct_answer #>> '{}');
  explanation := (question_data ->> 'explanation');
  
  -- Check if answer is correct
  IF TRIM(LOWER(p_user_answer)) = TRIM(LOWER(correct_answer)) THEN
    is_correct := TRUE;
    points_earned := COALESCE((question_data ->> 'points_value')::INTEGER, 10);
  END IF;
  
  -- Update round record
  UPDATE session_rounds
  SET 
    user_answer = to_jsonb(p_user_answer),
    is_correct = is_correct,
    points_earned = points_earned,
    time_taken = p_time_taken,
    completed_at = now()
  WHERE id = round_record.id;
  
  -- Update session
  UPDATE game_sessions
  SET 
    total_score = total_score + points_earned,
    rounds_completed = rounds_completed + 1,
    updated_at = now()
  WHERE id = p_session_id
  RETURNING total_score, rounds_completed, max_rounds INTO new_total_score, session_record.rounds_completed, session_record.max_rounds;
  
  -- Check if session is complete
  IF session_record.rounds_completed >= session_record.max_rounds THEN
    UPDATE game_sessions
    SET status = 'completed', completed_at = now()
    WHERE id = p_session_id;
    
    session_complete := TRUE;
    
    -- Update user points
    UPDATE profiles
    SET current_points = current_points + points_earned
    WHERE id = (SELECT user_id FROM game_sessions WHERE id = p_session_id);
  END IF;
  
  -- Return result
  RETURN json_build_object(
    'is_correct', is_correct,
    'points_earned', points_earned,
    'correct_answer', correct_answer,
    'explanation', explanation,
    'total_score', new_total_score,
    'rounds_completed', session_record.rounds_completed,
    'session_complete', session_complete
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  stats_record RECORD;
BEGIN
  SELECT 
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_sessions,
    COALESCE(SUM(total_score), 0) as total_score,
    COALESCE(AVG(total_score) FILTER (WHERE status = 'completed'), 0) as average_score,
    COALESCE(MAX(total_score), 0) as best_score,
    COALESCE(SUM(rounds_completed), 0) as total_rounds,
    CASE 
      WHEN SUM(rounds_completed) > 0 THEN
        (COUNT(*) FILTER (WHERE sr.is_correct = true) * 100.0 / SUM(rounds_completed))
      ELSE 0
    END as accuracy_rate
  INTO stats_record
  FROM game_sessions gs
  LEFT JOIN session_rounds sr ON gs.id = sr.session_id
  WHERE gs.user_id = p_user_id;
  
  RETURN row_to_json(stats_record);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete a game session
CREATE OR REPLACE FUNCTION complete_game_session(p_session_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE game_sessions
  SET 
    status = 'completed',
    completed_at = now(),
    updated_at = now()
  WHERE id = p_session_id AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION start_game_session(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION start_round(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION submit_answer(UUID, INTEGER, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_random_question(TEXT, TEXT, UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION complete_game_session(UUID) TO authenticated;
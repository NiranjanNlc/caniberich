/*
  # Game Management Functions

  1. Functions
    - start_game_session() - Creates a new game session
    - start_round() - Starts a new round with a random question
    - submit_answer() - Processes user answer and calculates score
    - get_random_question() - Gets a random question by category and difficulty
    - complete_game_session() - Finalizes a game session
    - get_user_stats() - Gets user game statistics
*/

-- Function to start a new game session
CREATE OR REPLACE FUNCTION start_game_session(
  p_user_id UUID,
  p_max_rounds INTEGER DEFAULT 10
)
RETURNS UUID AS $$
DECLARE
  session_id UUID;
BEGIN
  -- End any active sessions for the user
  UPDATE game_sessions 
  SET status = 'completed', completed_at = NOW()
  WHERE user_id = p_user_id AND status = 'active';
  
  -- Create new session
  INSERT INTO game_sessions (user_id, max_rounds)
  VALUES (p_user_id, p_max_rounds)
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
    qb.id,
    qb.category,
    qb.difficulty,
    qb.question_text,
    qb.question_type,
    qb.options,
    qb.correct_answer,
    qb.explanation,
    qb.points_value,
    qb.scenario_data
  FROM question_bank qb
  WHERE 
    (p_category IS NULL OR qb.category = p_category)
    AND qb.difficulty = p_difficulty
    AND NOT (qb.id = ANY(p_exclude_ids))
  ORDER BY RANDOM()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to start a new round
CREATE OR REPLACE FUNCTION start_round(
  p_session_id UUID,
  p_round_type TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  session_record RECORD;
  question_record RECORD;
  round_number INTEGER;
  used_question_ids UUID[];
  selected_category TEXT;
  selected_difficulty TEXT;
BEGIN
  -- Get session info
  SELECT * INTO session_record
  FROM game_sessions
  WHERE id = p_session_id AND status = 'active';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Active session not found';
  END IF;
  
  -- Check if session is complete
  IF session_record.rounds_completed >= session_record.max_rounds THEN
    RAISE EXCEPTION 'Session already completed';
  END IF;
  
  -- Calculate next round number
  round_number := session_record.rounds_completed + 1;
  
  -- Get used question IDs for this session
  SELECT ARRAY_AGG(question_id) INTO used_question_ids
  FROM session_rounds
  WHERE session_id = p_session_id AND question_id IS NOT NULL;
  
  IF used_question_ids IS NULL THEN
    used_question_ids := ARRAY[]::UUID[];
  END IF;
  
  -- Determine category and difficulty
  selected_category := COALESCE(p_round_type, 
    CASE 
      WHEN round_number <= 3 THEN 'budgeting'
      WHEN round_number <= 6 THEN 'savings'
      WHEN round_number <= 8 THEN 'investing'
      ELSE 'debt_management'
    END
  );
  
  selected_difficulty := CASE 
    WHEN round_number <= 3 THEN 'easy'
    WHEN round_number <= 7 THEN 'medium'
    ELSE 'hard'
  END;
  
  -- Get random question
  SELECT * INTO question_record
  FROM get_random_question(selected_category, selected_difficulty, used_question_ids);
  
  IF NOT FOUND THEN
    -- Fallback to any available question
    SELECT * INTO question_record
    FROM get_random_question(NULL, selected_difficulty, used_question_ids);
  END IF;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No available questions found';
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
    round_number,
    selected_category,
    question_record.id,
    jsonb_build_object(
      'id', question_record.id,
      'question_text', question_record.question_text,
      'question_type', question_record.question_type,
      'options', question_record.options,
      'points_value', question_record.points_value,
      'scenario_data', question_record.scenario_data
    ),
    jsonb_build_object(
      'answer', question_record.correct_answer,
      'explanation', question_record.explanation
    )
  );
  
  -- Return question data (without correct answer)
  RETURN jsonb_build_object(
    'round_number', round_number,
    'category', selected_category,
    'difficulty', selected_difficulty,
    'question', jsonb_build_object(
      'id', question_record.id,
      'question_text', question_record.question_text,
      'question_type', question_record.question_type,
      'options', question_record.options,
      'points_value', question_record.points_value,
      'scenario_data', question_record.scenario_data
    )
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
RETURNS JSONB AS $$
DECLARE
  round_record RECORD;
  session_record RECORD;
  is_correct BOOLEAN;
  points_earned INTEGER;
  correct_answer_text TEXT;
  explanation_text TEXT;
BEGIN
  -- Get round record
  SELECT * INTO round_record
  FROM session_rounds
  WHERE session_id = p_session_id AND round_number = p_round_number;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Round not found';
  END IF;
  
  IF round_record.completed_at IS NOT NULL THEN
    RAISE EXCEPTION 'Round already completed';
  END IF;
  
  -- Extract correct answer and explanation
  correct_answer_text := round_record.correct_answer->>'answer';
  explanation_text := round_record.correct_answer->>'explanation';
  
  -- Check if answer is correct
  is_correct := LOWER(TRIM(p_user_answer)) = LOWER(TRIM(correct_answer_text));
  
  -- Calculate points
  points_earned := CASE 
    WHEN is_correct THEN (round_record.question_data->>'points_value')::INTEGER
    ELSE 0
  END;
  
  -- Update round record
  UPDATE session_rounds
  SET 
    user_answer = jsonb_build_object('answer', p_user_answer),
    is_correct = is_correct,
    points_earned = points_earned,
    time_taken = p_time_taken,
    completed_at = NOW()
  WHERE id = round_record.id;
  
  -- Update session totals
  UPDATE game_sessions
  SET 
    total_score = total_score + points_earned,
    rounds_completed = rounds_completed + 1,
    updated_at = NOW()
  WHERE id = p_session_id;
  
  -- Get updated session
  SELECT * INTO session_record
  FROM game_sessions
  WHERE id = p_session_id;
  
  -- Check if session is complete
  IF session_record.rounds_completed >= session_record.max_rounds THEN
    PERFORM complete_game_session(p_session_id);
  END IF;
  
  -- Return result
  RETURN jsonb_build_object(
    'is_correct', is_correct,
    'points_earned', points_earned,
    'correct_answer', correct_answer_text,
    'explanation', explanation_text,
    'total_score', session_record.total_score,
    'rounds_completed', session_record.rounds_completed,
    'session_complete', session_record.rounds_completed >= session_record.max_rounds
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete a game session
CREATE OR REPLACE FUNCTION complete_game_session(p_session_id UUID)
RETURNS VOID AS $$
DECLARE
  session_record RECORD;
  bonus_points INTEGER;
BEGIN
  -- Get session record
  SELECT * INTO session_record
  FROM game_sessions
  WHERE id = p_session_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session not found';
  END IF;
  
  -- Calculate bonus points based on performance
  bonus_points := CASE 
    WHEN session_record.total_score >= (session_record.max_rounds * 10 * 0.8) THEN 50 -- 80% or higher
    WHEN session_record.total_score >= (session_record.max_rounds * 10 * 0.6) THEN 25 -- 60% or higher
    ELSE 0
  END;
  
  -- Update session
  UPDATE game_sessions
  SET 
    status = 'completed',
    total_score = total_score + bonus_points,
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_session_id;
  
  -- Update user profile points
  UPDATE profiles
  SET 
    current_points = current_points + session_record.total_score + bonus_points,
    updated_at = NOW()
  WHERE id = session_record.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user game statistics
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_sessions', COUNT(*),
    'completed_sessions', COUNT(*) FILTER (WHERE status = 'completed'),
    'total_score', COALESCE(SUM(total_score), 0),
    'average_score', COALESCE(AVG(total_score) FILTER (WHERE status = 'completed'), 0),
    'best_score', COALESCE(MAX(total_score), 0),
    'total_rounds', COALESCE(SUM(rounds_completed), 0),
    'accuracy_rate', COALESCE(
      (SELECT AVG(CASE WHEN is_correct THEN 1.0 ELSE 0.0 END) * 100
       FROM session_rounds sr
       JOIN game_sessions gs ON sr.session_id = gs.id
       WHERE gs.user_id = p_user_id AND sr.completed_at IS NOT NULL), 0
    )
  ) INTO stats
  FROM game_sessions
  WHERE user_id = p_user_id;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
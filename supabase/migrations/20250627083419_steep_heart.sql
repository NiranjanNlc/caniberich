/*
  # Game Sessions and Round Management

  1. New Tables
    - `game_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `status` (text, session status)
      - `total_score` (integer)
      - `rounds_completed` (integer)
      - `started_at` (timestamp)
      - `completed_at` (timestamp)
    
    - `session_rounds`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references game_sessions)
      - `round_number` (integer)
      - `round_type` (text)
      - `question_data` (jsonb)
      - `user_answer` (jsonb)
      - `correct_answer` (jsonb)
      - `points_earned` (integer)
      - `time_taken` (integer)
      - `completed_at` (timestamp)

    - `question_bank`
      - `id` (uuid, primary key)
      - `category` (text)
      - `difficulty` (text)
      - `question_text` (text)
      - `options` (jsonb)
      - `correct_answer` (text)
      - `explanation` (text)
      - `points_value` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control

  3. Functions
    - start_game_session()
    - start_round()
    - submit_answer()
    - get_random_question()
*/

-- Game Sessions Table
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
  total_score INTEGER DEFAULT 0,
  rounds_completed INTEGER DEFAULT 0,
  max_rounds INTEGER DEFAULT 10,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session Rounds Table
CREATE TABLE IF NOT EXISTS session_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  round_type TEXT CHECK (round_type IN ('budgeting', 'investing', 'savings', 'debt_management', 'insurance')) NOT NULL,
  question_id UUID,
  question_data JSONB NOT NULL,
  user_answer JSONB,
  correct_answer JSONB NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  points_earned INTEGER DEFAULT 0,
  time_taken INTEGER, -- in seconds
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Question Bank Table
CREATE TABLE IF NOT EXISTS question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT CHECK (category IN ('budgeting', 'investing', 'savings', 'debt_management', 'insurance')) NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('multiple_choice', 'scenario', 'calculation')) DEFAULT 'multiple_choice',
  options JSONB, -- For multiple choice questions
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  points_value INTEGER DEFAULT 10,
  scenario_data JSONB, -- For scenario-based questions
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_sessions
CREATE POLICY "Users can view own game sessions"
  ON game_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own game sessions"
  ON game_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own game sessions"
  ON game_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for session_rounds
CREATE POLICY "Users can view own session rounds"
  ON session_rounds
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM game_sessions 
      WHERE game_sessions.id = session_rounds.session_id 
      AND game_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own session rounds"
  ON session_rounds
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM game_sessions 
      WHERE game_sessions.id = session_rounds.session_id 
      AND game_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own session rounds"
  ON session_rounds
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM game_sessions 
      WHERE game_sessions.id = session_rounds.session_id 
      AND game_sessions.user_id = auth.uid()
    )
  );

-- RLS Policies for question_bank (read-only for authenticated users)
CREATE POLICY "Authenticated users can view questions"
  ON question_bank
  FOR SELECT
  TO authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON game_sessions(status);
CREATE INDEX IF NOT EXISTS idx_session_rounds_session_id ON session_rounds(session_id);
CREATE INDEX IF NOT EXISTS idx_session_rounds_round_number ON session_rounds(session_id, round_number);
CREATE INDEX IF NOT EXISTS idx_question_bank_category ON question_bank(category);
CREATE INDEX IF NOT EXISTS idx_question_bank_difficulty ON question_bank(difficulty);

-- Trigger for updating updated_at on game_sessions
CREATE TRIGGER on_game_sessions_updated
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger for updating updated_at on question_bank
CREATE TRIGGER on_question_bank_updated
  BEFORE UPDATE ON question_bank
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
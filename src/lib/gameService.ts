import { supabase } from './supabase'

export interface GameSession {
  id: string
  user_id: string
  status: 'active' | 'completed' | 'paused'
  total_score: number
  rounds_completed: number
  max_rounds: number
  started_at: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface SessionRound {
  id: string
  session_id: string
  round_number: number
  round_type: string
  question_id?: string
  question_data: any
  user_answer?: any
  correct_answer: any
  is_correct: boolean
  points_earned: number
  time_taken?: number
  completed_at?: string
  created_at: string
}

export interface Question {
  id: string
  category: string
  difficulty: string
  question_text: string
  question_type: string
  options?: any
  correct_answer: string
  explanation: string
  points_value: number
  scenario_data?: any
}

export interface GameStats {
  total_sessions: number
  completed_sessions: number
  total_score: number
  average_score: number
  best_score: number
  total_rounds: number
  accuracy_rate: number
}

export class GameService {
  // Start a new game session
  static async startGameSession(userId: string, maxRounds: number = 10): Promise<{ data: string | null, error: any }> {
    try {
      const { data, error } = await supabase.rpc('start_game_session', {
        p_user_id: userId,
        p_max_rounds: maxRounds
      })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get current active session for user
  static async getCurrentSession(userId: string): Promise<{ data: GameSession | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')

      if (error) {
        return { data: null, error }
      }

      // Return the first active session if found, otherwise null
      return { data: data && data.length > 0 ? data[0] : null, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Start a new round
  static async startRound(sessionId: string, roundType?: string): Promise<{ data: any, error: any }> {
    try {
      const { data, error } = await supabase.rpc('start_round', {
        p_session_id: sessionId,
        p_round_type: roundType || null
      })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Submit an answer
  static async submitAnswer(
    sessionId: string, 
    roundNumber: number, 
    userAnswer: string, 
    timeTaken?: number
  ): Promise<{ data: any, error: any }> {
    try {
      const { data, error } = await supabase.rpc('submit_answer', {
        p_session_id: sessionId,
        p_round_number: roundNumber,
        p_user_answer: userAnswer,
        p_time_taken: timeTaken
      })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get session rounds
  static async getSessionRounds(sessionId: string): Promise<{ data: SessionRound[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('session_rounds')
        .select('*')
        .eq('session_id', sessionId)
        .order('round_number', { ascending: true })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get user game statistics
  static async getUserStats(userId: string): Promise<{ data: GameStats | null, error: any }> {
    try {
      const { data, error } = await supabase.rpc('get_user_stats', {
        p_user_id: userId
      })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get user's game history
  static async getGameHistory(userId: string, limit: number = 10): Promise<{ data: GameSession[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Complete a game session manually (if needed)
  static async completeGameSession(sessionId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.rpc('complete_game_session', {
        p_session_id: sessionId
      })

      return { error }
    } catch (error) {
      return { error }
    }
  }

  // Get random question (for testing purposes)
  static async getRandomQuestion(
    category?: string, 
    difficulty: string = 'medium'
  ): Promise<{ data: Question | null, error: any }> {
    try {
      const { data, error } = await supabase.rpc('get_random_question', {
        p_category: category,
        p_difficulty: difficulty,
        p_exclude_ids: []
      })

      return { data: data?.[0] || null, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Pause a game session
  static async pauseGameSession(sessionId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('game_sessions')
        .update({ status: 'paused', updated_at: new Date().toISOString() })
        .eq('id', sessionId)

      return { error }
    } catch (error) {
      return { error }
    }
  }

  // Resume a paused game session
  static async resumeGameSession(sessionId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('game_sessions')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', sessionId)

      return { error }
    } catch (error) {
      return { error }
    }
  }

  // Get leaderboard (top scores)
  static async getLeaderboard(limit: number = 10): Promise<{ data: any[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select(`
          total_score,
          completed_at,
          profiles!inner(username)
        `)
        .eq('status', 'completed')
        .order('total_score', { ascending: false })
        .limit(limit)

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}
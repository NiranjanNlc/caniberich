import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  username: string
  financial_goal: string | null
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive' | null
  initial_budget: number | null
  current_points: number
  onboarding_data?: any | null
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    username?: string
    financial_goal?: string
    risk_tolerance?: string
    initial_budget?: string
  }
}
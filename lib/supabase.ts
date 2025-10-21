import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_tier?: 'free' | 'pro' | 'business' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface ApiKey {
  id: string
  user_id: string
  key_name: string
  key_value: string
  last_used?: string
  created_at: string
}

export interface UsageStats {
  user_id: string
  characters_used: number
  requests_count: number
  last_request: string
  monthly_limit: number
}
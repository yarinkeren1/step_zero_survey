import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Log environment variable status (without exposing values)
console.log('Supabase configuration check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  isProduction: process.env.NODE_ENV === 'production'
})

// Create a fallback client if credentials are missing
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Log client status
if (!supabase) {
  console.warn('Supabase client not initialized - environment variables may be missing')
}

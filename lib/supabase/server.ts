import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// Export createClient for direct use
export { createClient }

// Create a Supabase client for server components
export const createServerClient = () => {
  const cookieStore = cookies()

  // For server components, use the auth-helpers-nextjs
  if (typeof window === "undefined") {
    return createServerComponentClient<Database>({ cookies: () => cookieStore })
  }

  // Fallback for client components
  return createServerComponentClient<Database>({ cookies })
}

// Create a Supabase client with service role for admin operations
// This bypasses RLS policies
export const createServiceClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

  // For development, create a mock client if env vars are not set
  if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseServiceKey === 'placeholder-service-key') {
    console.warn('Supabase service role credentials not set. Using mock client for development.')
    return createClient<Database>(supabaseUrl, supabaseServiceKey)
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}

// Create a client for server actions
export const createActionClient = async () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

import { supabase } from './supabase'

export type UserRole = 'technician' | 'evaluator' | 'committee' | 'admin'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  company: string | null
  state_code: string | null
  phone: string | null
  trainer_certified: boolean
  created_at: string
}

// Sign in with email/password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// Sign up new user + create profile
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: UserRole = 'technician',
  company?: string,
  stateCode?: string
) {
  // Create auth user
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  if (!data.user) throw new Error('Signup failed')

  // Create profile record
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user.id,
      email,
      full_name: fullName,
      role,
      company: company || null,
      state_code: stateCode || null,
    })
  if (profileError) throw profileError

  return data
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current session
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Get current user's profile from profiles table
export async function getUserProfile(): Promise<UserProfile | null> {
  const session = await getSession()
  if (!session) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error) return null
  return data as UserProfile
}

// Get dashboard path by role
export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'technician': return '/dashboard'
    case 'evaluator': return '/evaluator'
    case 'committee': return '/committee'
    case 'admin': return '/admin'
    default: return '/dashboard'
  }
}

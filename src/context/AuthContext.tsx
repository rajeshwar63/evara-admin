import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { jwtDecode } from 'jwt-decode'
import type { Session } from '@supabase/supabase-js'

interface User {
  email: string
  name: string
  picture: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credential: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

interface GoogleJwtPayload {
  email: string
  name: string
  picture: string
}

function extractUser(session: Session | null): User | null {
  if (!session?.user) return null
  const { email, user_metadata } = session.user
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || ''
  if (adminEmail && email !== adminEmail) return null
  return {
    email: email || '',
    name: user_metadata?.full_name || user_metadata?.name || '',
    picture: user_metadata?.avatar_url || user_metadata?.picture || '',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(extractUser(session))
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(extractUser(session))
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function login(credential: string) {
    const decoded = jwtDecode<GoogleJwtPayload>(credential)
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || ''
    if (adminEmail && decoded.email !== adminEmail) {
      throw new Error('Access denied')
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: credential,
    })
    if (error) throw error
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

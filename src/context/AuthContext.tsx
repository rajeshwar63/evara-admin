import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'

interface User {
  email: string
  name: string
  picture: string
}

interface AuthContextType {
  user: User | null
  login: (credential: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

interface GoogleJwtPayload {
  email: string
  name: string
  picture: string
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('evara_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('evara_user')
      }
    }
  }, [])

  function login(credential: string) {
    const decoded = jwtDecode<GoogleJwtPayload>(credential)
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || ''
    if (adminEmail && decoded.email !== adminEmail) {
      throw new Error('Access denied')
    }
    const u: User = {
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    }
    setUser(u)
    localStorage.setItem('evara_user', JSON.stringify(u))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('evara_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

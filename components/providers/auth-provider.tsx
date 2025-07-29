"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/lib/data/users'
import { getCurrentUser, logoutUser } from '@/lib/data/users'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (user: User) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const login = (userData: User) => {
    console.log("🔄 AuthProvider: Actualizando usuario en contexto...")
    console.log("👤 Usuario a establecer:", userData)
    setUser(userData)
    console.log("✅ AuthProvider: Usuario establecido en contexto")
  }

  const logout = async () => {
    console.log("🔄 AuthProvider: Iniciando logout...")
    try {
      await logoutUser()
      console.log("✅ AuthProvider: Logout exitoso")
      setUser(null)
      console.log("🔄 AuthProvider: Usuario limpiado del contexto")
      router.push('/admin/login')
    } catch (error) {
      console.error('❌ AuthProvider: Error en logout:', error)
    }
  }

  const refreshUser = async () => {
    console.log("🔄 AuthProvider: Refrescando usuario...")
    try {
      const userData = await getCurrentUser()
      console.log("👤 AuthProvider: Usuario actual obtenido:", userData)
      setUser(userData)
    } catch (error) {
      console.error('❌ AuthProvider: Error refrescando usuario:', error)
      setUser(null)
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔄 AuthProvider: Inicializando autenticación...")
      try {
        const userData = await getCurrentUser()
        console.log("👤 AuthProvider: Usuario inicial:", userData)
        setUser(userData)
      } catch (error) {
        console.error('❌ AuthProvider: Error inicializando autenticación:', error)
        setUser(null)
      } finally {
        setLoading(false)
        console.log("✅ AuthProvider: Inicialización completada")
      }
    }

    initializeAuth()
  }, [])

  // Log cuando el estado del usuario cambia
  useEffect(() => {
    console.log("🔄 AuthProvider: Estado del usuario cambiado:", user)
  }, [user])

  // Log cuando el estado de loading cambia
  useEffect(() => {
    console.log("🔄 AuthProvider: Estado de loading cambiado:", loading)
  }, [loading])

  const value = {
    user,
    loading,
    login,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { supabase } from './supabase'
import type { Session, User } from '@supabase/supabase-js'
import type { TeamProfile } from './types'
import { getTeamProfile } from './team'
import { AuthContext } from './auth-context'
import type { AuthContextType } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [teamProfile, setTeamProfile] = useState<TeamProfile | null>(null)
  const [teamProfileLoading, setTeamProfileLoading] = useState(false)

  async function loadTeamProfile(userId: string | null | undefined) {
    if (!userId) {
      setTeamProfile(null)
      return
    }
    setTeamProfileLoading(true)
    try {
      const profile = await getTeamProfile(userId)
      setTeamProfile(profile)
    } catch (error) {
      console.error('Error loading team profile:', error)
      setTeamProfile(null)
    } finally {
      setTeamProfileLoading(false)
    }
  }

  const refreshTeamProfile = async () => {
    if (user?.id) {
      await loadTeamProfile(user.id)
    }
  }

  useEffect(() => {
    let mounted = true

    async function initializeAuth() {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()
        if (!mounted) return
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        if (currentSession?.user?.id && mounted) {
          await loadTeamProfile(currentSession.user.id)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return
      setSession(newSession)
      setUser(newSession?.user ?? null)
      await loadTeamProfile(newSession?.user?.id ?? null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setTeamProfile(null)
  }

  const value: AuthContextType = {
    session,
    user,
    loading,
    signOut,
    teamProfile,
    teamProfileLoading,
    refreshTeamProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

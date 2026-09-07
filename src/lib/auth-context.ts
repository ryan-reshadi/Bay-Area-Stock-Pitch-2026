import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { TeamProfile } from './types'

export interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  teamProfile: TeamProfile | null
  teamProfileLoading: boolean
  refreshTeamProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

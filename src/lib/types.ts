export interface TeamProfile {
  id: string
  user_id: string
  team_name: string
  member1_name: string | null
  member2_name: string | null
  member3_name: string | null
  pitch_deck_url: string | null
  pitch_deck_filename: string | null
  created_at: string
  updated_at: string
}
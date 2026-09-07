import { supabase } from './supabase'
import type { TeamProfile } from './types'

export async function getTeamProfile(userId: string): Promise<TeamProfile | null> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching team profile:', error)
    return null
  }

  return data
}

export async function upsertTeamProfile(
  userId: string,
  profile: Partial<Omit<TeamProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<TeamProfile | null> {
  const { data, error } = await supabase
    .from('teams')
    .upsert(
      {
        user_id: userId,
        ...profile,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) {
    console.error('Error upserting team profile:', error)
    return null
  }

  return data
}

export async function uploadPitchDeck(
  userId: string,
  file: File
): Promise<{ url: string; filename: string } | null> {
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('pitch-decks')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) {
    console.error('Error uploading pitch deck:', uploadError)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('pitch-decks')
    .getPublicUrl(filePath)

  return {
    url: urlData.publicUrl,
    filename: file.name,
  }
}

export async function deletePitchDeck(userId: string): Promise<boolean> {
  const { data, error } = await supabase.storage
    .from('pitch-decks')
    .list(userId)

  if (error) {
    console.error('Error listing pitch deck files:', error)
    return false
  }

  if (data && data.length > 0) {
    const filesToRemove = data.map((file) => `${userId}/${file.name}`)
    const { error: deleteError } = await supabase.storage
      .from('pitch-decks')
      .remove(filesToRemove)

    if (deleteError) {
      console.error('Error deleting pitch deck:', deleteError)
      return false
    }
  }

  return true
}

export async function clearPitchDeckReference(userId: string): Promise<void> {
  const { error } = await supabase
    .from('teams')
    .update({
      pitch_deck_url: null,
      pitch_deck_filename: null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    console.error('Error clearing pitch deck reference:', error)
  }
}
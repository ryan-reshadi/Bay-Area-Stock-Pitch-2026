import { supabase } from './supabase'
import type { TeamProfile } from './types'

/**
 * Result shape for operations that previously collapsed failure into `null`.
 *
 * Returning `null` on error made every upstream caller report the same generic
 * message regardless of the actual cause, and discarded the PostgREST error
 * object that `describeAuthError` needs to explain the failure.
 */
export interface OperationResult<T> {
  data: T | null
  error: unknown
}

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

export async function updateTeamProfile(
  userId: string,
  profile: Partial<Omit<TeamProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<OperationResult<TeamProfile>> {
  // The teams row is created during signup by the direct_signup RPC,
  // so every later change updates an existing row.
  //
  // A plain update() is used rather than upsert() on purpose. With
  // INSERT ... ON CONFLICT, Postgres still constructs the INSERT leg,
  // which must satisfy every NOT NULL column that has no default —
  // even when the row already exists and the conflict path would run
  // instead. Omitting such a column (team_name is the usual one)
  // fails the whole statement with 23502, so no field is saved.
  const { data, error } = await supabase
    .from('teams')
    .update({
      ...profile,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

export async function uploadPitchDeck(
  userId: string,
  file: File
): Promise<OperationResult<{ url: string; filename: string }>> {
  // Strip anything that is not filename-safe. The original name is preserved in
  // the teams row, so this only affects the storage key.
  const safeName = (file.name || 'pitch-deck').replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `${userId}/${Date.now()}-${safeName}`

  // upsert is deliberately false: the path is unique per upload, so `upsert:
  // true` never actually overwrote anything and every resubmission left the
  // previous file behind as an orphan.
  const { error: uploadError } = await supabase.storage
    .from('pitch-decks')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    return { data: null, error: uploadError }
  }

  const { data: urlData } = supabase.storage
    .from('pitch-decks')
    .getPublicUrl(filePath)

  // Only now that the new file is safely stored, drop the previous submission
  // so a team has exactly one pitch deck on file. Doing this before the upload
  // would risk destroying the old file if the upload then failed.
  const { data: existing } = await supabase.storage
    .from('pitch-decks')
    .list(userId)

  const stale = (existing ?? [])
    .filter((object) => `${userId}/${object.name}` !== filePath)
    .map((object) => `${userId}/${object.name}`)

  if (stale.length > 0) {
    const { error: cleanupError } = await supabase.storage
      .from('pitch-decks')
      .remove(stale)

    if (cleanupError) {
      // The new deck is stored and usable, so this is not worth failing the
      // upload over. Log it instead.
      console.error('Could not remove previous pitch deck(s):', cleanupError)
    }
  }

  return {
    data: {
      url: urlData.publicUrl,
      filename: file.name,
    },
    error: null,
  }
}

/**
 * Resolves a link the browser can actually open for the stored pitch deck.
 *
 * `pitch_deck_url` in the teams row is a public URL, which only works while the
 * bucket is public. The bucket is created private by
 * 20260902_create_pitch_deck_storage.sql, so prefer a short-lived signed URL
 * and fall back to the stored public URL when signing is unavailable.
 *
 * The object is located by listing the caller's folder rather than trusting the
 * stored URL, so the link still works if the stored path is stale.
 */
export async function createPitchDeckViewUrl(
  userId: string
): Promise<OperationResult<string>> {
  const { data: files, error: listError } = await supabase.storage
    .from('pitch-decks')
    .list(userId)

  if (listError) {
    return { data: null, error: listError }
  }

  const latest = (files ?? [])
    .filter((object) => object.name)
    .sort(
      (a, b) =>
        new Date(b.updated_at ?? b.created_at ?? 0).getTime() -
        new Date(a.updated_at ?? a.created_at ?? 0).getTime()
    )[0]

  if (!latest) {
    return { data: null, error: null }
  }

  const { data: signed, error: signError } = await supabase.storage
    .from('pitch-decks')
    .createSignedUrl(`${userId}/${latest.name}`, 3600)

  if (signError || !signed?.signedUrl) {
    // Public bucket, or signing not permitted: the public URL still resolves.
    const { data: publicUrl } = supabase.storage
      .from('pitch-decks')
      .getPublicUrl(`${userId}/${latest.name}`)

    return { data: publicUrl.publicUrl, error: null }
  }

  return { data: signed.signedUrl, error: null }
}

export async function deletePitchDeck(userId: string): Promise<OperationResult<true>> {
  const { data: files, error: listError } = await supabase.storage
    .from('pitch-decks')
    .list(userId)

  if (listError) {
    return { data: null, error: listError }
  }

  if (files && files.length > 0) {
    const filesToRemove = files.map((file) => `${userId}/${file.name}`)
    const { error: deleteError } = await supabase.storage
      .from('pitch-decks')
      .remove(filesToRemove)

    if (deleteError) {
      return { data: null, error: deleteError }
    }
  }

  return { data: true, error: null }
}

export async function clearPitchDeckReference(userId: string): Promise<OperationResult<true>> {
  const { error } = await supabase
    .from('teams')
    .update({
      pitch_deck_url: null,
      pitch_deck_filename: null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    return { data: null, error }
  }

  return { data: true, error: null }
}
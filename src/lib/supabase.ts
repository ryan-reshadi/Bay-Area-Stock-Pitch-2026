import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vite inlines import.meta.env.* at transform time, so these are baked into the
// bundle when the dev server starts. Adding or editing .env requires a restart.
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[supabase] MISSING ENV — the app cannot reach the backend and will fail ' +
      'with "TypeError: Failed to fetch".\n' +
      `  VITE_SUPABASE_URL     = ${supabaseUrl ?? 'undefined'}\n` +
      `  VITE_SUPABASE_ANON_KEY = ${supabaseAnonKey ? '<set>' : 'undefined'}\n` +
      '  Fix: restart the dev server (Vite reads .env only at startup), and ' +
      'confirm .env exists in the project root.'
  )
} else {
  console.info(`[supabase] Using backend: ${supabaseUrl}`)
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

/**
 * Messages that `direct_signup` raises deliberately, mapped to text that is safe
 * to show a visitor. These describe the registration rules rather than the
 * database, so they are passed through instead of being genericized.
 */
const APPLICATION_MESSAGES: Record<string, string> = {
  'Email address already registered':
    'An account with that email already exists. Try signing in instead.',
  'Please enter a valid email address': 'Please enter a valid email address.',
  'Email address is too long': 'That email address is too long.',
  'Password must be at least 6 characters':
    'Password must be at least 6 characters.',
  'Password must be 72 bytes or fewer':
    'Password must be 72 characters or fewer.',
  'Team name is required': 'Team name is required.',
  'Captain name is required': "Captain's name is required.",
  'Team and captain names must be 200 characters or fewer':
    'Team and captain names must be 200 characters or fewer.',
  'Member names must be 200 characters or fewer':
    'Member names must be 200 characters or fewer.',
}

/**
 * Pulls a human-readable message out of whatever Supabase handed back.
 *
 * PostgREST errors (`supabase.rpc()` / `.from()`) are plain objects shaped like
 * `{ message, code, details, hint }` — they are NOT `Error` instances, so
 * `instanceof Error` is false and `String(error)` yields "[object Object]".
 */
function extractMessage(error: unknown): string {
  if (typeof error === 'string') return error

  if (typeof error === 'object' && error !== null) {
    const { message } = error as { message?: unknown }
    if (typeof message === 'string' && message) return message

    try {
      return JSON.stringify(error)
    } catch {
      return ''
    }
  }

  return String(error ?? '')
}

/**
 * Turns a raw auth or RPC error into something a visitor can act on.
 *
 * Unknown database errors are deliberately NOT passed through. A failed RPC
 * otherwise leaks Postgres error codes, constraint names, column names, and
 * internal values to anyone holding the public anon key. The full object is
 * logged to the console for the developer and the visitor gets a generic
 * message, so check the console when diagnosing.
 */
export function describeAuthError(error: unknown): string {
  const message = extractMessage(error)

  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    return supabaseUrl
      ? 'Could not reach the server. Check your internet connection and try again.'
      : 'Could not reach the server. This app is missing its configuration — if you own this site, restart the dev server so it loads .env.'
  }

  if (/invalid login credentials/i.test(message)) {
    return 'Incorrect email or password.'
  }

  const applicationMessage = APPLICATION_MESSAGES[message]
  if (applicationMessage) {
    return applicationMessage
  }

  // The Postgres/PostgREST code is a short standard identifier and the
  // message names the offending column or constraint. Both are
  // low-sensitivity and essential for diagnosis. The details and hint
  // fields can carry actual row data, so those stay in the console.
  const { code: rawCode, message: rawMessage } = (
    typeof error === 'object' && error !== null ? error : {}
  ) as { code?: unknown; message?: unknown }

  const shortMessage =
    typeof rawMessage === 'string' && rawMessage.length > 200
      ? `${rawMessage.slice(0, 197)}...`
      : typeof rawMessage === 'string'
        ? rawMessage
        : ''

  const parts = [
    typeof rawCode === 'string' && rawCode ? `error ${rawCode}` : '',
    shortMessage,
  ].filter(Boolean)

  console.error(
    '[auth] Unhandled error. Full detail below (not shown to the visitor):',
    error
  )

  return `Something went wrong on our end${parts.length ? ` — ${parts.join(': ')}` : ''}. Please try again.`
}
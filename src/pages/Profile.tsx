import { useState, useRef } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Upload, ExternalLink, Trash2, Save, File } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../lib/useAuth'
import {
  upsertTeamProfile,
  uploadPitchDeck,
  deletePitchDeck,
  clearPitchDeckReference,
} from '../lib/team'

const ACCEPTED_EXTENSIONS = ['pptx', 'ppt', 'pdf']
const MAX_FILE_SIZE_MB = 50

export default function Profile() {
  const { user, teamProfile, teamProfileLoading, refreshTeamProfile, signOut } =
    useAuth()

  const [teamName, setTeamName] = useState(teamProfile?.team_name || '')
  const [memberNames, setMemberNames] = useState<string[]>([
    teamProfile?.member1_name || '',
    teamProfile?.member2_name || '',
    teamProfile?.member3_name || '',
  ])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const updateMemberName = (index: number, value: string) => {
    setMemberNames((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (!teamName.trim()) {
      setError('Team name is required.')
      setLoading(false)
      return
    }

    try {
      const result = await upsertTeamProfile(user!.id, {
        team_name: teamName.trim(),
        member1_name: memberNames[0]?.trim() || null,
        member2_name: memberNames[1]?.trim() || null,
        member3_name: memberNames[2]?.trim() || null,
      })

      if (!result) {
        setError('Failed to save profile. Please try again.')
      } else {
        setSuccess('Profile updated successfully.')
        await refreshTeamProfile()
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handlePitchDeckUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setSuccess(null)

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !ACCEPTED_EXTENSIONS.includes(ext)) {
      setError(
        `Please upload a ${ACCEPTED_EXTENSIONS.join(', ')} file.`
      )
      return
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(
        `File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`
      )
      return
    }

    setUploading(true)

    try {
      const result = await uploadPitchDeck(user!.id, file)

      if (!result) {
        setError('Failed to upload pitch deck. Please try again.')
      } else {
        await upsertTeamProfile(user!.id, {
          pitch_deck_url: result.url,
          pitch_deck_filename: result.filename,
        })
        setSuccess(`Pitch deck uploaded: ${result.filename}`)
        await refreshTeamProfile()
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      )
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  async function handleRemovePitchDeck() {
    if (!user) return
    if (
      !window.confirm(
        'Remove this pitch deck? You can upload a new one at any time.'
      )
    )
      return

    setError(null)
    setSuccess(null)
    setUploading(true)

    try {
      await deletePitchDeck(user.id)
      await clearPitchDeckReference(user.id)
      setSuccess('Pitch deck removed.')
      await refreshTeamProfile()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to remove pitch deck.'
      )
    } finally {
      setUploading(false)
    }
  }

  if (teamProfileLoading) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen bg-obsidian">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-16 sm:pt-24 pb-24">
            <div className="font-mono text-[11px] tracking-[0.35em] text-brass uppercase mb-6">
              Loading profile
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-obsidian">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-16 sm:pt-24 pb-24">
          <div className="flex justify-between items-baseline mb-10">
            <div className="font-mono text-[11px] tracking-[0.35em] text-brass uppercase">
              Team Profile
            </div>
            <button
              onClick={signOut}
              className="font-mono text-[10px] tracking-[0.2em] text-[#8a9a8a] hover:text-brass uppercase transition-colors"
            >
              Sign out
            </button>
          </div>

          <h1 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl mb-4">
            Manage your <span className="italic text-brass">team.</span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-[#3a3a3a] mb-8">
            Update your team name, member list, and upload your pitch deck.
            Changes are saved to your team account automatically.
          </p>

          <div className="border border-[#2f3d2a] bg-[#1a261a]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a3a2a] bg-[#141d14]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brass" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2f3d2a]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2f3d2a]" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#8a9a8a] uppercase">
                basp@profile: ~
              </span>
            </div>

            <div className="p-6 sm:p-10">
              <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-6">
                  <div className="font-mono text-[10px] tracking-[0.3em] text-meta uppercase">
                    Team details
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.3em] text-[#8a9a8a] uppercase mb-3">
                      Team name
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. Alpha Capital"
                      required
                      className="w-full bg-transparent border-b-2 border-[#2f3d2a] focus:border-brass outline-none font-mono text-lg text-[#f4f1ea] py-3 transition-colors placeholder:text-[#3f4a3f]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.3em] text-[#8a9a8a] uppercase mb-3">
                      Team members (1–3)
                    </label>
                    <p className="font-mono text-xs text-[#8a9a8a] mb-4">
                      Enter the names of everyone on your team. The first member
                      is the team captain (the email used to register).
                    </p>

                    <div className="space-y-5">
                      {memberNames.map((name, index) => (
                        <div key={index}>
                          <label className="block font-mono text-[10px] tracking-[0.3em] text-[#8a9a8a] uppercase mb-2">
                            Member {index + 1}
                            {index === 0 && ' (Captain)'}
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                              updateMemberName(index, e.target.value)
                            }
                            placeholder={
                              index === 0
                                ? 'Team captain name'
                                : 'Team member name'
                            }
                            className="w-full bg-transparent border-b-2 border-[#2f3d2a] focus:border-brass outline-none font-mono text-lg text-[#f4f1ea] py-2 transition-colors placeholder:text-[#3f4a3f]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#2a3a2a] pt-8 space-y-6">
                  <div className="font-mono text-[10px] tracking-[0.3em] text-meta uppercase">
                    Pitch deck submission
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.3em] text-[#8a9a8a] uppercase mb-3">
                      Upload pitch deck (.pptx, .ppt, or .pdf)
                    </label>
                    <p className="font-mono text-xs text-[#8a9a8a] mb-4">
                      Maximum file size: {MAX_FILE_SIZE_MB}MB. This is how
                      teams submit their pitch decks.
                    </p>

                    <div className="border border-[#2f3d2a] border-dashed">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pptx,.ppt,.pdf"
                        onChange={handlePitchDeckUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full px-6 py-8 flex flex-col items-center justify-center gap-3 font-mono text-xs text-[#8a9a8a] hover:text-[#f4f1ea] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload size={24} className="text-brass" />
                        <span>{uploading ? 'Uploading...' : 'Choose a file'}</span>
                      </button>
                    </div>
                  </div>

                  {(teamProfile?.pitch_deck_url ||
                    teamProfile?.pitch_deck_filename) && (
                    <div className="border border-[#2f3d2a] bg-[#141d14] p-5">
                      <div className="font-mono text-[10px] tracking-[0.3em] text-meta uppercase mb-3">
                        Current submission
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <File size={20} className="text-brass" />
                          <div>
                            <span className="font-mono text-sm text-[#f4f1ea]">
                              {teamProfile?.pitch_deck_filename ||
                                'pitch-deck-file'}
                            </span>
                            <div className="font-mono text-[10px] tracking-[0.2em] text-[#8a9a8a]">
                              Uploaded
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {teamProfile?.pitch_deck_url && (
                            <a
                              href={teamProfile.pitch_deck_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.2em] text-brass uppercase hover:underline"
                            >
                              <ExternalLink size={12} />
                              View
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={handleRemovePitchDeck}
                            disabled={uploading}
                            className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.2em] text-[#8a9a8a] hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={12} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3 border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-xs">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 border border-cyan-pulse/40 bg-cyan-pulse/10 text-cyan-pulse font-mono text-xs">
                    {success}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading || !teamName.trim()}
                    className={`group inline-flex items-center justify-center gap-2 px-7 py-3.5 font-mono text-xs font-bold tracking-[0.25em] uppercase transition-all ${
                      loading || !teamName.trim()
                        ? 'bg-[#2a3a2a] text-[#5a6a5a] cursor-not-allowed'
                        : 'bg-cyan-pulse text-[#1a261a] hover:bg-lime-hover cursor-pointer'
                    }`}
                    style={
                      loading || !teamName.trim()
                        ? {}
                        : {
                            boxShadow:
                              '0 0 20px rgba(204,255,0,0.4), 0 0 40px rgba(204,255,0,0.2)',
                          }
                    }
                  >
                    <Save size={14} />
                    {loading ? 'Saving...' : 'Save profile'}
                  </button>
                  <Link
                    to="/"
                    className="font-mono text-xs tracking-[0.2em] uppercase text-[#8a9a8a] hover:text-brass transition-colors"
                  >
                    Back to home
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <p className="mt-6 font-mono text-[10px] tracking-[0.2em] text-[#9a9a90] uppercase">
            Team profile data is stored securely in your Supabase project.
            Only you can access your own team's information.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}

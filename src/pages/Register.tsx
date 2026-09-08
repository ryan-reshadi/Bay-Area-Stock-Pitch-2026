import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Register() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [teamName, setTeamName] = useState('')
  const [captainName, setCaptainName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [member2Name, setMember2Name] = useState('')
  const [member3Name, setMember3Name] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (authLoading) {
    return null
  }

  const passwordsMatch = password === confirmPassword
  const canSubmit =
    teamName.trim().length > 0 &&
    captainName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    passwordsMatch

  if (user) {
    return <Navigate to="/profile" replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!passwordsMatch) {
      setError('Passwords do not match.')
      return
    }

    if (!canSubmit) return

    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      // Bypass GoTrue's signup entirely — the direct_signup RPC function
      // creates the user with email_confirmed_at = now() (no confirmation email
      // sent), which avoids GoTrue's email rate limit. It also creates the
      // team profile in the same transaction.
      const { data: userId, error: signupError } = await supabase.rpc(
        'direct_signup',
        {
          p_email: email.trim(),
          p_password: password,
          p_team_name: teamName.trim(),
          p_captain_name: captainName.trim(),
          p_member2_name: member2Name.trim() || null,
          p_member3_name: member3Name.trim() || null,
        }
      )

      if (signupError) {
        setError(signupError.message)
        setLoading(false)
        return
      }

      if (!userId) {
        setError('Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      // Sign in to establish an authenticated session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        // Account was created but session could not be established.
        // This is extremely unlikely since we auto-confirmed the email,
        // but handle it by redirecting to login.
        setError(
          'Account created but login failed. Please sign in manually.'
        )
        setLoading(false)
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      setSuccess('Team account created! Redirecting to your profile...')
      setTimeout(() => navigate('/profile'), 1500)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-obsidian">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-16 sm:pt-24 pb-24">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <div className="font-mono text-[11px] tracking-[0.35em] text-brass uppercase mb-6">
                Team Registration
              </div>
              <h1 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl">
                Create your <span className="italic text-brass">team account.</span>
              </h1>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-[#3a3a3a]">
                Register your team of 1&#8211;3 members. The team captain's email becomes
                your login. After signing up you can manage your profile, update team
                members, and upload your pitch deck.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="border border-[#2f3d2a] bg-[#1a261a]">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a3a2a] bg-[#141d14]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2f3d2a]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-brass" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2f3d2a]" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#8a9a8a] uppercase">
                    basp@register: ~
                  </span>
                </div>

                <div className="p-6 sm:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                        Captain's name
                      </label>
                      <input
                        type="text"
                        value={captainName}
                        onChange={(e) => setCaptainName(e.target.value)}
                        placeholder="Jane Doe"
                        required
                        className="w-full bg-transparent border-b-2 border-[#2f3d2a] focus:border-brass outline-none font-mono text-lg text-[#f4f1ea] py-3 transition-colors placeholder:text-[#3f4a3f]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] tracking-[0.3em] text-[#8a9a8a] uppercase mb-3">
                        Captain's email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full bg-transparent border-b-2 border-[#2f3d2a] focus:border-brass outline-none font-mono text-lg text-[#f4f1ea] py-3 transition-colors placeholder:text-[#3f4a3f]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] tracking-[0.3em] text-[#8a9a8a] uppercase mb-3">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                          required
                          minLength={6}
                          className="w-full bg-transparent border-b-2 border-[#2f3d2a] focus:border-brass outline-none font-mono text-lg text-[#f4f1ea] py-3 pr-10 transition-colors placeholder:text-[#3f4a3f]"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-[#5a6a5a] hover:text-brass transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] tracking-[0.3em] text-[#8a9a8a] uppercase mb-3">
                        Confirm password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                        required
                        className={`w-full bg-transparent border-b-2 focus:border-brass outline-none font-mono text-lg text-[#f4f1ea] py-3 transition-colors placeholder:text-[#3f4a3f] ${
                          !passwordsMatch && confirmPassword
                            ? 'border-red-500/60'
                            : 'border-[#2f3d2a]'
                        }`}
                      />
                      {!passwordsMatch && confirmPassword && (
                        <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-red-400 uppercase">
                          Passwords do not match
                        </p>
                      )}
                    </div>

                    <div className="border-t border-[#2a3a2a] pt-6">
                      <div className="font-mono text-[10px] tracking-[0.3em] text-meta uppercase mb-3">
                        Team members (optional)
                      </div>
                      <p className="font-mono text-xs text-[#8a9a8a] mb-4">
                        Add the names of up to two more team members. You can edit
                        these later in your profile.
                      </p>

                      <div className="space-y-5">
                        <div>
                          <label className="block font-mono text-[10px] tracking-[0.3em] text-[#8a9a8a] uppercase mb-2">
                            Member 2
                          </label>
                          <input
                            type="text"
                            value={member2Name}
                            onChange={(e) => setMember2Name(e.target.value)}
                            placeholder="Leave blank if none"
                            className="w-full bg-transparent border-b-2 border-[#2f3d2a] focus:border-brass outline-none font-mono text-lg text-[#f4f1ea] py-2 transition-colors placeholder:text-[#3f4a3f]"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] tracking-[0.3em] text-[#8a9a8a] uppercase mb-2">
                            Member 3
                          </label>
                          <input
                            type="text"
                            value={member3Name}
                            onChange={(e) => setMember3Name(e.target.value)}
                            placeholder="Leave blank if none"
                            className="w-full bg-transparent border-b-2 border-[#2f3d2a] focus:border-brass outline-none font-mono text-lg text-[#f4f1ea] py-2 transition-colors placeholder:text-[#3f4a3f]"
                          />
                        </div>
                      </div>
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

                    <button
                      type="submit"
                      disabled={loading || !canSubmit}
                      className={`group inline-flex items-center justify-center gap-2 w-full px-7 py-3.5 font-mono text-xs font-bold tracking-[0.25em] uppercase transition-all ${
                        loading || !canSubmit
                          ? 'bg-[#2a3a2a] text-[#5a6a5a] cursor-not-allowed'
                          : 'bg-cyan-pulse text-[#1a261a] hover:bg-lime-hover cursor-pointer'
                      }`}
                      style={
                        loading || !canSubmit
                          ? {}
                          : {
                              boxShadow:
                                '0 0 20px rgba(204,255,0,0.4), 0 0 40px rgba(204,255,0,0.2)',
                            }
                      }
                    >
                      {loading ? 'Creating team...' : 'Create team account'}
                    </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-[#2a3a2a]">
                    <p className="font-mono text-xs text-[#8a9a8a]">
                      Already have an account?{' '}
                      <Link
                        to="/login"
                        className="text-brass hover:underline"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-[#9a9a90] uppercase">
                By creating an account, you agree to participate in the Bay Area Stock Pitch competition. Your team captain email serves as your login.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Login() {
  const { user, loading: authLoading } = useAuth()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: string })?.from ?? '/profile'

  if (authLoading) {
    return null
  }

  if (user) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) {
        setError(authError.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
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
                Account Portal
              </div>
              <h1 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl">
                Welcome <span className="italic text-brass">back.</span>
              </h1>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-[#3a3a3a]">
                Sign in to your team account. Your email is the team captain's
                email used during registration.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="border border-[#2f3d2a] bg-[#1a261a]">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a3a2a] bg-[#141d14]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2f3d2a]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2f3d2a]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-brass" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#8a9a8a] uppercase">
                    basp@login: ~
                  </span>
                </div>

                <div className="p-6 sm:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block font-mono text-[10px] tracking-[0.3em] text-[#8a9a8a] uppercase mb-3">
                        Email
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
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-transparent border-b-2 border-[#2f3d2a] focus:border-brass outline-none font-mono text-lg text-[#f4f1ea] py-3 transition-colors placeholder:text-[#3f4a3f]"
                      />
                    </div>

                    {error && (
                      <div className="p-3 border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-xs">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`group inline-flex items-center gap-2 w-full px-7 py-3.5 font-mono text-xs font-bold tracking-[0.25em] uppercase transition-all ${
                        loading
                          ? 'bg-[#2a3a2a] text-[#5a6a5a] cursor-not-allowed'
                          : 'bg-cyan-pulse text-[#1a261a] hover:bg-lime-hover cursor-pointer'
                      }`}
                      style={!loading ? { boxShadow: '0 0 20px rgba(204,255,0,0.4), 0 0 40px rgba(204,255,0,0.2)' } : {}}
                    >
                      {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-[#2a3a2a]">
                    <p className="font-mono text-xs text-[#8a9a8a]">
                      Don't have an account?{' '}
                      <Link
                        to="/register"
                        className="text-brass hover:underline"
                      >
                        Register your team
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

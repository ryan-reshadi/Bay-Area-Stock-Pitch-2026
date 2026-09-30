import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Countdown from '../components/Countdown'
import { useAuth } from '../lib/useAuth'

const whyBaspCards = [
  {
    number: '01',
    title: 'Run by students',
    text: 'Created by students who want to make investing more accessible, more rigorous, and more exciting.',
  },
  {
    number: '02',
    title: 'Practice with purpose',
    text: 'Build the research and presentation instincts that will serve you in future competitions, classrooms, and careers.',
  },
  {
    number: '03',
    title: 'Make it count',
    text: 'Take your work seriously, make smart investment decisions, and earn recognition for the way you think.',
  },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <>
      <Header />
      <main>
        <section className="relative min-h-screen w-full overflow-hidden bg-obsidian pt-16 sm:pt-20">
          <div
            className="absolute inset-0 z-0 transition-transform duration-300 ease-out"
            style={{
              transform: 'scale(1.08)',
              backgroundImage: "url('/images/hero-bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.25,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/40" />
          </div>
          <div className="absolute inset-0 z-10 pointer-events-none grid-ledger opacity-60" />

          <div className="relative z-20 mx-auto max-w-[1400px] px-5 sm:px-8 grid lg:grid-cols-12 gap-8 min-h-[calc(100vh-5rem)] items-center py-12">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 rounded-full bg-brass animate-pulse" />
                <span className="font-mono text-[11px] tracking-[0.35em] text-[#5a5a55] uppercase">
                  Inaugural Year &#183; Bay Area
                </span>
              </div>

              <h1 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance">
                <span className="block text-6xl sm:text-8xl lg:text-[7.5rem]">Make your</span>
                <span className="block text-6xl sm:text-8xl lg:text-[7.5rem] italic text-brass">case.</span>
              </h1>

              <p className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-[#3a3a3a] font-body">
                A stock pitch competition for Northern California high school students ready to think like investors and present like professionals.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="group relative inline-flex items-center gap-3 px-7 py-4 bg-foreground text-primary-foreground font-mono text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#2a2a2a] transition-all"
                    >
                      View your profile
                      <span className="transition-transform group-hover:translate-x-1">&#8594;</span>
                    </Link>
                    <Link
                      to="/competition"
                      className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] uppercase text-foreground border-b border-transparent hover:border-brass hover:text-brass transition-all pb-1"
                    >
                      Explore the competition
                      <span className="transition-transform group-hover:translate-x-1">&#8594;</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="group relative inline-flex items-center gap-3 px-7 py-4 bg-foreground text-primary-foreground font-mono text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#2a2a2a] transition-all"
                    >
                      Register your team
                      <span className="transition-transform group-hover:translate-x-1">&#8594;</span>
                    </Link>
                    <Link
                      to="/competition"
                      className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] uppercase text-foreground border-b border-transparent hover:border-brass hover:text-brass transition-all pb-1"
                    >
                      Explore the competition
                      <span className="transition-transform group-hover:translate-x-1">&#8594;</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 lg:pl-8">
              <div className="relative border border-[#2f3d2a] bg-[#1a261a]/90 backdrop-blur-md p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-pulse animate-pulse" />
                    <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-pulse uppercase">
                      The Market Is Open
                    </span>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-[#8a9a8a]">LIVE</span>
                </div>

                <div className="font-mono text-[#f4f1ea] leading-tight">
                  <div className="text-2xl sm:text-3xl font-light tracking-tight">BUY, SELL, OR HOLD</div>
                  <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-brass">YOUR STOCK</div>
                </div>

                <div className="my-6 h-24 relative overflow-hidden">
                  <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="trend" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ccff00" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#ccff00" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                    {[...Array(8)].map((_, i) => (
                      <line key={i} x1="0" y1={i * 14} x2="400" y2={i * 14} stroke="#2a3a2a" strokeWidth="0.5" />
                    ))}
                    <path
                      d="M0,80 L60,72 L120,78 L180,55 L240,60 L300,30 L360,38 L400,12"
                      fill="none"
                      stroke="url(#trend)"
                      strokeWidth="2"
                    />
                    <circle cx="400" cy="12" r="3" fill="#ccff00" />
                  </svg>
                </div>

                <div className="pt-5 border-t border-[#2a3a2a]">
                  <div className="font-mono text-[10px] tracking-[0.3em] text-[#8a9a8a] mb-3 uppercase">
                    01 / The Opening Bell
                  </div>
                  <Countdown dark />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-20 border-t border-warm bg-obsidian/90 backdrop-blur-sm">
          <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-3">
            <div className="px-5 sm:px-8 py-6 sm:py-8 border-b md:border-b-0 md:border-r border-warm">
              <div className="font-mono text-[10px] tracking-[0.3em] text-meta uppercase mb-2">When</div>
              <div className="text-lg sm:text-xl font-display text-foreground tracking-tight">November 14, 2026</div>
              <div className="mt-1 font-mono text-xs tracking-wider text-brass uppercase">Tentative</div>
            </div>
            <div className="px-5 sm:px-8 py-6 sm:py-8 border-b md:border-b-0 md:border-r border-warm">
              <div className="font-mono text-[10px] tracking-[0.3em] text-meta uppercase mb-2">Where</div>
              <div className="text-lg sm:text-xl font-display text-foreground tracking-tight">Homestead High School</div>
              <div className="mt-1 font-mono text-xs tracking-wider text-brass uppercase">Cupertino, California</div>
            </div>
            <div className="px-5 sm:px-8 py-6 sm:py-8">
              <div className="font-mono text-[10px] tracking-[0.3em] text-meta uppercase mb-2">Who</div>
              <div className="text-lg sm:text-xl font-display text-foreground tracking-tight">Northern California high school students</div>
              <div className="mt-1 font-mono text-xs tracking-wider text-brass uppercase">Teams of 1&#8211;3</div>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="section-index mb-6">01 <span>Why BASP</span></div>
            <h2 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl lg:text-8xl">
              Real companies.<br />
              <span className="italic text-brass">Real conviction.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#3a3a3a]">
              Learning to invest is more than reading a ticker. It is asking better questions, finding the signal in the noise, and standing behind an idea when the room pushes back.
            </p>
            <Link to="/competition" className="btn-text mt-8 inline-flex">
              See what to expect <ArrowUpRight className="w-4 h-4" />
            </Link>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-warm border border-warm">
              {whyBaspCards.map((card) => (
                <article key={card.number} className="group relative bg-card p-8 sm:p-10 transition-colors hover:bg-card-hover">
                  <div className="font-display text-5xl sm:text-6xl text-brass font-light tracking-tight mb-6 transition-transform group-hover:-translate-y-1">
                    {card.number}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl text-foreground tracking-tight mb-4">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-[#5a5a55]">{card.text}</p>
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-brass transition-all duration-500 group-hover:w-full" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative h-40 sm:h-52 w-full overflow-hidden bg-secondary">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('/images/divider-texture.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-secondary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 sm:w-24 bg-brass/40" />
              <span className="font-mono text-[10px] tracking-[0.4em] text-brass uppercase">
                Pitch &#183; Prove &#183; Prevail
              </span>
              <span className="h-px w-12 sm:w-24 bg-brass/40" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-px bg-warm-border" />
        </section>

        <section className="relative bg-obsidian py-28 sm:py-40 overflow-hidden">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: "url('/images/cta-bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/60 to-obsidian" />
          <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 text-center">
            <div className="font-mono text-[11px] tracking-[0.35em] text-brass uppercase mb-8">
              November 14, 2026 &#183; Tentative
            </div>
            <h2 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl lg:text-8xl">
              Have an idea<br />
              <span className="italic text-brass">worth defending?</span>
            </h2>
            <p className="mt-8 max-w-xl mx-auto text-lg text-[#3a3a3a] leading-relaxed">
              {user
                ? "You're registered. Head to your profile to manage your team and submit your pitch deck."
                : 'Registration is open for Northern California high school students and teams of 1\u20133. Register your team to compete.'}
            </p>
            {user ? (
              <Link
                to="/profile"
                className="group inline-flex items-center gap-3 px-9 py-5 bg-foreground text-primary-foreground font-mono text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#2a2a2a] transition-all"
              >
                View your profile
                <span className="transition-transform group-hover:translate-x-1">&#8594;</span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="group inline-flex items-center gap-3 px-9 py-5 bg-foreground text-primary-foreground font-mono text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#2a2a2a] transition-all"
              >
                Register your team
                <span className="transition-transform group-hover:translate-x-1">&#8594;</span>
              </Link>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

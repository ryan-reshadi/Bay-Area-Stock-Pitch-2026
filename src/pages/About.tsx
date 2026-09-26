import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const orgNotes = [
  {
    number: '01',
    title: 'Financial literacy first',
    text: 'The Financial Initiative exists to make markets, investing, and personal finance understandable for students who want to learn by doing — not by watching from the sidelines.',
  },
  {
    number: '02',
    title: 'Practice with purpose',
    text: 'Workshops, research, and live pitches give students a place to build a thesis, take a stance, and get sharper under real questions.',
  },
  {
    number: '03',
    title: 'Why we host BASP',
    text: 'Bay Area Stock Pitch is one of those programs: an open competition for Northern California high school students who want to make a case and stand behind it.',
  },
]

export default function About() {
  return (
    <>
      <Header />
      <main className="pt-14">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-8 pb-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[#5a5a55] hover:text-brass transition-colors mb-6"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>

          <div className="font-mono text-[11px] tracking-[0.35em] text-brass uppercase mb-4">About the organizer</div>
          <h1 className="font-display text-foreground tracking-tighter-display leading-[0.9] text-balance text-6xl sm:text-7xl lg:text-8xl">
            <span className="italic">Who</span> <span className="italic text-brass">we are.</span>
          </h1>
          <div className="mt-6 mb-5 h-0.5 w-14 bg-brass" />
          <p className="max-w-2xl text-lg leading-relaxed text-[#3a3a3a]">
            The Financial Initiative is the nonprofit behind Bay Area Stock Pitch. We exist to expand financial literacy and give students a serious place to practice equity research, valuation, and live presentation.
          </p>
        </div>

        <section className="relative bg-obsidian py-8">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-10 mb-8">
              <div>
                <div className="font-mono text-[11px] tracking-[0.3em] text-meta uppercase mb-5">
                  01 / Organizer
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tighter-display leading-[0.95] mb-4">
                  The Financial Initiative
                </h2>
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-brass uppercase mb-5">
                  <MapPin size={13} />
                  Bay Area, CA
                </div>
                <a
                  href="https://the-financial-initiative.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase text-foreground hover:text-brass transition-colors"
                >
                  Visit our website
                  <ArrowUpRight size={14} />
                </a>
              </div>
              <div className="lg:border-l lg:border-warm-border lg:pl-10 lg:pt-0">
                <p className="text-lg leading-relaxed text-[#3a3a3a]">
                  We believe more students should have access to the tools investors actually use: how to read a business, how to think about risk, and how to defend a recommendation. BASP is how we put that mission in public — an open competition that invites Northern California high school students to pick a company, do the work, and present a clear Buy, Sell, or Hold.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-warm border border-warm">
              {orgNotes.map((note) => (
                <article key={note.number} className="group relative bg-card p-8 sm:p-10 transition-colors hover:bg-card-hover">
                  <div className="font-display text-5xl sm:text-6xl text-brass font-light tracking-tight mb-6 transition-transform group-hover:-translate-y-1">
                    {note.number}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl text-foreground tracking-tight mb-4">{note.title}</h3>
                  <p className="text-sm leading-relaxed text-[#5a5a55]">{note.text}</p>
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-brass transition-all duration-500 group-hover:w-full" />
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

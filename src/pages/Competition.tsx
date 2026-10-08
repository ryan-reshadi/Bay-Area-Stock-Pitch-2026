import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, MapPin, ArrowUpRight } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const event = {
  date: 'November 14, 2026',
  time: '9:00 AM–1:00 PM',
  venue: 'Menlo High School',
  address: '555 Middlefield Road, Atherton, CA 94027',
}

const formatSteps = [
  {
    number: '01',
    tag: 'Online',
    title: 'Build the case.',
    body: 'Choose a company, understand its business, and shape the research into a clear recommendation. Every team begins here.',
    note: 'Submission details coming soon',
    detail: {
      h: 'Online submission round',
      b: 'Submit your pitch online for review. The judges, submission deadline, finalist announcement date, and number of pitches advancing are coming soon.',
      s: 'Coming soon',
    },
  },
  {
    number: '02',
    tag: 'In Person',
    title: 'Defend the idea.',
    body: 'The top submissions move forward to present in person at Menlo High School. Finalist timing and presentation logistics are set for the live day from 9:00 AM to 1:00 PM.',
    note: 'Live final details',
    detail: {
      h: 'In-person final',
      b: 'Advancing teams will present at Menlo High School on November 14, 2026, from 9:00 AM to 1:00 PM. Finalist timing and presentation logistics will be shared with teams ahead of the event.',
      s: 'Live final',
    },
  },
]

const judgingCards = [
  {
    number: '01',
    title: 'Judging panel',
    body: 'Judge identities, evaluation criteria, and the process for selecting finalists are coming soon.',
    status: 'Coming soon',
    tips: [
      'Depth of research over breadth of coverage',
      'A clear, falsifiable thesis beats a vague one',
      'Know your downside case as well as your upside',
    ],
  },
  {
    number: '02',
    title: 'Cash prizes',
    body: 'The winning pitch or pitches will receive cash prizes. The number of winners and prize amounts are coming soon.',
    status: 'Coming soon',
    tips: [
      'Recognition for the way you think, not just the call',
      'Prizes awarded for conviction and rigor',
      'Details finalized ahead of the final',
    ],
  },
]

const scheduleCards = [
  {
    number: '01',
    title: 'Schedule',
    body: 'The event runs from 9:00 AM to 1:00 PM on campus at Menlo High School. Arrival, room assignments, and the final run-of-show will be shared ahead of the day.',
    status: 'On schedule',
  },
  {
    number: '02',
    title: 'On campus',
    body: 'Menlo High School is the confirmed venue. Check-in, parking, presentation logistics, and what to bring will be communicated directly to participating teams.',
    status: 'Confirmed',
  },
]

export default function Competition() {
  const [openTip, setOpenTip] = useState<string | null>(null)

  return (
    <>
      <Header />
      <main className="pt-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[#5a5a55] hover:text-brass transition-colors mb-10"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>

          <div className="font-mono text-[11px] tracking-[0.35em] text-brass uppercase mb-6">The Competition</div>
          <h1 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl lg:text-8xl">
            What to <span className="italic text-brass">expect.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#3a3a3a]">
            Everything you need to know about the format, the judging, and the day of the final — from the opening bell to the final pitch.
          </p>
        </div>

        <section className="relative bg-secondary py-24 sm:py-32 border-y border-warm">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="section-index mb-6">02 <span>Competition Format</span></div>
            <h2 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl lg:text-8xl">
              Two stages.<br />
              <span className="italic text-brass">One thesis.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#3a3a3a]">
              The competition begins in person at Menlo High School from 9:00 AM to 1:00 PM. Teams present directly to judges and make their case in the room, with live questions and live evaluation shaping the final outcome.
            </p>

            <div className="relative mt-16">
              <div className="absolute left-0 right-0 top-[3.5rem] h-px bg-warm hidden md:block">
                <div className="h-full w-1/2 bg-gradient-to-r from-cyan-pulse to-brass opacity-70" />
              </div>
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {formatSteps.map((step) => (
                  <div key={step.number} className="relative">
                    <div className="hidden md:flex absolute left-0 top-[3.25rem] -translate-y-1/2 w-4 h-4 items-center justify-center">
                      <span className="w-3 h-3 rounded-full bg-brass ring-4 ring-secondary" />
                    </div>
                    <div className="md:pl-10">
                      <div className="font-mono text-[10px] tracking-[0.3em] text-meta uppercase mb-4">
                        {step.number} / {step.tag}
                      </div>
                      <div className="border border-warm-border bg-card p-8 h-full transition-colors hover:border-brass/40">
                        <h3 className="font-display text-3xl sm:text-4xl text-foreground tracking-tight mb-5">{step.title}</h3>
                        <p className="text-sm leading-relaxed text-[#5a5a55] mb-6">{step.body}</p>
                        <div className="font-mono text-[11px] tracking-[0.2em] text-brass uppercase">{step.note}</div>
                      </div>
                      <div className="mt-4 pl-8 border-l border-warm">
                        <div className="font-mono text-[10px] tracking-[0.25em] text-meta uppercase mb-1">
                          {step.number} · {step.detail.h}
                        </div>
                        <p className="text-xs leading-relaxed text-[#6b6b63] mb-2">{step.detail.b}</p>
                        <span className="font-mono text-[10px] tracking-[0.2em] text-meta uppercase">{step.detail.s}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-obsidian py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="section-index mb-6">03 <span>Judging & Prizes</span></div>
            <h2 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl lg:text-8xl">
              Make the case.<br />
              <span className="italic text-brass">Earn the room.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#3a3a3a]">
              Judges will evaluate submitted and/or presented pitches. Judge identities and scoring criteria are still being finalized.
            </p>

            <div className="mt-12 grid md:grid-cols-2 gap-6">
              {judgingCards.map((card) => {
                const isOpen = openTip === card.number
                return (
                  <div key={card.number} className="group border border-warm-border bg-card p-8 sm:p-10 transition-colors hover:border-brass/40">
                    <div className="flex items-start justify-between mb-6">
                      <div className="font-display text-6xl text-brass font-light tracking-tight">{card.number}</div>
                      <span className="font-mono text-[10px] tracking-[0.2em] text-meta uppercase mt-3">{card.status}</span>
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl text-foreground tracking-tight mb-4">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-[#5a5a55] mb-6">{card.body}</p>
                    <button
                      onClick={() => setOpenTip(isOpen ? null : card.number)}
                      className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-foreground hover:text-brass transition-colors"
                    >
                      Pro tips
                      <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <ul className="space-y-2 pt-4 border-t border-warm">
                          {card.tips.map((tip) => (
                            <li key={tip} className="flex items-start gap-2 text-xs text-[#5a5a55]">
                              <span className="text-brass mt-1.5">›</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="relative bg-secondary py-24 sm:py-32 border-y border-warm">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="section-index mb-6">03 <span>Schedule & Logistics</span></div>
            <h2 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl lg:text-8xl">
              The day,<br />
              <span className="italic text-brass">when it's ready.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#3a3a3a]">
              The competition is planned for Menlo High School, {event.address}, on {event.date} from {event.time}. The full event schedule and attendee logistics are coming soon.
            </p>

            <div className="mt-12 grid md:grid-cols-2 gap-6">
              {scheduleCards.map((card) => (
                <div key={card.number} className="group border border-warm-border bg-card p-8 sm:p-10 transition-colors hover:border-brass/40">
                  <div className="font-mono text-[10px] tracking-[0.3em] text-meta uppercase mb-6">{card.number}</div>
                  <h3 className="font-display text-3xl sm:text-4xl text-foreground tracking-tight mb-4">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-[#5a5a55] mb-6">{card.body}</p>
                  <span className="font-mono text-[11px] tracking-[0.2em] text-brass uppercase">{card.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative bg-obsidian py-24 sm:py-32 overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="section-index mb-6">04 <span>Find the Floor</span></div>
            <div className="grid lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 flex flex-col justify-between border border-warm-border bg-card p-8 sm:p-10">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin size={16} className="text-brass" />
                    <span className="font-mono text-[10px] tracking-[0.3em] text-meta uppercase">Host Campus</span>
                  </div>
                  <div className="font-display text-4xl sm:text-5xl text-foreground tracking-tight leading-none">Menlo</div>
                  <div className="font-display text-3xl sm:text-4xl text-brass italic tracking-tight">High School</div>
                </div>
                <div className="mt-10">
                  <div className="font-mono text-sm text-[#3a3a3a] leading-relaxed">
                    {event.address}
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Menlo+High+School%2C+555+Middlefield+Road%2C+Atherton%2C+CA+94027"
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-foreground border-b border-transparent hover:border-brass hover:text-brass transition-all pb-1"
                  >
                    Campus directions
                    <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href="https://www.menloatherton.k12.ca.us/"
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-4 inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-foreground border-b border-transparent hover:border-brass hover:text-brass transition-all pb-1"
                  >
                    Menlo website
                    <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <p className="mt-6 text-xs text-[#6b6b63] leading-relaxed">Event logistics will be shared with registered teams.</p>
                </div>
              </div>
              <div className="lg:col-span-7 min-h-[320px] border border-warm-border overflow-hidden bg-card">
                <iframe
                  title="Menlo High School campus map"
                  className="w-full h-full grayscale contrast-125 opacity-90"
                  style={{ minHeight: '320px', border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-122.236%2C37.451%2C-122.216%2C37.471&layer=mapnik&marker=37.461%2C-122.226"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

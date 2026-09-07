import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const photoIds: Record<string, string> = {
  'Arjun Mehta': '1507003211169-0a1dd7228f2d',
  'Sofia Chen': '1438761681033-6461ffad8d80',
  'Daniel Park': '1500648760412-abb858f67e1c',
  'Maya Iyer': '1573497019940-1c28fdaf62f6',
  'Kevin Zhang': '1472099645785-5658abf4ff4e',
  'Ananya Rao': '1544005313-94ddf0286df2',
  'Ethan Wong': '1500648760412-abb858f67e1c',
  'Priya Sharma': '1494790108377-be9c29b29330',
}

const chapters = [
  {
    name: 'Bellarmine College Preparatory',
    location: 'San Jose, CA',
    blurb: 'Host campus and founding chapter of the Bay Area Stock Pitch.',
    officers: [
      { name: 'Arjun Mehta', role: 'President', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces', bio: 'Equity research enthusiast focused on semiconductors and enterprise software.' },
      { name: 'Sofia Chen', role: 'Vice President', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces', bio: 'Long-bias value investor; runs the chapter\'s weekly stock-pitch workshop.' },
      { name: 'Daniel Park', role: 'Director of Operations', photo: 'https://images.unsplash.com/photo-1500648760412-abb858f67e1c?w=400&h=400&fit=crop&crop=faces', bio: 'Logistics lead for the in-person final and campus outreach.' },
    ],
  },
  {
    name: 'Lynbrook High School',
    location: 'San Jose, CA',
    blurb: 'Quant-leaning chapter with a focus on data-driven valuation work.',
    officers: [
      { name: 'Maya Iyer', role: 'President', photo: 'https://images.unsplash.com/photo-1573497019940-1c28fdaf62f6?w=400&h=400&fit=crop&crop=faces', bio: 'Builds DCF models for fun; finalist at the 2025 YIS Global competition.' },
      { name: 'Kevin Zhang', role: 'Vice President', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces', bio: 'Covers consumer and retail; comp analysis specialist.' },
      { name: 'Ananya Rao', role: 'Head of Education', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces', bio: 'Leads the new-member training program and valuation clinics.' },
    ],
  },
  {
    name: 'Mission San Jose High School',
    location: 'Fremont, CA',
    blurb: 'Macro-aware chapter bridging top-down and bottom-up analysis.',
    officers: [
      { name: 'Ethan Wong', role: 'President', photo: 'https://images.unsplash.com/photo-1500648760412-abb858f67e1c?w=400&h=400&fit=crop&crop=faces', bio: 'Interest in macro and financials; writes the chapter\'s weekly market brief.' },
      { name: 'Priya Sharma', role: 'Vice President', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces', bio: 'Healthcare sector lead; experienced with short-thesis frameworks.' },
    ],
  },
]

export default function About() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[#5a5a55] hover:text-brass transition-colors mb-10"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>

          <div className="font-mono text-[11px] tracking-[0.35em] text-brass uppercase mb-6">About</div>
          <h1 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl lg:text-8xl">
            The people behind <span className="italic text-brass">the pitch.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#3a3a3a]">
            BASP is organized by student chapters across the Bay Area. Each school runs its own team of officers who recruit, train, and mentor competitors throughout the year.
          </p>
        </div>

        <section className="relative bg-obsidian py-12 sm:py-16">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="space-y-20 sm:space-y-28">
              {chapters.map((chapter, i) => (
                <div key={chapter.name} className="border-t border-warm pt-16 sm:pt-20 first:border-t-0 first:pt-0">
                  <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 mb-12">
                    <div>
                      <div className="font-mono text-[11px] tracking-[0.3em] text-meta uppercase mb-5">
                        {String(i + 1).padStart(2, '0')} / Chapter
                      </div>
                      <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tighter-display leading-[0.95] mb-4">{chapter.name}</h3>
                      <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-brass uppercase mb-5">
                        <MapPin size={13} />
                        {chapter.location}
                      </div>
                    </div>
                    <div className="lg:pt-16">
                      <p className="text-lg leading-relaxed text-[#3a3a3a]">{chapter.blurb}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chapter.officers.map((officer) => (
                      <div
                        key={officer.name}
                        className="group border border-warm-border bg-card p-6 transition-colors hover:border-brass/40"
                      >
                        <div className="relative w-full aspect-square overflow-hidden border border-warm mb-5">
                          <img
                            src={`https://images.unsplash.com/photo-${photoIds[officer.name]}?w=400&h=400&fit=crop&crop=faces`}
                            alt={officer.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                        <div className="font-mono text-[10px] tracking-[0.25em] text-brass uppercase mb-2">{officer.role}</div>
                        <h4 className="font-display text-2xl text-foreground tracking-tight mb-3">{officer.name}</h4>
                        <p className="text-xs leading-relaxed text-[#5a5a55]">{officer.bio}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

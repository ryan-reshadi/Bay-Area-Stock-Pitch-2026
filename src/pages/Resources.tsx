import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Play } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const requirements = [
  { num: '01', title: 'Public US Equity', body: 'Any company listed on NYSE or NASDAQ. ETFs, ADRs, private companies, and crypto are not eligible.' },
  // { num: '02', title: 'Long or Short Thesis', body: 'Both directions accepted. Short pitches must address borrow availability and short interest.' },
  { num: '02', title: 'Publicly Available Information Only', body: 'All data and analysis must be sourced from publicly accessible information. No proprietary or inside information.' },
  { num: '03', title: 'Original Student Work', body: 'The analysis and writing must be completed independently by the registered team members.' },
  { num: '04', title: 'Independent Research Analyst Perspective', body: 'Present the pitch from the perspective of an objective, third-party analyst. Take a clear Buy, Sell, or Hold stance.' },
  // { num: '05', title: 'PowerPoint or PDF Submission', body: 'Email your deck as a .pptx or PDF to submission@basp.org by the submission deadline. Submissions are accepted by email only.' },
]

const coverSlideFields = [
  'First Name, Last Name (Partner Name if applicable)',
  'School',
  'Email Address',
  'Company Name',
  'Exchange or Ticker Symbol',
  'Sector or Industry',
  'Recommendation (Buy / Sell / Hold)',
  'Current Price (as of pitch date)',
  'Target Price (% upside or downside)',
]

const requiredSections = [
  { num: '01', title: 'Business Description', body: 'What the company does, how it generates revenue, key business segments, and competitive position.' },
  { num: '02', title: 'Industry Overview & Competitive Positioning', body: 'Market size and dynamics, sector growth trends, and the company\'s standing relative to its peers.' },
  { num: '03', title: 'Investment Summary', body: 'Your core thesis — why the stock is mispriced and what specific outcome you expect.' },
  { num: '04', title: 'Valuation / Financial Analysis', body: 'DCF, comparable company analysis, or sum-of-parts. Support your numbers with charts, graphs, and clearly stated assumptions.' },
  { num: '05', title: 'Investment Risks', body: 'Bear-case scenarios, headwinds, and the factors that would invalidate your thesis.' },
  { num: '06', title: 'ESG Considerations', body: 'Environmental, social, and governance factors relevant to the company and how they affect the investment case.' },
]

const scoringBreakdown = [
  { points: '50', label: 'POINTS', title: 'Investment Idea', items: [
    { p: '15 pts', t: 'Thesis is logical and grounded in sound investment principles' },
    { p: '15 pts', t: 'Report demonstrates meaningful insight into the company and sector' },
    { p: '10 pts', t: 'Financial analysis is rigorous and well-supported' },
    { p: '10 pts', t: 'ESG considerations are identified and addressed' },
  ]},
  { points: '25', label: 'POINTS', title: 'Slide Presentation', items: [
    { p: '10 pts', t: 'Presenters use concise bullet points and expand on each in delivery' },
    { p: '5 pts', t: 'Deck reflects genuine insight into the company and its industry' },
    { p: '5 pts', t: 'Presentation includes clear and accurate financial analysis' },
    { p: '5 pts', t: 'Pacing and flow of the presentation is effective' },
  ]},
  { points: '25', label: 'POINTS', title: 'Live Pitch', items: [
    { p: '10 pts', t: 'Team presents clearly and stays within the 10-minute time limit' },
    { p: '5 pts', t: 'Presenters demonstrate strong working knowledge of the company' },
    { p: '5 pts', t: 'Delivery is professional and polished' },
    { p: '5 pts', t: 'Presenters demonstrate strong presentation performance and command of the material' },
  ]},
]

const samplePitches = [
  { tag: 'Sample Pitch', title: 'XPEL, Inc. (XPEL)', body: 'A full example pitch deck. Use it as a model for structure, depth, and how to lay out your thesis, valuation, and risks.', href: 'https://www.laspc.org/examples/xpel-example.pdf' },
  { tag: 'Sample Pitch', title: 'ServiceNow (NOW)', body: 'Another complete worked example — a strong reference for building the business overview, valuation, and supporting analysis.', href: 'https://www.laspc.org/examples/servicenow-example.pdf' },
]

const exampleVideos = [
  { num: '01', title: 'YIS Global Stock Pitch Competition 2026 — 2nd Place', body: 'A full second-place pitch from the 2026 YIS Global Stock Pitch Competition. A strong model for how to structure and deliver a thesis.', href: 'https://www.youtube.com/watch?v=0HCj_gHwC6w' },
  { num: '02', title: 'YIS Global Stock Pitch Competition 2026 — 3rd Place', body: 'The third-place pitch from the same competition. Watch how the recommendation is framed and presented live.', href: 'https://www.youtube.com/watch?v=4H4xqhIgP2I' },
]

const learningVideos = [
  { num: '01', badge: 'Watch first', title: 'Start here: how to pitch a stock', body: 'New to equity research? Begin with this series for the fundamentals of building and delivering a stock pitch.', meta: 'Playlist · YouTube', href: 'https://www.youtube.com/playlist?list=PLFbu-5h4XOqN8zvKHyC6qi_NUSLFrJtPB' },
  { num: '02', badge: 'Recommended', title: 'Building a DCF', body: 'Some form of valuation is required in your pitch. This walkthrough builds a discounted cash flow model step by step — not mandatory, but strongly recommended.', meta: 'Playlist · YouTube', href: 'https://www.youtube.com/playlist?list=PL71QplJWp1Rpzqr4q1nq5b4Im93JkGcwm' },
  { num: '03', title: 'Comparable company analysis (comps)', body: 'A companion valuation approach using the trading multiples of comparable public companies.', meta: 'Video · YouTube', href: 'https://www.youtube.com/watch?v=dpKvb7D9ek4' },
]

export default function Resources() {
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

          <div className="font-mono text-[11px] tracking-[0.35em] text-brass uppercase mb-6">Resources</div>
          <h1 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl lg:text-8xl">
            Everything you need to <span className="italic text-brass">build your pitch.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#3a3a3a]">
            Requirements, structure, scoring, and worked examples — the full playbook for constructing a submission that holds up under scrutiny.
          </p>
        </div>

        <section className="relative bg-obsidian py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="section-index mb-6">01 <span>Requirements</span></div>
            <h2 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl lg:text-8xl">
              What your pitch<br />
              <span className="italic text-brass">must include.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#3a3a3a]">
              Hard rules. Decks that violate any of these are returned for revision before the submission deadline; uncorrected violations disqualify the team.
            </p>

            <div className="mt-12 grid md:grid-cols-2 gap-px bg-warm border border-warm">
              {requirements.map((req, i) => (
                <div key={req.num} className="bg-card p-8 sm:p-10 transition-colors hover:bg-card-hover">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-brass">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="font-display text-2xl sm:text-3xl text-foreground tracking-tight">{req.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#5a5a55] md:pl-10">{req.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 border border-warm-border bg-card p-8 sm:p-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="font-mono text-[11px] tracking-[0.3em] text-brass uppercase mb-4">Submission Format</div>
                <h3 className="font-display text-3xl sm:text-4xl text-foreground tracking-tight mb-4">Upload your deck on this website.</h3>
                <p className="text-sm leading-relaxed text-[#5a5a55]">
                  Submit your completed pitch deck as a PowerPoint file (.pptx) or PDF (.pdf). Registered teams can upload their file from the Profile page before the submission deadline.
                </p>
              </div>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 self-start lg:self-auto border border-brass px-5 py-3 font-mono text-[10px] tracking-[0.2em] text-brass uppercase hover:bg-brass hover:text-foreground transition-colors"
              >
                Go to profile
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="relative bg-secondary py-24 sm:py-32 border-y border-warm">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="section-index mb-6">02 <span>Structure</span></div>
            <h2 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl lg:text-8xl">
              What your presentation<br />
              <span className="italic text-brass">must cover.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#3a3a3a]">
              Required format. Submit as PowerPoint (.pptx) or PDF. Use bullet points throughout and include charts and graphs for financial analysis.
            </p>

            <div className="mt-12 grid lg:grid-cols-2 gap-10 lg:gap-16">
              <div>
                <div className="font-mono text-[11px] tracking-[0.3em] text-meta uppercase mb-6">Cover Slide · Required Information</div>
                <div className="border border-warm-border bg-card divide-y divide-warm">
                  {coverSlideFields.map((field, i) => (
                    <div key={field} className="flex items-center gap-4 px-6 py-4">
                      <span className="font-mono text-xs text-brass tabular-nums w-6">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-sm text-foreground">{field}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[11px] tracking-[0.3em] text-meta uppercase mb-6">Required Sections</div>
                <div className="space-y-px">
                  {requiredSections.map((section) => (
                    <div key={section.num} className="border border-warm-border bg-card p-6 transition-colors hover:border-brass/40">
                      <div className="flex items-baseline gap-4 mb-2">
                        <span className="font-mono text-[11px] tracking-[0.2em] text-brass">{section.num}</span>
                        <h3 className="font-display text-xl sm:text-2xl text-foreground tracking-tight">{section.title}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-[#5a5a55] md:pl-10">{section.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-obsidian py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="section-index mb-6">03 <span>Scoring</span></div>
            <h2 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl lg:text-8xl">
              How we judge.<br />
              <span className="italic text-brass">What wins.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#3a3a3a]">
              Three categories totaling 100 points. Judges evaluate investment idea, slide presentation quality, and live pitch delivery independently.
            </p>

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {scoringBreakdown.map((item) => (
                <div key={item.title} className="group border border-warm-border bg-card p-8 sm:p-10 transition-colors hover:border-brass/40">
                  <div className="flex items-end gap-2 mb-6 pb-6 border-b border-warm">
                    <div className="font-display text-6xl sm:text-7xl text-brass font-light tracking-tight leading-none">{item.points}</div>
                    <div className="font-mono text-[10px] tracking-[0.25em] text-meta uppercase mb-2">{item.label}</div>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl text-foreground tracking-tight mb-6">{item.title}</h3>
                  <ul className="space-y-4">
                    {item.items.map((sub) => (
                      <li key={sub.t} className="flex items-start gap-3">
                        <span className="font-mono text-[11px] tracking-[0.1em] text-brass mt-0.5 whitespace-nowrap">{sub.p}</span>
                        <span className="text-sm leading-relaxed text-[#5a5a55]">{sub.t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative bg-secondary py-24 sm:py-32 border-y border-warm">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="section-index mb-6">04 <span>Examples</span></div>
            <h2 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl lg:text-8xl">
              Sample<br />
              <span className="italic text-brass">pitch decks.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#3a3a3a]">
              Three complete example decks to study before you build your own. Note how each structures the thesis, supports the valuation, and addresses risk. Each opens as a PDF in a new tab.
            </p>

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {samplePitches.map((sample) => (
                <a
                  key={sample.title}
                  href={sample.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col border border-warm-border bg-card p-8 transition-colors hover:border-brass/40"
                >
                  <div className="flex items-center justify-between mb-8">
                    <Play size={28} className="text-brass" strokeWidth={1.25} />
                    <ArrowUpRight size={18} className="text-meta group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.25em] text-meta uppercase mb-3">{sample.tag}</div>
                  <h3 className="font-display text-2xl sm:text-3xl text-foreground tracking-tight mb-4">{sample.title}</h3>
                  <p className="text-sm leading-relaxed text-[#5a5a55] mb-6 flex-1">{sample.body}</p>
                  <div className="font-mono text-[11px] tracking-[0.2em] text-brass uppercase">View PDF →</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="relative bg-obsidian py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="section-index mb-6">05 <span>Watch</span></div>
            <h2 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl lg:text-8xl">
              Example<br />
              <span className="italic text-brass">pitches.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#3a3a3a]">
              Two award-winning pitches from the 2026 YIS Global Stock Pitch Competition. See what a strong live pitch looks like — thesis and delivery. Each opens on YouTube.
            </p>

            <div className="mt-12 grid md:grid-cols-2 gap-6">
              {exampleVideos.map((video) => (
                <a
                  key={video.num}
                  href={video.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group border border-warm-border bg-card p-8 sm:p-10 transition-colors hover:border-brass/40"
                >
                  <div className="flex items-start justify-between mb-8">
                    <span className="font-display text-5xl text-brass font-light tracking-tight">{video.num}</span>
                    <div className="w-12 h-12 rounded-full border border-warm-border flex items-center justify-center group-hover:border-brass transition-colors">
                      <Play size={18} className="text-[#5a5a55] group-hover:text-brass transition-colors ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl text-foreground tracking-tight mb-4">{video.title}</h3>
                  <p className="text-sm leading-relaxed text-[#5a5a55] mb-6">{video.body}</p>
                  <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-brass uppercase">
                    Video · YouTube
                    <ArrowUpRight size={14} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="relative bg-secondary py-24 sm:py-32 border-y border-warm">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="section-index mb-6">06 <span>Learn</span></div>
            <h2 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl lg:text-8xl">
              Video<br />
              <span className="italic text-brass">resources.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#3a3a3a]">
              Some form of valuation is required in your pitch. These walkthroughs cover the essentials — start with the first, then pick the valuation method that fits your thesis.
            </p>

            <div className="mt-12 space-y-px">
              {learningVideos.map((video) => (
                <a
                  key={video.num}
                  href={video.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid md:grid-cols-[auto_1fr_auto] items-start gap-6 md:gap-10 border border-warm-border bg-card p-8 sm:p-10 transition-colors hover:border-brass/40"
                >
                  <span className="font-display text-5xl text-brass font-light tracking-tight leading-none">{video.num}</span>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-display text-2xl sm:text-3xl text-foreground tracking-tight">{video.title}</h3>
                      {video.badge && (
                        <span className="font-mono text-[9px] tracking-[0.2em] text-brass uppercase border border-brass/40 px-2 py-0.5">{video.badge}</span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-[#5a5a55] max-w-2xl">{video.body}</p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-brass uppercase md:self-center whitespace-nowrap">
                    {video.meta}
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-foreground text-background section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-end">
              <div>
                <span className="kicker text-cyan-pulse">Coming soon</span>
                <h2 className="mt-4 text-balance text-background">
                  Competition materials<br />
                  <span className="italic text-brass">when they're ready.</span>
                </h2>
              </div>
              <div>
                <p className="text-background/80 max-w-md">
                  Submission requirements, sample decks, the judging rubric, and recommended research resources will live here.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

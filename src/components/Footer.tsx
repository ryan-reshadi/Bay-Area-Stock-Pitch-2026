import { Link } from 'react-router-dom'

const interestFormUrl = 'https://forms.gle/z3zxs7t4pj45auDH9'

const event = {
  date: 'November 14, 2026',
  venue: 'Bellarmine College Preparatory',
  address: '960 West Hedding Street, San Jose, CA 95126-1215',
}

export default function Footer() {
  const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '/competition', label: 'Competition' },
    { href: interestFormUrl, label: 'Interested?' },
  ]

  return (
    <footer className="bg-[#e8e3d6] border-t border-warm">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div>
            <Link to="/" className="flex items-baseline gap-2">
              <span className="font-mono text-sm font-semibold tracking-[0.2em] text-foreground">BASP</span>
              <span className="font-mono text-[10px] tracking-[0.3em] text-meta">EST. 2026</span>
            </Link>
            <p className="mt-4 text-xs text-[#6b6b63] leading-relaxed max-w-xs">
              Bay Area Stock Pitch. A competition for Northern California high school students ready to think like investors.
            </p>
          </div>

          <div className="flex md:justify-center">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[10px] tracking-[0.3em] text-meta uppercase mb-1">Site</span>
              {footerLinks.map(({ href, label }) => (
                href.startsWith('http') ? (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs tracking-wider text-[#5a5a55] hover:text-brass transition-colors uppercase"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={href}
                    to={href}
                    className="font-mono text-xs tracking-wider text-[#5a5a55] hover:text-brass transition-colors uppercase"
                  >
                    {label}
                  </Link>
                )
              ))}
            </div>
          </div>

          <div className="md:text-right">
            <div className="font-mono text-[10px] tracking-[0.3em] text-meta uppercase mb-3">Final</div>
            <div className="font-display text-lg text-foreground tracking-tight">{event.date}</div>
            <div className="font-mono text-xs text-[#6b6b63] mt-1">{event.venue} · San Jose</div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-warm flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#9a9a90] uppercase">© 2026 Bay Area Stock Pitch</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#9a9a90] uppercase">Pitch · Prove · Prevail</span>
        </div>
      </div>
    </footer>
  )
}

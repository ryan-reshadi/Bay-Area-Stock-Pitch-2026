import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/competition', label: 'Competition' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/register', label: 'Register' },
]

export default function Header() {
  const location = useLocation()
  const page = location.pathname

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-obsidian/90 backdrop-blur-sm border-b border-warm">
      <div className="container-custom flex items-center justify-between h-20">
        <Link to="/" className="flex items-baseline gap-2" aria-label="BASP home">
          <span className="text-2xl font-bold tracking-tighter font-heading">BASP</span>
          <span className="text-xs font-mono text-meta tracking-wider">EST. 2026</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className={`text-sm font-semibold transition-colors duration-200 ${
                page === href ? 'text-foreground' : 'text-muted-custom hover:text-foreground'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <nav className="flex md:hidden items-center" aria-label="Primary navigation">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className={`text-xs font-semibold transition-colors duration-200 px-2 py-1 ${
                page === href ? 'text-foreground' : 'text-muted-custom hover:text-foreground'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

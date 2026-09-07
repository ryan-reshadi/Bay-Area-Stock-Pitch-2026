import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen flex items-center">
        <div className="container-custom section-padding">
          <div className="max-w-2xl">
            <span className="kicker">404</span>
            <h1 className="mt-4 text-balance">
              Page not found.<br />
              <em className="font-heading italic">Let's get you back.</em>
            </h1>
            <p className="mt-6 text-muted-custom max-w-md">
              The page you're looking for doesn't exist or has been moved. Head back to the home page to explore the competition.
            </p>
            <Link to="/" className="btn-primary mt-8 inline-flex">
              Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

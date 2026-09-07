import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Countdown from '../components/Countdown'

type StepKey = 'team' | 'university' | 'ticker' | 'email'

const steps: { key: StepKey; label: string; placeholder: string; hint: string }[] = [
  { key: 'team', label: 'Team name', placeholder: 'e.g. Alpha Capital', hint: 'Enter your team\'s name' },
  { key: 'university', label: 'School', placeholder: 'e.g. Bellarmine College Prep', hint: 'Your high school' },
  { key: 'ticker', label: 'Ticker symbol', placeholder: 'e.g. AAPL', hint: 'The company you\'ll pitch' },
  { key: 'email', label: 'Contact email', placeholder: 'you@example.com', hint: 'Where we\'ll send updates' },
]

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<StepKey, string>>({
    team: '',
    university: '',
    ticker: '',
    email: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const canProceed = formData[currentStepData.key].trim().length > 0

  const handleNext = () => {
    if (isLastStep) {
      setSubmitted(true)
    } else {
      setCurrentStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1))
  }

  const updateField = (key: StepKey, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen bg-obsidian">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-16 sm:pt-24 pb-24">
            <div className="border border-[#2f3d2a] bg-[#1a261a]">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a3a2a] bg-[#141d14]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2f3d2a]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2f3d2a]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-brass" />
                </div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#8a9a8a] uppercase">basp@register: ~</span>
              </div>
              <div className="p-6 sm:p-10 min-h-[420px] flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full border-2 border-cyan-pulse flex items-center justify-center mb-6" style={{ boxShadow: '0 0 20px rgba(204,255,0,0.4), 0 0 40px rgba(204,255,0,0.2)' }}>
                  <CheckCircle2 size={26} className="text-cyan-pulse" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-[#f4f1ea] tracking-tight mb-3">Position secured.</h2>
                <p className="max-w-sm text-sm text-[#8a9a8a] leading-relaxed">
                  You're on the interest list. We'll reach out at <span className="text-brass font-mono">{formData.email}</span> when registration opens.
                </p>
              </div>
            </div>
            <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-[#9a9a90] uppercase">
              No data is stored yet — this is an interest-list preview.
            </p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-obsidian">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-16 sm:pt-24 pb-24">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[#5a5a55] hover:text-brass transition-colors mb-10"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>

          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <div className="font-mono text-[11px] tracking-[0.35em] text-brass uppercase mb-6">Registration Portal</div>
              <h1 className="font-display text-foreground tracking-tighter-display leading-[0.92] text-balance text-5xl sm:text-7xl">
                Secure your <span className="italic text-brass">position.</span>
              </h1>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-[#3a3a3a]">
                Registration will open soon for California high school students and teams of 1–3. Join the interest list and we'll notify you when submissions go live.
              </p>

              <div className="mt-10 hidden lg:block">
                <div className="font-mono text-[10px] tracking-[0.3em] text-meta uppercase mb-3">Opening Bell</div>
                <Countdown />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="border border-[#2f3d2a] bg-[#1a261a]">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a3a2a] bg-[#141d14]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2f3d2a]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2f3d2a]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-brass" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#8a9a8a] uppercase">basp@register: ~</span>
                </div>

                <div className="p-6 sm:p-10 min-h-[420px] flex flex-col">
                  <div className="flex items-center gap-2 mb-10">
                    {steps.map((step, i) => (
                      <div key={step.key} className="flex items-center gap-2 flex-1">
                        <div
                          className={`h-1 flex-1 rounded-full transition-colors ${i <= currentStep ? 'bg-brass' : 'bg-[#2a3a2a]'}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="font-mono text-[10px] tracking-[0.3em] text-[#8a9a8a] uppercase mb-3">
                    Step {currentStep + 1} / {steps.length} — {currentStepData.label}
                  </div>
                  <div className="font-mono text-sm text-[#8a9a8a] mb-2">
                    <span className="text-brass">$</span> {currentStepData.hint}
                  </div>
                  <input
                    autoFocus
                    value={formData[currentStepData.key]}
                    onChange={(e) => updateField(currentStepData.key, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && canProceed && handleNext()}
                    placeholder={currentStepData.placeholder}
                    className="w-full bg-transparent border-b-2 border-[#2f3d2a] focus:border-brass outline-none font-mono text-2xl sm:text-3xl text-[#f4f1ea] py-3 transition-colors placeholder:text-[#3f4a3f]"
                  />

                  <div className="mt-auto flex items-center justify-between pt-10">
                    <button
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      className="font-mono text-xs tracking-[0.2em] uppercase text-[#8a9a8a] hover:text-[#f4f1ea] disabled:opacity-30 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!canProceed}
                      className={`group inline-flex items-center gap-2 px-7 py-3.5 font-mono text-xs font-bold tracking-[0.25em] uppercase transition-all ${
                        canProceed
                          ? 'bg-cyan-pulse text-[#1a261a] hover:bg-lime-hover cursor-pointer'
                          : 'bg-[#2a3a2a] text-[#5a6a5a] cursor-not-allowed'
                      }`}
                      style={canProceed ? { boxShadow: '0 0 20px rgba(204,255,0,0.4), 0 0 40px rgba(204,255,0,0.2)' } : {}}
                    >
                      {isLastStep ? 'Submit pitch' : 'Next'}
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-[#9a9a90] uppercase">
                No data is stored yet — this is an interest-list preview.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

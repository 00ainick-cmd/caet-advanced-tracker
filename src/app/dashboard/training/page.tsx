'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { PQS_SECTIONS } from '@/data/pqs-sections'
import ProgressRing from '@/components/ProgressRing'

// Quiz questions from PQS data (subset for each section)
const QUIZ_QUESTIONS: Record<number, { q: string; opts: string[]; a: number }[]> = {
  1: [
    { q: 'According to 14 CFR Part 43, who is authorized to perform maintenance on aircraft?', opts: ['Any pilot with a valid certificate', 'Certified mechanics, repairmen, and Part 145 repair stations', 'Only the aircraft manufacturer', 'Anyone supervised by a mechanic'], a: 1 },
    { q: 'When is an STC required instead of AC 43.13-1B authority?', opts: ['For any electrical work', 'For major alterations that change the type design', 'Only for engine modifications', 'Only for commercial aircraft'], a: 1 },
    { q: 'What are Airworthiness Directives (ADs)?', opts: ['Optional manufacturer recommendations', 'Mandatory FAA-issued corrective actions', 'Insurance requirements', 'Shop-specific quality standards'], a: 1 },
  ],
  2: [
    { q: 'What regulation governs logbook entry requirements for maintenance?', opts: ['14 CFR 91.403', '14 CFR 43.9 and 43.11', '14 CFR 145.201', '14 CFR 21.50'], a: 1 },
    { q: 'When is FAA Form 337 required?', opts: ['For any maintenance work', 'For major repairs and major alterations', 'Only for engine overhauls', 'Only for new aircraft'], a: 1 },
    { q: 'A return-to-service statement can be signed by:', opts: ['Any employee of the shop', 'Only FAA inspectors', 'Authorized persons (IA, A&P with IA, or repair station)', 'The aircraft owner'], a: 2 },
  ],
  // Sections 3-13 would include their full quiz questions from tracker-data.js
  // For now, minimal questions per section to keep this file manageable
}

// Add placeholder quizzes for remaining sections
for (let i = 3; i <= 13; i++) {
  if (!QUIZ_QUESTIONS[i]) {
    QUIZ_QUESTIONS[i] = [
      { q: `Section ${i} knowledge assessment — placeholder question 1`, opts: ['Option A', 'Option B', 'Option C', 'Option D'], a: 1 },
    ]
  }
}

const PASS_SCORE = 80

export default function TrainingPage() {
  const { user } = useAuth()
  const [quizResults, setQuizResults] = useState<Record<number, number>>({})
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadResults()
  }, [user])

  async function loadResults() {
    // In production, quiz results would be stored in Supabase
    // For now, use localStorage as a bridge
    try {
      const stored = localStorage.getItem(`caet_quiz_${user!.id}`)
      if (stored) setQuizResults(JSON.parse(stored))
    } catch {}
    setLoading(false)
  }

  function saveResults(results: Record<number, number>) {
    setQuizResults(results)
    localStorage.setItem(`caet_quiz_${user!.id}`, JSON.stringify(results))
  }

  function startQuiz(sectionNum: number) {
    setActiveQuiz(sectionNum)
    setQuizAnswers({})
    setQuizSubmitted(false)
  }

  function submitQuiz() {
    if (activeQuiz === null) return
    const questions = QUIZ_QUESTIONS[activeQuiz] || []
    let correct = 0
    questions.forEach((q, i) => {
      if (quizAnswers[i] === q.a) correct++
    })
    const score = Math.round((correct / questions.length) * 100)

    const updated = { ...quizResults, [activeQuiz]: score }
    saveResults(updated)
    setQuizSubmitted(true)
  }

  const completedCount = Object.values(quizResults).filter(s => s >= PASS_SCORE).length
  const overallPct = Math.round((completedCount / PQS_SECTIONS.length) * 100)

  if (loading) {
    return <div className="loading-page"><div className="loading-spinner" /></div>
  }

  // Quiz modal
  if (activeQuiz !== null) {
    const questions = QUIZ_QUESTIONS[activeQuiz] || []
    const section = PQS_SECTIONS.find(s => s.number === activeQuiz)
    const score = quizResults[activeQuiz]

    if (quizSubmitted) {
      const passed = (quizResults[activeQuiz] || 0) >= PASS_SCORE
      return (
        <div className="page-content">
          <div className="card card-gold" style={{ textAlign: 'center', padding: 40 }}>
            <h2>{passed ? '✅ Passed!' : '❌ Not Passed'}</h2>
            <p style={{ fontSize: 48, fontWeight: 700, color: passed ? 'var(--green)' : 'var(--red)', margin: '16px 0' }}>
              {quizResults[activeQuiz]}%
            </p>
            <p style={{ color: 'var(--text-dim)', marginBottom: 20 }}>
              {passed ? 'Great work! This section is complete.' : `You need ${PASS_SCORE}% to pass. Review the material and try again.`}
            </p>
            <button className="btn-primary" onClick={() => setActiveQuiz(null)}>
              ← Back to Training
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="page-content">
        <div className="card card-gold">
          <h2>Section {activeQuiz}: {section?.title}</h2>
          <p style={{ color: 'var(--text-dim)', marginBottom: 24 }}>{questions.length} questions • {PASS_SCORE}% to pass</p>

          {questions.map((q, qi) => (
            <div key={qi} style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontWeight: 600, marginBottom: 10 }}>{qi + 1}. {q.q}</p>
              {q.opts.map((opt, oi) => (
                <label key={oi} style={{
                  display: 'block', padding: '8px 14px', marginBottom: 4,
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  background: quizAnswers[qi] === oi ? 'var(--gold-bg)' : 'transparent',
                  border: `1px solid ${quizAnswers[qi] === oi ? 'var(--gold)' : 'var(--border)'}`,
                }}>
                  <input
                    type="radio"
                    name={`q${qi}`}
                    checked={quizAnswers[qi] === oi}
                    onChange={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                    style={{ marginRight: 10 }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-secondary" onClick={() => setActiveQuiz(null)}>Cancel</button>
            <button
              className="btn-primary"
              onClick={submitQuiz}
              disabled={Object.keys(quizAnswers).length < questions.length}
            >
              Submit Quiz →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="card card-gold dash-hero">
        <div className="hero-content">
          <h2>📚 Training</h2>
          <p>Complete your required training modules to unlock sign-off capabilities. Study the fundamentals, risk management, and shop practices.</p>
        </div>
        <div className="hero-stats">
          <ProgressRing percent={overallPct} size={120} done={completedCount} total={PQS_SECTIONS.length} />
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {PQS_SECTIONS.map(section => {
          const score = quizResults[section.number]
          const passed = score !== undefined && score >= PASS_SCORE
          return (
            <div key={section.number} className="card" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: 6, fontSize: 12, fontWeight: 700,
                    background: passed ? 'var(--green-bg)' : 'var(--gold-bg)',
                    color: passed ? 'var(--green)' : 'var(--gold)',
                  }}>{section.number}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{section.title}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
                  {section.fundamentals.length} fundamentals · {section.risks.length} risks
                </div>
              </div>
              <div className="task-actions">
                {passed ? (
                  <span className="badge badge-signed">✓ {score}% Passed</span>
                ) : score !== undefined ? (
                  <>
                    <span className="badge badge-needswork">{score}% — Retry</span>
                    <button className="btn-secondary btn-sm" onClick={() => startQuiz(section.number)}>Retake</button>
                  </>
                ) : (
                  <button className="btn-primary btn-sm" onClick={() => startQuiz(section.number)}>Study & Quiz</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

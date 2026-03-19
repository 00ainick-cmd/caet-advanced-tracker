'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'

// Oral board scoring page for committee members
interface OralCandidate {
  id: string
  candidate_id: string
  profile: { full_name: string; email: string; company: string | null }
  signed_off_count: number
  portfolio_count: number
  oral_board_id: string | null
}

const SCORE_LABELS = ['', '1 — Unsatisfactory', '2 — Below Standard', '3 — Meets Standard', '4 — Above Standard', '5 — Exceptional']

export default function CommitteeDashboard() {
  const { user } = useAuth()
  const [candidates, setCandidates] = useState<OralCandidate[]>([])
  const [activeScoring, setActiveScoring] = useState<string | null>(null)
  const [scores, setScores] = useState({ portfolio: 0, technical: 0, scenario: 0 })
  const [comments, setComments] = useState({ portfolio: '', technical: '', scenario: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadQueue()
  }, [user])

  async function loadQueue() {
    try {
      // Get candidates ready for oral board
      const { data: cands } = await supabase
        .from('candidates')
        .select('id, user_id, status, profiles!candidates_user_id_fkey(full_name, email, company)')
        .in('status', ['portfolio_submitted', 'oral_scheduled'])

      if (!cands) { setLoading(false); return }

      const items: OralCandidate[] = []
      for (const c of cands) {
        const { count: signedOff } = await supabase
          .from('task_signoffs')
          .select('*', { count: 'exact', head: true })
          .eq('candidate_id', c.id)
          .eq('status', 'signed_off')

        const { count: portfolio } = await supabase
          .from('portfolio_items')
          .select('*', { count: 'exact', head: true })
          .eq('candidate_id', c.id)
          .eq('submitted', true)

        const { data: existingBoard } = await supabase
          .from('oral_boards')
          .select('id')
          .eq('candidate_id', c.id)
          .is('completed_at', null)
          .maybeSingle()

        const profile = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles

        items.push({
          id: c.id,
          candidate_id: c.id,
          profile: profile || { full_name: 'Unknown', email: '', company: null },
          signed_off_count: signedOff || 0,
          portfolio_count: portfolio || 0,
          oral_board_id: existingBoard?.id || null,
        })
      }

      setCandidates(items)
    } catch (err) {
      console.error('Error loading oral board queue:', err)
    } finally {
      setLoading(false)
    }
  }

  async function submitScores(candidateId: string) {
    if (scores.portfolio === 0 || scores.technical === 0 || scores.scenario === 0) {
      alert('Please provide scores for all three phases.')
      return
    }

    try {
      // Determine which evaluator slot (1 or 2)
      const candidate = candidates.find(c => c.id === candidateId)
      const boardId = candidate?.oral_board_id

      if (boardId) {
        // Update existing board record (evaluator 2)
        await supabase.from('oral_boards').update({
          e2_portfolio_score: scores.portfolio,
          e2_portfolio_comments: comments.portfolio,
          e2_technical_score: scores.technical,
          e2_technical_comments: comments.technical,
          e2_scenario_score: scores.scenario,
          e2_scenario_comments: comments.scenario,
          evaluator_2_id: user!.id,
          completed_at: new Date().toISOString(),
        }).eq('id', boardId)
      } else {
        // Create new board record (evaluator 1)
        await supabase.from('oral_boards').insert({
          candidate_id: candidateId,
          e1_portfolio_score: scores.portfolio,
          e1_portfolio_comments: comments.portfolio,
          e1_technical_score: scores.technical,
          e1_technical_comments: comments.technical,
          e1_scenario_score: scores.scenario,
          e1_scenario_comments: comments.scenario,
          evaluator_1_id: user!.id,
          scheduled_at: new Date().toISOString(),
        })
      }

      setActiveScoring(null)
      setScores({ portfolio: 0, technical: 0, scenario: 0 })
      setComments({ portfolio: '', technical: '', scenario: '' })
      loadQueue()
    } catch (err: any) {
      alert('Error submitting scores: ' + err.message)
    }
  }

  if (loading) return <div className="loading-page"><div className="loading-spinner" /></div>

  // Scoring modal
  if (activeScoring) {
    const cand = candidates.find(c => c.id === activeScoring)
    return (
      <div className="page-content">
        <div className="card card-gold">
          <h2>Oral Board Scoring — {cand?.profile.full_name}</h2>
          <p style={{ color: 'var(--text-dim)', marginBottom: 24 }}>{cand?.profile.company} • Score each phase 1-5</p>

          {(['portfolio', 'technical', 'scenario'] as const).map(phase => (
            <div key={phase} style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 16, textTransform: 'capitalize', marginBottom: 10 }}>
                {phase === 'portfolio' ? '📁 Portfolio Review' : phase === 'technical' ? '🔧 Technical Knowledge' : '🎯 Scenario Assessment'}
              </h3>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    className={scores[phase] === n ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
                    onClick={() => setScores(prev => ({ ...prev, [phase]: n }))}
                  >
                    {n}
                  </button>
                ))}
                {scores[phase] > 0 && (
                  <span style={{ fontSize: 12, color: 'var(--text-dim)', alignSelf: 'center', marginLeft: 8 }}>
                    {SCORE_LABELS[scores[phase]]}
                  </span>
                )}
              </div>
              <textarea
                placeholder="Comments for this phase..."
                value={comments[phase]}
                onChange={e => setComments(prev => ({ ...prev, [phase]: e.target.value }))}
                style={{
                  width: '100%', padding: 10, background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13, minHeight: 60, resize: 'vertical',
                }}
              />
            </div>
          ))}

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-secondary" onClick={() => setActiveScoring(null)}>Cancel</button>
            <button className="btn-primary" onClick={() => submitScores(activeScoring)}>Submit Scores →</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>🎤 Oral Board Queue</h2>
        <p>{candidates.length} candidate{candidates.length !== 1 ? 's' : ''} ready for evaluation</p>
      </div>

      {candidates.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>
          <p>No candidates currently awaiting oral board evaluation.</p>
        </div>
      ) : (
        candidates.map(c => (
          <div key={c.id} className="card card-gold" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{c.profile.full_name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>
                  {c.profile.company} • {c.signed_off_count}/75 tasks • {c.portfolio_count}/7 portfolio
                </div>
              </div>
              <button className="btn-primary btn-sm" onClick={() => setActiveScoring(c.id)}>
                Score Oral Board →
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

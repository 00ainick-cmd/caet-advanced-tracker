'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { PQS_SECTIONS, TOTAL_TASKS } from '@/data/pqs-sections'
import ProgressRing from '@/components/ProgressRing'

interface CandidateDetail {
  id: string
  status: string
  profile: { full_name: string; email: string; company: string | null }
  signoffs: Record<string, string>
  portfolioCount: number
}

export default function CandidatePage({ params }: { params: { candidateId: string } }) {
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCandidate()
  }, [params.candidateId])

  async function loadCandidate() {
    try {
      const { data: cand } = await supabase
        .from('candidates')
        .select('id, status, profiles!candidates_user_id_fkey(full_name, email, company)')
        .eq('id', params.candidateId)
        .single()

      if (!cand) { setLoading(false); return }

      // Get sign-offs
      const { data: signoffs } = await supabase
        .from('task_signoffs')
        .select('task_id, status, pqs_tasks(task_id)')
        .eq('candidate_id', cand.id)

      const signoffMap: Record<string, string> = {}
      signoffs?.forEach(s => {
        const task = Array.isArray(s.pqs_tasks) ? s.pqs_tasks[0] : s.pqs_tasks
        if (task?.task_id) signoffMap[task.task_id] = s.status
      })

      // Get portfolio count
      const { count: portfolioCount } = await supabase
        .from('portfolio_items')
        .select('*', { count: 'exact', head: true })
        .eq('candidate_id', cand.id)
        .eq('submitted', true)

      const profile = Array.isArray(cand.profiles) ? cand.profiles[0] : cand.profiles

      setCandidate({
        id: cand.id,
        status: cand.status,
        profile: profile || { full_name: 'Unknown', email: '', company: null },
        signoffs: signoffMap,
        portfolioCount: portfolioCount || 0,
      })
    } catch (err) {
      console.error('Error loading candidate:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading-page"><div className="loading-spinner" /></div>
  if (!candidate) return <div className="page-content"><p>Candidate not found.</p></div>

  const signedOff = Object.values(candidate.signoffs).filter(s => s === 'signed_off').length
  const pct = Math.round((signedOff / TOTAL_TASKS) * 100)

  return (
    <div className="page-content">
      <div className="card card-gold dash-hero">
        <div className="hero-content">
          <h2>{candidate.profile.full_name}</h2>
          <p>{candidate.profile.company} • {candidate.profile.email}</p>
        </div>
        <div className="hero-stats">
          <ProgressRing percent={pct} size={120} done={signedOff} total={TOTAL_TASKS} />
        </div>
      </div>

      <div className="stats-row" style={{ margin: '20px 0' }}>
        <div className="stat-card"><div className="stat-value gold">{signedOff}</div><div className="stat-label">Signed Off</div></div>
        <div className="stat-card"><div className="stat-value">{TOTAL_TASKS - signedOff}</div><div className="stat-label">Remaining</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--green)' }}>{candidate.portfolioCount}/7</div><div className="stat-label">Portfolio</div></div>
      </div>

      <div style={{ marginTop: 24 }}>
        {PQS_SECTIONS.map(section => {
          const done = section.tasks.filter(t => candidate.signoffs[t.taskId] === 'signed_off').length
          const sPct = section.tasks.length > 0 ? Math.round((done / section.tasks.length) * 100) : 0
          return (
            <div key={section.number} className="card" style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Sec {section.number}: {section.title}</span>
              </div>
              <div className="section-progress">
                <span>{done}/{section.tasks.length}</span>
                <div className="section-bar"><div className="section-bar-fill" style={{ width: `${sPct}%` }} /></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

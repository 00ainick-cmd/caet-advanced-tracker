'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import ProgressRing from '@/components/ProgressRing'
import { supabase } from '@/lib/supabase'
import { TOTAL_TASKS } from '@/data/pqs-sections'
import Link from 'next/link'

interface CandidateRow {
  id: string
  user_id: string
  status: string
  profile: { full_name: string; email: string; company: string | null }
  signed_off: number
}

export default function EvaluatorDashboard() {
  const { user } = useAuth()
  const [candidates, setCandidates] = useState<CandidateRow[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadCandidates()
  }, [user])

  async function loadCandidates() {
    try {
      const { data: cands } = await supabase
        .from('candidates')
        .select('id, user_id, status, profiles!candidates_user_id_fkey(full_name, email, company)')
        .eq('evaluator_id', user!.id)

      if (!cands) { setLoading(false); return }

      // Get sign-off counts for each candidate
      const rows: CandidateRow[] = []
      let pending = 0

      for (const c of cands) {
        const { count: signedOff } = await supabase
          .from('task_signoffs')
          .select('*', { count: 'exact', head: true })
          .eq('candidate_id', c.id)
          .eq('status', 'signed_off')

        const { count: submitted } = await supabase
          .from('task_signoffs')
          .select('*', { count: 'exact', head: true })
          .eq('candidate_id', c.id)
          .eq('status', 'submitted')

        pending += submitted || 0

        const profile = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles
        rows.push({
          id: c.id,
          user_id: c.user_id,
          status: c.status,
          profile: profile || { full_name: 'Unknown', email: '', company: null },
          signed_off: signedOff || 0,
        })
      }

      setCandidates(rows)
      setPendingCount(pending)
    } catch (err) {
      console.error('Error loading candidates:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading-page"><div className="loading-spinner" /></div>
  }

  return (
    <div className="page-content">
      <div className="card card-gold dash-hero">
        <div className="hero-content">
          <h2>👥 My Apprentices</h2>
          <p>{candidates.length} candidates assigned • {pendingCount} sign-offs pending</p>
        </div>
      </div>

      <div className="stats-row" style={{ margin: '20px 0' }}>
        <div className="stat-card">
          <div className="stat-value gold">{candidates.length}</div>
          <div className="stat-label">Candidates</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--blue)' }}>{pendingCount}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-value green">{candidates.filter(c => c.status === 'certified').length}</div>
          <div className="stat-label">Certified</div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {candidates.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>
            <p>No apprentices assigned yet. Candidates will appear here once enrolled.</p>
          </div>
        ) : (
          candidates.map(c => {
            const pct = Math.round((c.signed_off / TOTAL_TASKS) * 100)
            return (
              <Link key={c.id} href={`/evaluator/${c.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="candidate-row">
                  <div>
                    <div className="candidate-name">{c.profile.full_name}</div>
                    <div className="candidate-meta">
                      {c.profile.company || 'No shop'} • {c.profile.email}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="section-progress">
                      <span>{c.signed_off}/{TOTAL_TASKS}</span>
                      <div className="section-bar" style={{ width: 100 }}>
                        <div className="section-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className={`badge ${c.status === 'certified' ? 'badge-signed' : c.status === 'pqs_in_progress' ? 'badge-requested' : 'badge-notstarted'}`}>
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}

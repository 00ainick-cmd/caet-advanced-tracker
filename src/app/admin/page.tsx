'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { TOTAL_TASKS } from '@/data/pqs-sections'

interface PipelineStats {
  enrolled: number
  pqs_in_progress: number
  portfolio_submitted: number
  oral_scheduled: number
  oral_complete: number
  certified: number
  not_qualified: number
  total: number
}

interface RecentCandidate {
  id: string
  full_name: string
  company: string | null
  status: string
  signed_off: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<PipelineStats>({
    enrolled: 0, pqs_in_progress: 0, portfolio_submitted: 0,
    oral_scheduled: 0, oral_complete: 0, certified: 0, not_qualified: 0, total: 0,
  })
  const [recent, setRecent] = useState<RecentCandidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadStats()
  }, [user])

  async function loadStats() {
    try {
      const { data: candidates } = await supabase
        .from('candidates')
        .select('id, status, profiles!candidates_user_id_fkey(full_name, company)')
        .order('created_at', { ascending: false })

      if (!candidates) { setLoading(false); return }

      const pipeline: PipelineStats = {
        enrolled: 0, pqs_in_progress: 0, portfolio_submitted: 0,
        oral_scheduled: 0, oral_complete: 0, certified: 0, not_qualified: 0,
        total: candidates.length,
      }

      const recentRows: RecentCandidate[] = []

      for (const c of candidates) {
        pipeline[c.status as keyof PipelineStats] = (pipeline[c.status as keyof PipelineStats] as number || 0) + 1

        if (recentRows.length < 10) {
          const { count: signedOff } = await supabase
            .from('task_signoffs')
            .select('*', { count: 'exact', head: true })
            .eq('candidate_id', c.id)
            .eq('status', 'signed_off')

          const profile = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles
          recentRows.push({
            id: c.id,
            full_name: profile?.full_name || 'Unknown',
            company: profile?.company || null,
            status: c.status,
            signed_off: signedOff || 0,
          })
        }
      }

      setStats(pipeline)
      setRecent(recentRows)
    } catch (err) {
      console.error('Error loading admin stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading-page"><div className="loading-spinner" /></div>

  const statusColor: Record<string, string> = {
    enrolled: 'var(--text-dim)',
    pqs_in_progress: 'var(--blue)',
    portfolio_submitted: 'var(--orange)',
    oral_scheduled: 'var(--gold)',
    oral_complete: 'var(--green)',
    certified: 'var(--green)',
    not_qualified: 'var(--red)',
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>📊 National Dashboard</h2>
        <p>CAET Advanced certification pipeline — all candidates nationally</p>
      </div>

      <div className="stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-value gold">{stats.total}</div><div className="stat-label">Total Candidates</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--blue)' }}>{stats.pqs_in_progress}</div><div className="stat-label">PQS In Progress</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--orange)' }}>{stats.portfolio_submitted}</div><div className="stat-label">Portfolio Submitted</div></div>
        <div className="stat-card"><div className="stat-value green">{stats.certified}</div><div className="stat-label">Certified</div></div>
      </div>

      {/* Pipeline Funnel */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><span className="card-title">Certification Pipeline</span></div>
        {[
          { key: 'enrolled', label: 'Enrolled', val: stats.enrolled },
          { key: 'pqs_in_progress', label: 'PQS In Progress', val: stats.pqs_in_progress },
          { key: 'portfolio_submitted', label: 'Portfolio Submitted', val: stats.portfolio_submitted },
          { key: 'oral_scheduled', label: 'Oral Board Scheduled', val: stats.oral_scheduled },
          { key: 'certified', label: 'Certified ✓', val: stats.certified },
        ].map(stage => (
          <div key={stage.key} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{stage.label}</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: statusColor[stage.key] || 'var(--text)' }}>{stage.val}</span>
          </div>
        ))}
      </div>

      {/* Recent Candidates */}
      <div className="card">
        <div className="card-header"><span className="card-title">Recent Candidates</span></div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Shop</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.full_name}</td>
                <td style={{ color: 'var(--text-dim)' }}>{c.company || '—'}</td>
                <td>
                  <div className="section-progress">
                    <span>{c.signed_off}/{TOTAL_TASKS}</span>
                    <div className="section-bar">
                      <div className="section-bar-fill" style={{ width: `${Math.round((c.signed_off / TOTAL_TASKS) * 100)}%` }} />
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${c.status === 'certified' ? 'badge-signed' : c.status === 'pqs_in_progress' ? 'badge-requested' : 'badge-notstarted'}`}>
                    {c.status.replace(/_/g, ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

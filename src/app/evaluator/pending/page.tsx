'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'

interface PendingSignoff {
  id: string
  candidate_id: string
  task_id: number
  status: string
  notes: string | null
  candidate_name: string
  task_desc: string
  task_code: string
  section_title: string
}

export default function PendingSignoffs() {
  const { user } = useAuth()
  const [pending, setPending] = useState<PendingSignoff[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) loadPending()
  }, [user])

  async function loadPending() {
    try {
      // Get candidates assigned to this evaluator
      const { data: cands } = await supabase
        .from('candidates')
        .select('id, profiles!candidates_user_id_fkey(full_name)')
        .eq('evaluator_id', user!.id)

      if (!cands || cands.length === 0) { setLoading(false); return }

      const candIds = cands.map(c => c.id)
      const candNames: Record<string, string> = {}
      cands.forEach(c => {
        const profile = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles
        candNames[c.id] = profile?.full_name || 'Unknown'
      })

      // Get submitted signoffs
      const { data: signoffs } = await supabase
        .from('task_signoffs')
        .select('id, candidate_id, task_id, status, notes')
        .in('candidate_id', candIds)
        .eq('status', 'submitted')

      if (!signoffs || signoffs.length === 0) { setLoading(false); return }

      // Get task info
      const taskIds = signoffs.map(s => s.task_id)
      const { data: tasks } = await supabase
        .from('pqs_tasks')
        .select('id, task_id, description, section_id, pqs_sections(title)')
        .in('id', taskIds)

      const taskMap: Record<number, any> = {}
      tasks?.forEach(t => { taskMap[t.id] = t })

      const items: PendingSignoff[] = signoffs.map(s => {
        const task = taskMap[s.task_id]
        const section = task?.pqs_sections
        return {
          ...s,
          candidate_name: candNames[s.candidate_id] || 'Unknown',
          task_desc: task?.description || 'Unknown task',
          task_code: task?.task_id || '',
          section_title: Array.isArray(section) ? section[0]?.title : section?.title || '',
        }
      })

      setPending(items)
    } catch (err) {
      console.error('Error loading pending:', err)
    } finally {
      setLoading(false)
    }
  }

  async function approve(signoffId: string) {
    const { error } = await supabase
      .from('task_signoffs')
      .update({
        status: 'signed_off',
        evaluator_id: user!.id,
        evaluator_name: user!.full_name,
        evaluator_company: user!.company,
        signed_off_at: new Date().toISOString(),
        notes: feedback[signoffId] || null,
      })
      .eq('id', signoffId)

    if (!error) {
      setPending(prev => prev.filter(p => p.id !== signoffId))
    }
  }

  async function reject(signoffId: string) {
    const notes = feedback[signoffId]
    if (!notes?.trim()) {
      alert('Please provide feedback for the apprentice before rejecting.')
      return
    }

    const { error } = await supabase
      .from('task_signoffs')
      .update({
        status: 'needs_work',
        evaluator_id: user!.id,
        needs_work_feedback: notes,
      })
      .eq('id', signoffId)

    if (!error) {
      setPending(prev => prev.filter(p => p.id !== signoffId))
    }
  }

  if (loading) {
    return <div className="loading-page"><div className="loading-spinner" /></div>
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>⏳ Pending Sign-offs</h2>
        <p>{pending.length} task{pending.length !== 1 ? 's' : ''} awaiting your review</p>
      </div>

      {pending.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>
          <p>No pending sign-off requests. All caught up! ✅</p>
        </div>
      ) : (
        pending.map(item => (
          <div key={item.id} className="card card-gold" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span className="task-id">{item.task_code}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>— {item.candidate_name}</span>
                </div>
                <div style={{ fontSize: 14 }}>{item.task_desc}</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>{item.section_title}</div>

                <textarea
                  placeholder="Optional feedback or notes..."
                  value={feedback[item.id] || ''}
                  onChange={e => setFeedback(prev => ({ ...prev, [item.id]: e.target.value }))}
                  style={{
                    width: '100%', marginTop: 12, padding: 10,
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                    fontSize: 13, resize: 'vertical', minHeight: 60,
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="btn-secondary btn-sm btn-danger" onClick={() => reject(item.id)}>
                ✕ Needs Work
              </button>
              <button className="btn-primary btn-sm" onClick={() => approve(item.id)}>
                ✓ Sign Off
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

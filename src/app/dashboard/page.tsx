'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import ProgressRing from '@/components/ProgressRing'
import { supabase } from '@/lib/supabase'
import { PQS_SECTIONS, TOTAL_TASKS } from '@/data/pqs-sections'
import Link from 'next/link'

interface SignoffCounts {
  signed_off: number
  submitted: number
  needs_work: number
  not_started: number
}

export default function TechnicianDashboard() {
  const { user } = useAuth()
  const [counts, setCounts] = useState<SignoffCounts>({ signed_off: 0, submitted: 0, needs_work: 0, not_started: TOTAL_TASKS })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadProgress()
  }, [user])

  async function loadProgress() {
    try {
      // Get candidate record
      const { data: candidate } = await supabase
        .from('candidates')
        .select('id')
        .eq('user_id', user!.id)
        .single()

      if (!candidate) { setLoading(false); return }

      // Get all sign-offs
      const { data: signoffs } = await supabase
        .from('task_signoffs')
        .select('status')
        .eq('candidate_id', candidate.id)

      const c: SignoffCounts = { signed_off: 0, submitted: 0, needs_work: 0, not_started: TOTAL_TASKS }
      if (signoffs) {
        signoffs.forEach(s => {
          if (s.status === 'signed_off') c.signed_off++
          else if (s.status === 'submitted') c.submitted++
          else if (s.status === 'needs_work') c.needs_work++
        })
        c.not_started = TOTAL_TASKS - c.signed_off - c.submitted - c.needs_work
      }
      setCounts(c)
    } catch (err) {
      console.error('Error loading progress:', err)
    } finally {
      setLoading(false)
    }
  }

  const pct = Math.round((counts.signed_off / TOTAL_TASKS) * 100)

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner" />
        <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="card card-gold dash-hero">
        <div className="hero-content">
          <h2>📋 My Sign-offs</h2>
          <p>
            {user?.full_name} — {counts.signed_off} of {TOTAL_TASKS} tasks signed off
          </p>
        </div>
        <div className="hero-stats">
          <ProgressRing percent={pct} size={140} done={counts.signed_off} total={TOTAL_TASKS} />
        </div>
      </div>

      <div className="stats-row" style={{ margin: '20px 0' }}>
        <div className="stat-card">
          <div className="stat-value gold">{counts.signed_off}</div>
          <div className="stat-label">Signed Off</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--blue)' }}>{counts.submitted}</div>
          <div className="stat-label">Requested</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--red)' }}>{counts.needs_work}</div>
          <div className="stat-label">Needs Rework</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{counts.not_started}</div>
          <div className="stat-label">Not Started</div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {PQS_SECTIONS.map(section => (
          <SectionRow key={section.number} section={section} userId={user!.id} />
        ))}
      </div>
    </div>
  )
}

function SectionRow({ section, userId }: { section: typeof PQS_SECTIONS[0]; userId: string }) {
  const [expanded, setExpanded] = useState(false)
  const [taskStatuses, setTaskStatuses] = useState<Record<string, string>>({})
  const [candidateId, setCandidateId] = useState<string | null>(null)

  useEffect(() => {
    loadSection()
  }, [userId])

  async function loadSection() {
    const { data: candidate } = await supabase
      .from('candidates')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!candidate) return
    setCandidateId(candidate.id)

    // Get task IDs for this section
    const taskIds = section.tasks.map(t => t.taskId)
    const { data: tasks } = await supabase
      .from('pqs_tasks')
      .select('id, task_id')
      .in('task_id', taskIds)

    if (!tasks) return

    const { data: signoffs } = await supabase
      .from('task_signoffs')
      .select('task_id, status')
      .eq('candidate_id', candidate.id)
      .in('task_id', tasks.map(t => t.id))

    const statuses: Record<string, string> = {}
    if (signoffs) {
      signoffs.forEach(s => {
        const task = tasks.find(t => t.id === s.task_id)
        if (task) statuses[task.task_id] = s.status
      })
    }
    setTaskStatuses(statuses)
  }

  const doneCount = section.tasks.filter(t => taskStatuses[t.taskId] === 'signed_off').length
  const pct = section.tasks.length > 0 ? Math.round((doneCount / section.tasks.length) * 100) : 0

  function badgeClass(status: string) {
    switch (status) {
      case 'signed_off': return 'badge badge-signed'
      case 'submitted': return 'badge badge-requested'
      case 'needs_work': return 'badge badge-needswork'
      default: return 'badge badge-notstarted'
    }
  }
  function badgeLabel(status: string) {
    switch (status) {
      case 'signed_off': return '✓ Signed Off'
      case 'submitted': return '⏳ Requested'
      case 'needs_work': return '⚠ Needs Work'
      default: return 'Not Started'
    }
  }

  async function requestSignoff(taskId: string) {
    if (!candidateId) return

    // Get the pqs_task DB ID
    const { data: task } = await supabase
      .from('pqs_tasks')
      .select('id')
      .eq('task_id', taskId)
      .single()

    if (!task) return

    // Upsert sign-off request
    const { error } = await supabase
      .from('task_signoffs')
      .upsert({
        candidate_id: candidateId,
        task_id: task.id,
        status: 'submitted',
      }, { onConflict: 'candidate_id,task_id' })

    if (!error) {
      setTaskStatuses(prev => ({ ...prev, [taskId]: 'submitted' }))
    }
  }

  return (
    <div className="section-item">
      <div className="section-header" onClick={() => setExpanded(!expanded)}>
        <span className="section-title">
          {doneCount === section.tasks.length ? '✓ ' : ''}
          Section {section.number}: {section.title}
        </span>
        <div className="section-progress">
          <span>{doneCount}/{section.tasks.length}</span>
          <div className="section-bar">
            <div className="section-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <span style={{ fontSize: 16 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="section-tasks">
          {section.tasks.map(task => {
            const status = taskStatuses[task.taskId] || 'not_started'
            return (
              <div key={task.taskId} className="task-item">
                <div style={{ flex: 1 }}>
                  <div className="task-id">{task.taskId}</div>
                  <div className="task-desc">{task.description}</div>
                  <div className="task-standard">Standard: {task.performanceStandard}</div>
                </div>
                <div className="task-actions">
                  <span className={badgeClass(status)}>{badgeLabel(status)}</span>
                  {status === 'not_started' && (
                    <button className="btn-secondary btn-sm" onClick={() => requestSignoff(task.taskId)}>
                      Request Sign-off
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

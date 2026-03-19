'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'

interface PortfolioItem {
  item_type: string
  file_path: string | null
  submitted: boolean
  submitted_at: string | null
}

const PORTFOLIO_ITEMS = [
  { key: 'qual_record', label: 'Qualification Record', desc: 'Official CAET Advanced Qualification Record signed by evaluator', category: 'certification' },
  { key: 'written_cert', label: 'Written Exam Certificate', desc: 'CAET Advanced written exam passing certificate from AEA', category: 'certification' },
  { key: 'logbook_transponder', label: 'Transponder Test Logbook Entry', desc: 'Sample logbook entry for 91.413 transponder test', category: 'evidence' },
  { key: 'logbook_pitot', label: 'Pitot-Static Test Logbook Entry', desc: 'Sample logbook entry for 91.411 altimeter/static test', category: 'evidence' },
  { key: 'form_337', label: 'FAA Form 337', desc: 'Completed Form 337 for a major alteration', category: 'evidence' },
  { key: 'transponder_form', label: 'Transponder Test Data Form', desc: 'Completed transponder test data sheet', category: 'evidence' },
  { key: 'deviation_card', label: 'Compass Deviation Card', desc: 'Compass deviation card created or verified during training', category: 'evidence' },
]

export default function PortfolioPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Record<string, PortfolioItem>>({})
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    if (user) loadPortfolio()
  }, [user])

  async function loadPortfolio() {
    try {
      const { data: candidate } = await supabase
        .from('candidates').select('id').eq('user_id', user!.id).single()
      if (!candidate) { setLoading(false); return }
      setCandidateId(candidate.id)

      const { data } = await supabase
        .from('portfolio_items').select('*').eq('candidate_id', candidate.id)

      const map: Record<string, PortfolioItem> = {}
      data?.forEach(item => { map[item.item_type] = item })
      setItems(map)
    } catch (err) {
      console.error('Error loading portfolio:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(itemKey: string, file: File) {
    if (!candidateId) return
    setUploading(itemKey)

    try {
      // Upload to Supabase Storage
      const path = `portfolio/${candidateId}/${itemKey}/${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      // Create or update portfolio record
      const { error } = await supabase
        .from('portfolio_items')
        .upsert({
          candidate_id: candidateId,
          item_type: itemKey,
          file_path: path,
          submitted: true,
          submitted_at: new Date().toISOString(),
        }, { onConflict: 'candidate_id,item_type' })

      if (!error) {
        setItems(prev => ({
          ...prev,
          [itemKey]: { item_type: itemKey, file_path: path, submitted: true, submitted_at: new Date().toISOString() }
        }))
      }
    } catch (err: any) {
      console.error('Upload error:', err)
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(null)
    }
  }

  const submittedCount = PORTFOLIO_ITEMS.filter(p => items[p.key]?.submitted).length

  if (loading) {
    return <div className="loading-page"><div className="loading-spinner" /></div>
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>📁 Portfolio</h2>
        <p>{submittedCount} of {PORTFOLIO_ITEMS.length} items uploaded</p>
      </div>

      {PORTFOLIO_ITEMS.map(item => {
        const uploaded = items[item.key]?.submitted
        return (
          <div key={item.key} className="card" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>{item.desc}</div>
            </div>
            <div className="task-actions">
              {uploaded ? (
                <span className="badge badge-signed">✓ Uploaded</span>
              ) : (
                <label className="btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  {uploading === item.key ? 'Uploading...' : '📎 Upload'}
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (f) handleUpload(item.key, f)
                    }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </label>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

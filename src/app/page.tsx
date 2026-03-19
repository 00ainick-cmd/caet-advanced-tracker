import Link from 'next/link'

export default function Home() {
  return (
    <main className="auth-page">
      <div className="auth-card auth-card-wide" style={{ textAlign: 'center' }}>
        <div className="auth-logo" style={{ marginBottom: 16 }}>AEA</div>
        <h1 style={{ fontSize: 28, color: 'var(--gold-light)', marginBottom: 8 }}>CAET Advanced</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 32, letterSpacing: 2, textTransform: 'uppercase' }}>
          Practical Qualification Tracker
        </p>

        <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
          Track your CAET Advanced certification progress — 75 practical tasks across 13 sections,
          evaluator sign-offs, portfolio submissions, and oral board preparation.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 28px' }}>
            Sign In →
          </Link>
          <Link href="/signup" className="btn-secondary" style={{ textDecoration: 'none', padding: '12px 28px' }}>
            Create Account
          </Link>
        </div>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 32 }}>
          Aircraft Electronics Association • CAET Advanced Certification Program
        </p>
      </div>
    </main>
  )
}

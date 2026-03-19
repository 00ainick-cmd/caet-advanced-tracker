'use client'

import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { getDashboardPath } from '@/lib/auth'

export default function NavHeader() {
  const { user, signOut } = useAuth()

  if (!user) return null

  const dashPath = getDashboardPath(user.role)

  const roleLabel: Record<string, string> = {
    technician: 'Technician',
    evaluator: 'Evaluator',
    committee: 'Committee',
    admin: 'Admin',
  }

  return (
    <header className="nav-header">
      <div className="nav-left">
        <Link href={dashPath} className="nav-logo">
          <span className="nav-logo-badge">AEA</span>
          <div className="nav-logo-text">
            <span className="nav-title">CAET Advanced Tracker</span>
            <span className="nav-subtitle">{user.company || 'Training Portal'} — {roleLabel[user.role]}</span>
          </div>
        </Link>
      </div>

      <nav className="nav-links">
        {user.role === 'technician' && (
          <>
            <Link href="/dashboard" className="nav-link">Sign-offs</Link>
            <Link href="/dashboard/training" className="nav-link">Training</Link>
            <Link href="/dashboard/portfolio" className="nav-link">Portfolio</Link>
          </>
        )}
        {user.role === 'evaluator' && (
          <>
            <Link href="/evaluator" className="nav-link">Apprentices</Link>
            <Link href="/evaluator/pending" className="nav-link">Pending</Link>
            <Link href="/evaluator/training" className="nav-link">My Training</Link>
          </>
        )}
        {user.role === 'committee' && (
          <>
            <Link href="/committee" className="nav-link">Oral Board</Link>
          </>
        )}
        {user.role === 'admin' && (
          <>
            <Link href="/admin" className="nav-link">Dashboard</Link>
            <Link href="/admin/people" className="nav-link">People</Link>
          </>
        )}
      </nav>

      <div className="nav-right">
        <span className="nav-user">{user.full_name}</span>
        <button onClick={signOut} className="nav-signout">Sign Out</button>
      </div>
    </header>
  )
}

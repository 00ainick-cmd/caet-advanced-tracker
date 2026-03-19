'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp, getDashboardPath } from '@/lib/auth'
import type { UserRole } from '@/lib/auth'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    stateCode: '',
    role: 'technician' as UserRole,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await signUp(
        form.email,
        form.password,
        form.fullName,
        form.role,
        form.company,
        form.stateCode
      )
      router.push(getDashboardPath(form.role))
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <div className="auth-logo">AEA</div>
          <h1>Create Account</h1>
          <p>Join the CAET Advanced certification program</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={e => update('fullName', e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={form.role}
                onChange={e => update('role', e.target.value)}
              >
                <option value="technician">Technician / Apprentice</option>
                <option value="evaluator">Shop Evaluator</option>
                <option value="committee">AEA Committee</option>
                <option value="admin">AEA Admin</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Shop / Company</label>
              <input
                id="company"
                type="text"
                value={form.company}
                onChange={e => update('company', e.target.value)}
                placeholder="Thompson Avionics"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stateCode">State</label>
              <input
                id="stateCode"
                type="text"
                value={form.stateCode}
                onChange={e => update('stateCode', e.target.value.toUpperCase().slice(0, 2))}
                placeholder="MO"
                maxLength={2}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signupEmail">Email</label>
            <input
              id="signupEmail"
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="you@yourshop.com"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="signupPassword">Password</label>
              <input
                id="signupPassword"
                type="password"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link href="/login">Sign in</Link></p>
        </div>
      </div>
    </main>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider } from './AuthProvider'
import NavHeader from './NavHeader'

const noNavPaths = ['/login', '/signup', '/']

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showNav = !noNavPaths.includes(pathname)

  return (
    <AuthProvider>
      {showNav && <NavHeader />}
      {children}
    </AuthProvider>
  )
}

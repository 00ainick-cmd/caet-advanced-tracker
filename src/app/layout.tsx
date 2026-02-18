import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CAET Advanced Tracker',
  description: 'Practical Qualification Standards tracking for CAET Advanced certification',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#d4a844]">CAET Advanced</h1>
          <p className="text-lg text-gray-400 tracking-widest uppercase text-sm">
            Practical Qualification Tracker
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Link
            href="/dashboard"
            className="bg-[#111827] border border-[#222d44] hover:border-[#d4a844]/40 rounded-xl p-6 transition-all group"
          >
            <div className="text-2xl mb-2">🔧</div>
            <div className="font-semibold group-hover:text-[#d4a844] transition-colors">Technician</div>
            <div className="text-xs text-gray-500 mt-1">Track your progress</div>
          </Link>
          
          <Link
            href="/evaluator"
            className="bg-[#111827] border border-[#222d44] hover:border-[#d4a844]/40 rounded-xl p-6 transition-all group"
          >
            <div className="text-2xl mb-2">✅</div>
            <div className="font-semibold group-hover:text-[#d4a844] transition-colors">Evaluator</div>
            <div className="text-xs text-gray-500 mt-1">Sign off tasks</div>
          </Link>
          
          <Link
            href="/committee"
            className="bg-[#111827] border border-[#222d44] hover:border-[#d4a844]/40 rounded-xl p-6 transition-all group"
          >
            <div className="text-2xl mb-2">🎤</div>
            <div className="font-semibold group-hover:text-[#d4a844] transition-colors">Committee</div>
            <div className="text-xs text-gray-500 mt-1">Oral board scoring</div>
          </Link>
          
          <Link
            href="/admin"
            className="bg-[#111827] border border-[#222d44] hover:border-[#d4a844]/40 rounded-xl p-6 transition-all group"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold group-hover:text-[#d4a844] transition-colors">AEA Admin</div>
            <div className="text-xs text-gray-500 mt-1">National dashboard</div>
          </Link>
        </div>
        
        <p className="text-xs text-gray-600">
          Aircraft Electronics Association • CAET Advanced Certification Program
        </p>
      </div>
    </main>
  )
}

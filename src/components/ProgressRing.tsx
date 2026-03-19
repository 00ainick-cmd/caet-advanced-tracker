'use client'

interface ProgressRingProps {
  percent: number
  size?: number
  done?: number
  total?: number
  strokeWidth?: number
}

export default function ProgressRing({
  percent,
  size = 130,
  done,
  total,
  strokeWidth = 9,
}: ProgressRingProps) {
  const r = size / 2 - strokeWidth
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ

  const doneLabel = done !== undefined ? done : Math.round(percent * 0.75)
  const totalLabel = total !== undefined ? total : 75

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="bg-ring"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
        />
        <circle
          className="fg-ring"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#C5960C"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="pct">
        <span className="pct-value">{percent}%</span>
        <small>{doneLabel} / {totalLabel}</small>
      </div>
    </div>
  )
}

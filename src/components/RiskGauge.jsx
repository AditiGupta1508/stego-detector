import { motion } from 'framer-motion'

const LEVEL_COLORS = {
  safe: '#00E5A0',
  low: '#4FD1FF',
  medium: '#F5B942',
  high: '#FF6B4A',
}

export default function RiskGauge({ score, verdict, level }) {
  const radius = 80
  const circumference = Math.PI * radius // half circle
  const offset = circumference - (score / 100) * circumference
  const color = LEVEL_COLORS[level] || '#00E5A0'

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#1A222D"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      </svg>
      <div className="-mt-9 flex flex-col items-center">
        <span className="font-display text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="font-mono text-xs text-text-muted">/ 100 risk score</span>
      </div>
      <span
        className="mt-3 rounded-full border px-4 py-1 font-mono text-sm font-semibold"
        style={{ borderColor: color, color }}
      >
        {verdict}
      </span>
    </div>
  )
}

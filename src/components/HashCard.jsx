import { useState } from 'react'
import { HiOutlineClipboardCopy, HiOutlineCheck } from 'react-icons/hi'

export default function HashCard({ label, value, note }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-data">{label}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-text"
        >
          {copied ? <HiOutlineCheck className="text-scan" /> : <HiOutlineClipboardCopy />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="break-all font-mono text-sm text-text">{value}</p>
      {note && <p className="mt-2 text-xs text-text-muted">{note}</p>}
    </div>
  )
}

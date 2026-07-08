import { useMemo } from 'react'

// Signature hero visual: a field of shimmering 0/1 characters.
// Not decorative noise — it's a direct nod to the tool's actual mechanism:
// steganography hides data in the least-significant BIT of each pixel, and
// this is literally what that bit-plane looks like when visualized.
export default function BitField({ rows = 8, cols = 40 }) {
  const grid = useMemo(() => {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => (Math.random() > 0.5 ? 1 : 0))
    )
  }, [rows, cols])

  return (
    <div className="pointer-events-none select-none font-mono text-[11px] leading-[1.7] text-scan/25 md:text-xs">
      {grid.map((row, r) => (
        <div key={r} className="whitespace-nowrap">
          {row.map((bit, c) => (
            <span
              key={c}
              className="animate-blink"
              style={{ animationDelay: `${((r * cols + c) % 37) * 0.09}s` }}
            >
              {bit}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

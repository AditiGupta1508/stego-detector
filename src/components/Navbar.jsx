import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'
import { TbBinaryTree2 } from 'react-icons/tb'

const links = [
  { to: '/', label: 'Home' },
  { to: '/scan', label: 'Scanner' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-scan/40 bg-scan/10 text-scan">
            <TbBinaryTree2 size={18} />
          </span>
          StegoScan
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-mono text-sm tracking-wide transition-colors ${
                  isActive ? 'text-scan' : 'text-text-muted hover:text-text'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/scan"
            className="rounded-md bg-scan px-4 py-2 font-mono text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
          >
            Start Scan
          </NavLink>
        </nav>

        <button
          className="text-text md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-surface px-5 py-4 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 font-mono text-sm ${
                  isActive ? 'bg-scan/10 text-scan' : 'text-text-muted'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

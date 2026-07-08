import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineFingerPrint, HiOutlineChartBar, HiOutlineDocumentSearch, HiOutlineShieldExclamation } from 'react-icons/hi'
import { TbBinary } from 'react-icons/tb'
import BitField from '../components/BitField'

const features = [
  {
    icon: TbBinary,
    title: 'LSB Chi-Square Test',
    desc: 'The classic statistical test for least-significant-bit embedding, run on real pixel data.',
  },
  {
    icon: HiOutlineShieldExclamation,
    title: 'Trailing Data Check',
    desc: 'Scans raw file bytes for hidden payloads appended after the image\u2019s real end marker.',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Entropy & Histogram',
    desc: 'Shannon entropy and per-channel histograms surface statistical anomalies at a glance.',
  },
  {
    icon: HiOutlineFingerPrint,
    title: 'Hash Verification',
    desc: 'SHA-1 and SHA-256 digests, generated locally via the Web Crypto API.',
  },
  {
    icon: HiOutlineDocumentSearch,
    title: 'Bit-Plane Visualization',
    desc: 'See exactly which layer of the image LSB steganography hides inside.',
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-fade absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 top-0 opacity-70">
          <BitField rows={10} cols={60} />
        </div>
        <div className="relative mx-auto max-w-4xl px-5 py-28 text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block rounded-full border border-scan/40 bg-scan/10 px-4 py-1 font-mono text-xs text-scan"
          >
            client-side · no uploads · runs in your browser
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 font-display text-4xl font-bold tracking-tight md:text-6xl"
          >
            What's really <span className="text-scan">hiding</span><br />inside your images?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-xl text-text-muted"
          >
            StegoScan analyzes images for hidden data using real steganalysis techniques —
            LSB chi-square testing, entropy analysis, and file-structure inspection — entirely in your browser.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex justify-center gap-4"
          >
            <Link to="/scan" className="rounded-md bg-scan px-6 py-3 font-mono text-sm font-semibold text-bg transition-transform hover:scale-[1.03]">
              Start Scan
            </Link>
            <Link to="/about" className="rounded-md border border-border px-6 py-3 font-mono text-sm text-text-muted transition-colors hover:text-text">
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-2xl font-semibold">Detection Modules</h2>
        <p className="mt-2 max-w-xl text-text-muted">Five independent tests, combined into one transparent risk score.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-scan/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-scan/30 bg-scan/10 text-scan">
                <f.icon size={20} />
              </div>
              <h3 className="mt-4 font-display font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-text-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

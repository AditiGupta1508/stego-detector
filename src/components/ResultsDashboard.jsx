import { motion } from 'framer-motion'
import { HiOutlineDownload, HiOutlineRefresh, HiOutlineExclamation, HiOutlineShieldCheck } from 'react-icons/hi'
import RiskGauge from './RiskGauge'
import HistogramChart from './HistogramChart'
import HashCard from './HashCard'
import { formatBytes } from '../utils/hashing'
import { generateReport } from '../utils/pdfReport'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function ResultsDashboard({ result, onReset }) {
  const { file, previewUrl, hashes, chi2, entropyResult, histograms, lsbPlaneUrl, trailingData, risk } = result

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="space-y-6">
      {/* Top summary row */}
      <motion.div variants={fadeUp} className="grid gap-6 rounded-xl border border-border bg-surface p-6 md:grid-cols-[220px_1fr_220px]">
        <div className="overflow-hidden rounded-lg border border-border">
          <img src={previewUrl} alt="Uploaded" className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col justify-center gap-2">
          <h3 className="font-display text-xl font-semibold">{file.name}</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-xs text-text-muted">
            <span>Type: <span className="text-text">{file.type}</span></span>
            <span>Size: <span className="text-text">{formatBytes(file.size)}</span></span>
            <span>Dimensions: <span className="text-text">{result.width}×{result.height}px</span></span>
            <span>Trailing bytes: <span className={trailingData.suspicious ? 'text-alert' : 'text-text'}>{trailingData.trailingBytes}</span></span>
          </div>
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => generateReport({ file, imagePreviewUrl: previewUrl, lsbPlaneUrl, hashes, chi2, entropyResult, trailingData, risk })}
              className="flex items-center gap-2 rounded-md bg-scan px-4 py-2 font-mono text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
            >
              <HiOutlineDownload /> Download PDF Report
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-2 rounded-md border border-border px-4 py-2 font-mono text-sm text-text-muted transition-colors hover:text-text"
            >
              <HiOutlineRefresh /> Scan Another
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <RiskGauge score={risk.score} verdict={risk.verdict} level={risk.level} />
        </div>
      </motion.div>

      {/* Recommendation banner */}
      <motion.div
        variants={fadeUp}
        className={`flex items-start gap-3 rounded-xl border p-4 ${
          risk.score >= 45 ? 'border-alert/40 bg-alert/10' : 'border-scan/40 bg-scan/10'
        }`}
      >
        {risk.score >= 45 ? <HiOutlineExclamation className="mt-0.5 shrink-0 text-alert" size={20} /> : <HiOutlineShieldCheck className="mt-0.5 shrink-0 text-scan" size={20} />}
        <div>
          <p className={`font-display font-semibold ${risk.score >= 45 ? 'text-alert' : 'text-scan'}`}>
            {risk.score >= 45 ? 'Anomalies detected — treat with caution' : 'No strong indicators of hidden data'}
          </p>
          <p className="mt-1 text-sm text-text-muted">
            {risk.score >= 45
              ? 'Verify the source of this file, avoid re-sharing it until reviewed, and check the trailing-data and chi-square results below for specifics.'
              : 'The statistical tests below came back within normal ranges for a natural image. This is not an absolute guarantee — always corroborate with source verification.'}
          </p>
        </div>
      </motion.div>

      {/* Risk breakdown */}
      <motion.div variants={fadeUp} className="rounded-xl border border-border bg-surface p-6">
        <h4 className="font-display text-lg font-semibold">Risk Score Breakdown</h4>
        <div className="mt-4 space-y-3">
          {risk.contributions.map((c) => (
            <div key={c.label}>
              <div className="mb-1 flex justify-between font-mono text-xs text-text-muted">
                <span>{c.label}</span>
                <span>{c.points.toFixed(1)} / {c.max}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-2">
                <div
                  className="h-2 rounded-full bg-data"
                  style={{ width: `${(c.points / c.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Chi-square + entropy */}
        <motion.div variants={fadeUp} className="rounded-xl border border-border bg-surface p-6">
          <h4 className="font-display text-lg font-semibold">LSB Chi-Square Test</h4>
          <p className="mt-1 text-sm text-text-muted">
            Tests whether pixel value pairs have been artificially equalized — the classic signature of LSB embedding.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-surface-2 p-3">
              <p className="font-mono text-2xl font-bold text-data">{chi2.avgChi2}</p>
              <p className="text-xs text-text-muted">avg χ² per pair</p>
            </div>
            <div className="rounded-lg bg-surface-2 p-3">
              <p className="font-mono text-2xl font-bold text-data">{entropyResult.entropy}</p>
              <p className="text-xs text-text-muted">Shannon entropy (bits/px)</p>
            </div>
          </div>
        </motion.div>

        {/* LSB plane */}
        <motion.div variants={fadeUp} className="rounded-xl border border-border bg-surface p-6">
          <h4 className="font-display text-lg font-semibold">LSB Bit-Plane Visualization</h4>
          <p className="mt-1 text-sm text-text-muted">Red channel's least significant bit, rendered as black/white.</p>
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <img src={lsbPlaneUrl} alt="LSB plane" className="w-full" />
          </div>
        </motion.div>
      </div>

      {/* Histogram */}
      <motion.div variants={fadeUp} className="rounded-xl border border-border bg-surface p-6">
        <h4 className="font-display text-lg font-semibold">RGB Histogram Analysis</h4>
        <p className="mt-1 text-sm text-text-muted">Pixel value distribution per channel (32 buckets).</p>
        <div className="mt-4">
          <HistogramChart data={histograms} />
        </div>
      </motion.div>

      {/* Hashes */}
      <motion.div variants={fadeUp} className="rounded-xl border border-border bg-surface p-6">
        <h4 className="font-display text-lg font-semibold">Hash Verification</h4>
        <p className="mt-1 text-sm text-text-muted">Use these to verify this exact file later, byte-for-byte.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <HashCard label="SHA-256" value={hashes.sha256} />
          <HashCard label="SHA-1" value={hashes.sha1} note="Shown for legacy compatibility — SHA-1 has known collision weaknesses and shouldn't be relied on alone." />
        </div>
      </motion.div>

      {/* Trailing data */}
      <motion.div variants={fadeUp} className="rounded-xl border border-border bg-surface p-6">
        <h4 className="font-display text-lg font-semibold">File Structure / Trailing Data Check</h4>
        <p className="mt-1 text-sm text-text-muted">
          Checks for data appended after the image's official end marker — a common, low-effort way to smuggle a hidden file.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-4 font-mono text-sm">
          <div><p className="text-text-muted text-xs">Expected end</p><p>{trailingData.expectedEnd} B</p></div>
          <div><p className="text-text-muted text-xs">Actual file size</p><p>{trailingData.actualEnd} B</p></div>
          <div>
            <p className="text-text-muted text-xs">Trailing bytes</p>
            <p className={trailingData.suspicious ? 'text-alert font-semibold' : 'text-scan'}>{trailingData.trailingBytes} B</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

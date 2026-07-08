import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import UploadZone from '../components/UploadZone'
import ResultsDashboard from '../components/ResultsDashboard'
import { hashFile } from '../utils/hashing'
import {
  loadImageData, chiSquareLSB, shannonEntropy,
  bucketedHistograms, extractLSBPlane, checkTrailingData, computeRiskScore,
} from '../utils/steganalysis'

const STAGES = [
  'Reading file bytes…',
  'Generating cryptographic hashes…',
  'Decoding pixel data…',
  'Running LSB chi-square test…',
  'Computing entropy & histograms…',
  'Checking for trailing payloads…',
  'Compiling risk score…',
]

export default function Scanner() {
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [stageIndex, setStageIndex] = useState(0)
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const runAnalysis = async (file) => {
    setStatus('loading')
    setStageIndex(0)
    setErrorMsg('')
    try {
      const tick = (i) => new Promise((res) => setTimeout(() => { setStageIndex(i); res() }, 260))

      await tick(0)
      const hashes = await hashFile(file)
      await tick(1)

      const { imageData, width, height } = await loadImageData(file)
      await tick(2)

      const chi2 = chiSquareLSB(imageData)
      await tick(3)

      const entropyResult = shannonEntropy(imageData)
      const histograms = bucketedHistograms(imageData)
      await tick(4)

      const trailingData = checkTrailingData(hashes.buffer, file.type)
      await tick(5)

      const lsbPlaneUrl = extractLSBPlane(imageData, width, height)
      const risk = computeRiskScore({ chi2, entropyResult, trailingData })
      await tick(6)

      setResult({
        file, width, height,
        previewUrl: URL.createObjectURL(file),
        hashes, chi2, entropyResult, histograms, lsbPlaneUrl, trailingData, risk,
      })
      setStatus('done')
    } catch (err) {
      console.error(err)
      setErrorMsg('Something went wrong reading this file. Try a different image.')
      setStatus('error')
    }
  }

  const reset = () => {
    setStatus('idle')
    setResult(null)
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold">Image Scanner</h1>
        <p className="mt-2 text-text-muted">Upload an image to run the full detection pipeline.</p>
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UploadZone onFile={runAnalysis} />
          </motion.div>
        )}

        {status === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 rounded-xl border border-border bg-surface py-20"
          >
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-border border-t-scan" />
              <div className="absolute inset-3 rounded-full bg-scan/10" />
            </div>
            <p className="font-mono text-sm text-scan">{STAGES[stageIndex]}</p>
            <div className="h-1 w-64 overflow-hidden rounded-full bg-surface-2">
              <motion.div
                className="h-1 bg-scan"
                animate={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-alert/40 bg-alert/10 p-8 text-center">
            <p className="text-alert">{errorMsg}</p>
            <button onClick={reset} className="mt-4 rounded-md border border-border px-4 py-2 font-mono text-sm text-text-muted hover:text-text">
              Try Again
            </button>
          </motion.div>
        )}

        {status === 'done' && result && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ResultsDashboard result={result} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { motion } from 'framer-motion'

const modules = [
  {
    title: 'LSB Chi-Square Attack',
    body: 'Least-significant-bit (LSB) steganography hides data by replacing the lowest bit of each pixel value. This tends to equalize the frequency of "pairs of values" (e.g. 100 and 101) that are usually unequal in natural images. The chi-square test measures how close those pairs are to artificially equal — a statistic near zero is a strong indicator of LSB embedding. This is the classic Westfeld & Pfitzmann-style approach used in real steganalysis research.',
  },
  {
    title: 'Trailing Data / File Structure Check',
    body: 'JPEG files end with a defined End-Of-Image marker (0xFFD9); PNG files end with an IEND chunk. A common, low-effort way to hide a file inside an image is to simply append it after that marker, since viewers ignore anything past it. This tool reads the raw bytes of the file and checks whether meaningful data exists beyond the expected end point.',
  },
  {
    title: 'Shannon Entropy',
    body: 'Entropy measures the randomness of pixel values, from 0 (completely uniform) to 8 bits (maximally random). Encrypted or compressed hidden payloads tend to be close to pure randomness, which can nudge an image\u2019s entropy higher than expected. On its own this is only a supporting signal — busy, detailed photographs are already naturally high-entropy.',
  },
  {
    title: 'LSB Bit-Plane Visualization',
    body: 'Isolating and rendering just the least-significant bit of each pixel shows the exact layer where LSB steganography operates. In an untouched photo this plane already looks like random noise, so its main value here is educational — occasionally, naive embedding tools leave visible structure behind.',
  },
  {
    title: 'Cryptographic Hashing',
    body: 'SHA-1 and SHA-256 digests are generated using the browser\u2019s native Web Crypto API. These don\u2019t detect steganography directly, but let you verify a file hasn\u2019t changed since it was scanned. MD5 is intentionally left out — it\u2019s cryptographically broken and unsupported by modern browser APIs.',
  },
]

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl font-bold">How Detection Works</h1>
      <p className="mt-3 text-text-muted">
        StegoScan combines five independent, well-documented forensic techniques into a single weighted
        risk score. No single test proves that hidden data exists — steganalysis is inherently probabilistic —
        which is why each signal is shown separately alongside the combined verdict.
      </p>

      <div className="mt-10 space-y-6">
        {modules.map((m, i) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <h2 className="font-display font-semibold text-scan">{m.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{m.body}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-data/30 bg-data/5 p-6">
        <h2 className="font-display font-semibold text-data">A note on accuracy</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          This tool is built for educational and demonstrative purposes. Real-world steganalysis
          often combines these statistical methods with trained machine-learning classifiers for
          higher accuracy on adversarial or adaptive embedding. Treat the risk score as a strong
          starting signal, not a courtroom-grade verdict.
        </p>
      </div>
    </div>
  )
}

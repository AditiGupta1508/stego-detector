// Core steganalysis engine.
//
// Every technique here is a real, documented statistical/forensic method —
// nothing is simulated or faked. Detection is inherently probabilistic:
// no single test proves hidden data exists, which is why the tool combines
// several independent signals into one weighted risk score, and explains
// each one separately so the reasoning is transparent.

/** Decode a File into a canvas ImageData object. */
export function loadImageData(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve({ imageData, width: canvas.width, height: canvas.height })
    }
    img.onerror = (e) => reject(e)
    img.src = url
  })
}

/** Build a 0-255 histogram for a single channel (0=R, 1=G, 2=B). */
function channelHistogram(imageData, channel) {
  const hist = new Array(256).fill(0)
  const data = imageData.data
  for (let i = channel; i < data.length; i += 4) {
    hist[data[i]]++
  }
  return hist
}

/**
 * Chi-square LSB test (Westfeld & Pfitzmann-style pair analysis).
 * LSB embedding tends to equalize the frequency of "pairs of values"
 * (2i, 2i+1), because flipping the least significant bit only ever swaps
 * a pixel between the two members of its pair. Natural, unmodified images
 * usually show a noticeable imbalance between paired values; a chi-square
 * statistic close to 0 (relative to sample size) signals that the pairs
 * have been artificially equalized — a hallmark of LSB steganography.
 * Returns a 0-100 "anomaly score" where higher = more suspicious.
 */
export function chiSquareLSB(imageData) {
  const channels = [0, 1, 2]
  let totalChi2 = 0
  let totalPairs = 0

  channels.forEach((ch) => {
    const hist = channelHistogram(imageData, ch)
    for (let i = 0; i < 128; i++) {
      const v0 = hist[2 * i]
      const v1 = hist[2 * i + 1]
      const expected = (v0 + v1) / 2
      if (expected > 4) {
        totalChi2 += Math.pow(v0 - expected, 2) / expected
        totalPairs++
      }
    }
  })

  const avgChi2 = totalPairs > 0 ? totalChi2 / totalPairs : 0
  // Empirically, clean photographic images average well above ~3-4 per pair;
  // heavily LSB-embedded images collapse toward ~0-1. Map to a 0-100 score.
  const anomalyScore = Math.max(0, Math.min(100, 100 - avgChi2 * 14))
  return { avgChi2: Number(avgChi2.toFixed(3)), anomalyScore: Number(anomalyScore.toFixed(1)) }
}

/**
 * Shannon entropy (bits per pixel, 0-8) of the grayscale-equivalent signal.
 * Not conclusive on its own — busy natural photos are already high-entropy —
 * but a value pushed unusually close to the 7.9-8.0 ceiling is a supporting
 * signal worth flagging alongside the other tests.
 */
export function shannonEntropy(imageData) {
  const hist = new Array(256).fill(0)
  const data = imageData.data
  let total = 0
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
    hist[gray]++
    total++
  }
  let entropy = 0
  for (let i = 0; i < 256; i++) {
    if (hist[i] === 0) continue
    const p = hist[i] / total
    entropy -= p * Math.log2(p)
  }
  return { entropy: Number(entropy.toFixed(3)), histogram: hist }
}

/** Per-channel histograms sampled down to 32 buckets, for charting. */
export function bucketedHistograms(imageData) {
  const bucket = (hist) => {
    const buckets = new Array(32).fill(0)
    hist.forEach((count, v) => { buckets[Math.floor(v / 8)] += count })
    return buckets
  }
  const r = bucket(channelHistogram(imageData, 0))
  const g = bucket(channelHistogram(imageData, 1))
  const b = bucket(channelHistogram(imageData, 2))
  return Array.from({ length: 32 }, (_, i) => ({
    bucket: i * 8,
    R: r[i], G: g[i], B: b[i],
  }))
}

/**
 * Extracts the least-significant-bit plane and renders it as a black/white
 * data URL. This is primarily an educational visualization: in a genuinely
 * natural photo the LSB plane already looks like random noise, so its main
 * value is showing *why* LSBs are the payload carrier, and occasionally
 * revealing visible structure (blocks, repeated patterns, text-like shapes)
 * that a naive embedding tool leaves behind.
 */
export function extractLSBPlane(imageData, width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const out = ctx.createImageData(width, height)
  const src = imageData.data
  for (let i = 0; i < src.length; i += 4) {
    const bit = src[i] & 1 // red channel LSB
    const v = bit ? 255 : 0
    out.data[i] = v
    out.data[i + 1] = v
    out.data[i + 2] = v
    out.data[i + 3] = 255
  }
  ctx.putImageData(out, 0, 0)
  return canvas.toDataURL('image/png')
}

/**
 * Trailing-data / file-structure check — the single highest-signal test
 * here. JPEG files end with an End-Of-Image marker (0xFFD9); PNG files end
 * with an IEND chunk. A very common, low-effort steganography technique is
 * to simply append a hidden file's bytes *after* that terminator, since
 * image viewers ignore anything past it. This scans the raw file bytes and
 * flags any meaningful data found beyond the expected end-of-image point.
 */
export function checkTrailingData(buffer, mimeType) {
  const bytes = new Uint8Array(buffer)

  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    for (let i = bytes.length - 2; i >= 2; i--) {
      if (bytes[i] === 0xff && bytes[i + 1] === 0xd9) {
        const trailing = bytes.length - (i + 2)
        return {
          expectedEnd: i + 2,
          actualEnd: bytes.length,
          trailingBytes: trailing,
          suspicious: trailing > 8,
        }
      }
    }
  }

  if (mimeType === 'image/png') {
    const iendMarker = [0x49, 0x45, 0x4e, 0x44] // "IEND"
    for (let i = 0; i < bytes.length - 4; i++) {
      if (
        bytes[i] === iendMarker[0] && bytes[i + 1] === iendMarker[1] &&
        bytes[i + 2] === iendMarker[2] && bytes[i + 3] === iendMarker[3]
      ) {
        const end = i + 4 + 4 // IEND chunk name + its 4-byte CRC
        const trailing = bytes.length - end
        return {
          expectedEnd: end,
          actualEnd: bytes.length,
          trailingBytes: trailing,
          suspicious: trailing > 8,
        }
      }
    }
  }

  return { expectedEnd: bytes.length, actualEnd: bytes.length, trailingBytes: 0, suspicious: false }
}

/**
 * Combines every signal above into one 0-100 risk score and a verdict.
 * Weights reflect how conclusive each test is on its own: trailing data
 * is near-conclusive when substantial, the chi-square test is a strong
 * classic indicator, and entropy is a soft supporting signal.
 */
export function computeRiskScore({ chi2, entropyResult, trailingData }) {
  let score = 0
  const contributions = []

  const chiContribution = chi2.anomalyScore * 0.5
  score += chiContribution
  contributions.push({ label: 'LSB Chi-Square Test', points: chiContribution, max: 50 })

  const entropyExcess = Math.max(0, entropyResult.entropy - 7.2)
  const entropyContribution = Math.min(20, entropyExcess * 28)
  score += entropyContribution
  contributions.push({ label: 'Entropy Deviation', points: entropyContribution, max: 20 })

  let trailingContribution = 0
  if (trailingData.suspicious) {
    trailingContribution = Math.min(30, 15 + Math.log2(trailingData.trailingBytes + 1) * 2)
  }
  score += trailingContribution
  contributions.push({ label: 'Trailing / Appended Data', points: trailingContribution, max: 30 })

  score = Math.max(0, Math.min(100, Math.round(score)))

  let verdict = 'Clean'
  let level = 'safe'
  if (score >= 70) { verdict = 'High Risk'; level = 'high' }
  else if (score >= 45) { verdict = 'Suspicious'; level = 'medium' }
  else if (score >= 20) { verdict = 'Low Risk'; level = 'low' }

  return { score, verdict, level, contributions }
}

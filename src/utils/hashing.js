// Cryptographic hashing utilities.
// Uses the browser's native Web Crypto API (SubtleCrypto) — no external
// libraries needed. MD5 is intentionally omitted: it is cryptographically
// broken and not supported by SubtleCrypto, so SHA-1 and SHA-256 are used
// for integrity verification instead (with a note on SHA-1's own known
// collision weaknesses, shown in the UI).

async function digest(algorithm, buffer) {
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function hashFile(file) {
  const buffer = await file.arrayBuffer()
  const [sha1, sha256] = await Promise.all([
    digest('SHA-1', buffer),
    digest('SHA-256', buffer),
  ])
  return { sha1, sha256, byteLength: buffer.byteLength, buffer }
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

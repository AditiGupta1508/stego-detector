export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-text-muted">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="font-mono">
            <span className="text-scan">$</span> StegoScan — client-side image steganography analysis
          </p>
          <p className="text-xs">
            University project · All analysis runs locally in your browser · No images are uploaded to a server
          </p>
        </div>
      </div>
    </footer>
  )
}

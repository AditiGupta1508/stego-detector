import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineUpload, HiOutlinePhotograph } from 'react-icons/hi'

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff', 'image/gif']
const MAX_SIZE = 25 * 1024 * 1024 // 25 MB

export default function UploadZone({ onFile }) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  const validate = useCallback((file) => {
    if (!file) return 'No file selected.'
    if (!ACCEPTED.includes(file.type)) return `Unsupported format: ${file.type || 'unknown'}. Use JPG, PNG, BMP, TIFF or GIF.`
    if (file.size > MAX_SIZE) return 'File exceeds the 25 MB limit.'
    return ''
  }, [])

  const handleFiles = useCallback((fileList) => {
    const file = fileList?.[0]
    const err = validate(file)
    if (err) { setError(err); return }
    setError('')
    onFile(file)
  }, [onFile, validate])

  return (
    <div>
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        animate={{ borderColor: dragging ? '#00E5A0' : '#263241' }}
        className="relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed bg-surface/60 px-6 py-16 text-center"
      >
        <div className={`flex h-14 w-14 items-center justify-center rounded-full border ${dragging ? 'border-scan text-scan' : 'border-border text-text-muted'}`}>
          {dragging ? <HiOutlinePhotograph size={26} /> : <HiOutlineUpload size={26} />}
        </div>
        <div>
          <p className="font-display text-lg font-medium text-text">
            {dragging ? 'Drop it here' : 'Drag & drop an image, or browse'}
          </p>
          <p className="mt-1 font-mono text-xs text-text-muted">JPG · PNG · BMP · TIFF · GIF — up to 25MB</p>
        </div>
        <label className="cursor-pointer rounded-md bg-scan px-5 py-2.5 font-mono text-sm font-semibold text-bg transition-transform hover:scale-[1.03]">
          Choose File
          <input
            type="file"
            className="hidden"
            accept={ACCEPTED.join(',')}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </motion.div>
      {error && (
        <p className="mt-3 rounded-md border border-alert/40 bg-alert/10 px-4 py-2 font-mono text-sm text-alert">
          {error}
        </p>
      )}
      <p className="mt-4 text-center text-xs text-text-muted">
        Everything runs locally in your browser. Your image is never uploaded anywhere.
      </p>
    </div>
  )
}

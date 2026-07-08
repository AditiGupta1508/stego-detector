import jsPDF from 'jspdf'

export function generateReport({ file, imagePreviewUrl, lsbPlaneUrl, hashes, chi2, entropyResult, trailingData, risk }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const margin = 48
  let y = margin
  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFillColor(11, 15, 20)
  doc.rect(0, 0, pageWidth, 90, 'F')
  doc.setTextColor(0, 229, 160)
  doc.setFont('courier', 'bold')
  doc.setFontSize(20)
  doc.text('StegoScan — Analysis Report', margin, 40)
  doc.setTextColor(140, 160, 179)
  doc.setFont('courier', 'normal')
  doc.setFontSize(10)
  doc.text(`Generated ${new Date().toLocaleString()}`, margin, 60)
  doc.text('University Cybersecurity Project — Image Steganography Detection', margin, 74)

  y = 120
  doc.setTextColor(20, 20, 20)

  const section = (title) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(20, 20, 20)
    doc.text(title, margin, y)
    y += 6
    doc.setDrawColor(220, 220, 220)
    doc.line(margin, y, pageWidth - margin, y)
    y += 18
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
  }

  const line = (label, value) => {
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}:`, margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value), margin + 140, y)
    y += 16
  }

  section('File Information')
  line('File name', file.name)
  line('File type', file.type)
  line('File size', `${(file.size / 1024).toFixed(1)} KB`)
  y += 8

  if (imagePreviewUrl) {
    try {
      doc.addImage(imagePreviewUrl, 'JPEG', margin, y, 160, 120, undefined, 'FAST')
    } catch (e) { /* ignore image embed errors */ }
  }
  if (lsbPlaneUrl) {
    try {
      doc.addImage(lsbPlaneUrl, 'PNG', margin + 190, y, 160, 120, undefined, 'FAST')
      doc.setFontSize(8)
      doc.setTextColor(140, 140, 140)
      doc.text('Original', margin, y + 134)
      doc.text('LSB Bit-Plane', margin + 190, y + 134)
      doc.setTextColor(20, 20, 20)
      doc.setFontSize(10)
    } catch (e) { /* ignore */ }
  }
  y += 150

  section('Hash Verification')
  doc.setFontSize(8)
  line('SHA-1', hashes.sha1)
  line('SHA-256', hashes.sha256)
  doc.setFontSize(10)
  y += 6

  section('Statistical Analysis')
  line('Chi-Square (avg per pair)', chi2.avgChi2)
  line('LSB Anomaly Score', `${chi2.anomalyScore} / 100`)
  line('Shannon Entropy', `${entropyResult.entropy} bits/px (max 8.0)`)
  line('Trailing bytes found', trailingData.trailingBytes)
  line('File structure flag', trailingData.suspicious ? 'SUSPICIOUS' : 'Normal')
  y += 8

  section('Risk Assessment')
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(`${risk.score} / 100`, margin, y + 6)
  doc.setFontSize(13)
  doc.text(risk.verdict, margin + 130, y + 4)
  y += 28
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  risk.contributions.forEach((c) => {
    doc.text(`• ${c.label}: ${c.points.toFixed(1)} / ${c.max} pts`, margin, y)
    y += 14
  })

  y += 12
  section('Recommendations')
  doc.setFontSize(10)
  const recs = risk.score >= 45
    ? [
        'Do not treat this file as trusted until manually reviewed.',
        'Verify the original source and chain of custody of the image.',
        'Re-inspect using a second independent steganalysis tool.',
        'If trailing data was found, extract and inspect it in an isolated environment.',
      ]
    : [
        'No strong indicators of hidden payloads were found.',
        'Routine verification only — no further action required.',
      ]
  recs.forEach((r) => { doc.text(`- ${r}`, margin, y); y += 14 })

  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('Generated client-side by StegoScan. Statistical results are probabilistic indicators, not legal proof.', margin, 800)

  doc.save(`stegoscan-report-${file.name.replace(/\.[^.]+$/, '')}.pdf`)
}

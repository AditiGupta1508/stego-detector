# StegoScan — Image Steganography Detection Tool

A client-side web app that scans images for hidden data using real steganalysis
techniques. Everything runs in the browser — no image is ever uploaded to a server.

Built as a university cybersecurity project.

## What it actually does

Five independent detection modules, combined into one weighted risk score:

1. **LSB Chi-Square Test** — the classic statistical test for least-significant-bit
   steganography (checks whether pixel value pairs have been artificially equalized).
2. **Trailing Data Check** — scans the raw file bytes for data appended after the
   image's real end-of-file marker (a common way files get hidden inside images).
3. **Shannon Entropy** — measures how random the pixel data is.
4. **RGB Histogram Analysis** — visual + statistical distribution of pixel values.
5. **LSB Bit-Plane Visualization** — renders the exact bit layer LSB steganography hides in.

Plus SHA-1/SHA-256 hash generation, and a downloadable PDF report.

**Nothing here is faked or simulated** — every number shown is computed live from the
actual pixel data of the image you upload, using documented, real algorithms. There's
no trained CNN/ML model (that would need a Python backend and a labeled training
dataset, which is out of scope for a browser-only tool) — see the "About" page in the
app itself for an honest explanation of what each test can and can't prove.

```

## Tech used

React + Vite, Tailwind CSS, Framer Motion (animations), Recharts (charts),
React Icons, jsPDF (report generation), and the browser's native Web Crypto API
for hashing. No backend, no external API calls, no image ever leaves the browser.


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

---

## Running it on your own computer

You need [Node.js](https://nodejs.org) installed (version 18 or later). Then:

```bash
# 1. Install dependencies (only needed once)
npm install

# 2. Start the local dev server
npm run dev
```

It'll print a local address like `http://localhost:5173` — open that in your browser.

To build the production version (what actually gets deployed):

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

---

## Putting it on GitHub

1. Go to [github.com/new](https://github.com/new) and create a new repository
   (e.g. `stego-detector`). Don't add a README/gitignore there — you already have one.
2. In this project folder, run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/stego-detector.git
git push -u origin main
```

(Replace `YOUR_USERNAME` with your actual GitHub username.)

---

## Deploying to Vercel

**Easiest way (no command line):**

1. Push the project to GitHub (steps above).
2. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
3. Click **Add New → Project**, then select your `stego-detector` repo.
4. Vercel auto-detects it's a Vite project — leave all settings as default.
5. Click **Deploy**. In about a minute you'll get a live URL like
   `stego-detector-yourname.vercel.app`.

Any time you push new commits to GitHub, Vercel automatically redeploys.

---

## Project structure

```
src/
  components/     Reusable UI pieces (upload zone, gauge, charts, hash cards...)
  pages/          Home, Scanner, About
  utils/
    steganalysis.js   The actual detection algorithms
    hashing.js         SHA-1 / SHA-256 generation
    pdfReport.js        PDF report builder
  App.jsx           Routes
  main.jsx          Entry point
  index.css         Design tokens / theme
```

## Tech used

React + Vite, Tailwind CSS, Framer Motion (animations), Recharts (charts),
React Icons, jsPDF (report generation), and the browser's native Web Crypto API
for hashing. No backend, no external API calls, no image ever leaves the browser.

## For your presentation

The **About** page in the app explains each detection technique in plain language —
useful to walk through live or screenshot for your slides. The PDF report (downloadable
after any scan) is also good evidence of a completed analysis to include in your report.

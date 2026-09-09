// One-off icon generator for the PWA manifest — run with `node scripts/make-icons.mjs`.
// Renders the app's barbell mark to PNG at the sizes the manifest needs.
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const BG = '#11141b'
const ACCENT = '#d9a656'

mkdirSync('public/icons', { recursive: true })

// `pad` = fraction of the canvas kept empty on each side (maskable icons need a safe
// zone since the OS may crop to a circle/squircle).
function barbellSvg(size, pad = 0.12) {
  const inner = size * (1 - pad * 2)
  const s = inner / 28 // original mark was authored on a 28x28 grid
  const off = size * pad
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${BG}"/>
  <g transform="translate(${off},${off}) scale(${s})">
    <rect x="2" y="12" width="24" height="4" rx="1.5" fill="none" stroke="${ACCENT}" stroke-width="2"/>
    <rect x="5" y="7" width="4" height="14" rx="1" fill="${ACCENT}"/>
    <rect x="19" y="7" width="4" height="14" rx="1" fill="${ACCENT}"/>
    <rect x="1" y="9" width="2.5" height="10" rx="1" fill="${ACCENT}"/>
    <rect x="24.5" y="9" width="2.5" height="10" rx="1" fill="${ACCENT}"/>
  </g>
</svg>`
}

const targets = [
  { file: 'public/icons/icon-192.png', size: 192, pad: 0.12 },
  { file: 'public/icons/icon-512.png', size: 512, pad: 0.12 },
  { file: 'public/icons/maskable-192.png', size: 192, pad: 0.22 },
  { file: 'public/icons/maskable-512.png', size: 512, pad: 0.22 },
  { file: 'public/icons/apple-touch-icon.png', size: 180, pad: 0.14 },
]

for (const t of targets) {
  await sharp(Buffer.from(barbellSvg(t.size, t.pad))).png().toFile(t.file)
  console.log('wrote', t.file)
}

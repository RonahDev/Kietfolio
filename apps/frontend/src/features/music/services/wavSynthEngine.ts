/**
 * Pure TypeScript Concert Hall WAV Audio Synthesizer & Editorial SVG Artwork Generator.
 * Synthesizes real PCM WAV Blobs on-demand so curated concert performances play natively
 * through HTMLAudioElement with full seeking, volume control, and offline reliability.
 */

interface SynthVoice {
  freqs: number[]
  tempoBpm: number
  pattern: number[]
  bassPattern: number[]
  warmth: number
}

const SYNTH_RECIPES: Record<string, SynthVoice> = {
  'nocturne-eb': {
    // E-flat major / C minor romantic nocturnal voicing (Hz)
    freqs: [155.56, 196.0, 233.08, 311.13, 392.0, 466.16, 587.33, 622.25],
    tempoBpm: 66,
    pattern: [2, 4, 5, 7, 6, 5, 4, 2, 3, 5, 6, 7, 5, 4, 3, 2],
    bassPattern: [0, 0, 1, 1, 2, 2, 0, 0],
    warmth: 0.72,
  },
  'moonlight-adagio': {
    freqs: [138.59, 164.81, 207.65, 277.18, 329.63, 415.3, 493.88, 554.37],
    tempoBpm: 58,
    pattern: [0, 3, 4, 5, 3, 4, 5, 3, 1, 3, 4, 6, 4, 5, 3, 2],
    bassPattern: [0, 0, 2, 2, 1, 1, 0, 0],
    warmth: 0.8,
  },
  'velvet-waltz': {
    freqs: [123.47, 146.83, 185.0, 246.94, 293.66, 369.99, 440.0, 493.88],
    tempoBpm: 88,
    pattern: [3, 5, 7, 6, 5, 4, 3, 4, 5, 6, 7, 5, 4, 5, 3, 2],
    bassPattern: [0, 2, 1, 0, 2, 1, 0, 1],
    warmth: 0.65,
  },
  'amber-prelude': {
    freqs: [130.81, 164.81, 196.0, 261.63, 329.63, 392.0, 493.88, 523.25],
    tempoBpm: 72,
    pattern: [0, 2, 4, 6, 7, 6, 4, 2, 1, 3, 4, 5, 6, 5, 4, 3],
    bassPattern: [0, 0, 2, 2, 1, 1, 2, 0],
    warmth: 0.75,
  },
  'grand-overture': {
    freqs: [146.83, 185.0, 220.0, 293.66, 369.99, 440.0, 554.37, 587.33],
    tempoBpm: 94,
    pattern: [0, 3, 4, 5, 7, 5, 4, 3, 2, 4, 6, 7, 5, 6, 4, 3],
    bassPattern: [0, 2, 1, 2, 0, 1, 2, 0],
    warmth: 0.62,
  },
  'cello-reverie': {
    freqs: [98.0, 123.47, 146.83, 196.0, 246.94, 293.66, 369.99, 392.0],
    tempoBpm: 62,
    pattern: [0, 1, 2, 3, 4, 3, 2, 1, 2, 3, 4, 5, 4, 3, 2, 0],
    bassPattern: [0, 0, 1, 1, 2, 2, 0, 0],
    warmth: 0.85,
  },
  'vpop-pop': {
    // Upbeat modern V-Pop pentatonic/pop progression (C, D, E, G, A, C)
    freqs: [130.81, 146.83, 164.81, 196.0, 220.0, 261.63, 293.66, 329.63],
    tempoBpm: 110,
    pattern: [0, 2, 4, 5, 4, 2, 0, 3, 5, 7, 5, 3, 2, 4, 3, 1],
    bassPattern: [0, 0, 3, 3, 4, 4, 1, 1],
    warmth: 0.68,
  },
  'vpop-ballad': {
    // Emotional piano ballad (Am - F - C - G)
    freqs: [110.0, 130.81, 164.81, 196.0, 220.0, 261.63, 329.63, 392.0],
    tempoBpm: 68,
    pattern: [4, 5, 7, 6, 5, 4, 2, 3, 4, 5, 6, 4, 3, 2, 1, 0],
    bassPattern: [0, 0, 1, 1, 2, 2, 3, 3],
    warmth: 0.82,
  },
  'vpop-acoustic': {
    // Warm fingerstyle acoustic guitar (G - Em - C - D)
    freqs: [98.0, 123.47, 146.83, 196.0, 246.94, 293.66, 392.0, 440.0],
    tempoBpm: 76,
    pattern: [0, 2, 3, 5, 3, 2, 0, 1, 3, 4, 6, 4, 3, 1, 2, 0],
    bassPattern: [0, 0, 2, 2, 1, 1, 3, 3],
    warmth: 0.86,
  },
  'vpop-upbeat': {
    // High-energy dance electro / deep house (Tăng Duy Tân style, Am - Em - F - G)
    freqs: [110.0, 130.81, 164.81, 196.0, 220.0, 261.63, 329.63, 440.0],
    tempoBpm: 124,
    pattern: [0, 4, 2, 4, 1, 4, 2, 5, 0, 4, 3, 5, 2, 6, 4, 7],
    bassPattern: [0, 0, 2, 2, 3, 3, 1, 1],
    warmth: 0.6,
  },
  'vpop-rnb': {
    // 80s synthwave & chill R&B (MONO / Wren Evans style, Dm7 - G7 - Cmaj7 - Am7)
    freqs: [146.83, 174.61, 220.0, 261.63, 329.63, 392.0, 440.0, 523.25],
    tempoBpm: 86,
    pattern: [2, 4, 6, 5, 3, 5, 7, 4, 1, 3, 5, 4, 2, 4, 6, 3],
    bassPattern: [0, 0, 2, 2, 1, 1, 3, 3],
    warmth: 0.74,
  },
  'vpop-folk': {
    // Traditional Vietnamese pentatonic folk melody (Ngũ Cung: C - D - F - G - A)
    freqs: [130.81, 146.83, 174.61, 196.0, 220.0, 261.63, 293.66, 349.23],
    tempoBpm: 70,
    pattern: [0, 1, 3, 4, 5, 4, 3, 1, 0, 3, 4, 6, 5, 3, 1, 0],
    bassPattern: [0, 0, 1, 1, 2, 2, 0, 0],
    warmth: 0.9,
  },
}

const cachedSynthUrls = new Map<string, string>()

function writeWavString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

/**
 * Generates a realistic warm polyphonic PCM WAV Blob URL for curated classical works.
 */
export function getOrCreateSynthWavUrl(presetId: string, durationSec = 16): string {
  const cacheKey = `${presetId}_${durationSec}`
  const existing = cachedSynthUrls.get(cacheKey)
  if (existing) return existing

  const recipe = SYNTH_RECIPES[presetId] ?? SYNTH_RECIPES['nocturne-eb']
  const sampleRate = 22050
  const totalSamples = Math.floor(sampleRate * durationSec)
  const buffer = new ArrayBuffer(44 + totalSamples * 2)
  const view = new DataView(buffer)

  // RIFF WAVE Header (16-bit PCM mono)
  writeWavString(view, 0, 'RIFF')
  view.setUint32(4, 36 + totalSamples * 2, true)
  writeWavString(view, 8, 'WAVE')
  writeWavString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // Mono
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeWavString(view, 36, 'data')
  view.setUint32(40, totalSamples * 2, true)

  const beatDuration = 60 / recipe.tempoBpm
  const bassDuration = beatDuration * 2

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate
    const stepIndex = Math.floor(t / beatDuration) % recipe.pattern.length
    const stepT = t % beatDuration
    const noteFreq = recipe.freqs[recipe.pattern[stepIndex]]

    const bassIndex = Math.floor(t / bassDuration) % recipe.bassPattern.length
    const bassT = t % bassDuration
    const bassFreq = recipe.freqs[recipe.bassPattern[bassIndex]] * 0.5

    // Smooth piano/chamber envelope with exponential sustain decay + soft attack
    const env = Math.min(1, stepT / 0.025) * Math.exp(-stepT * (2.1 - recipe.warmth * 0.9))
    const bassEnv = Math.min(1, bassT / 0.06) * Math.exp(-bassT * 0.85)

    // Fade in and out over edges to avoid clicks on loop/seek
    const globalFade =
      Math.min(1, t / 0.15) * Math.min(1, (durationSec - t) / 0.35)

    const melodySample =
      Math.sin(2 * Math.PI * noteFreq * t) * 0.45 +
      Math.sin(2 * Math.PI * noteFreq * 2 * t) * 0.14 * recipe.warmth +
      Math.sin(2 * Math.PI * noteFreq * 3 * t) * 0.04

    const harmonyFreq = noteFreq * 1.25
    const harmonySample = Math.sin(2 * Math.PI * harmonyFreq * t) * 0.12

    const bassSample =
      Math.sin(2 * Math.PI * bassFreq * t) * 0.32 +
      Math.sin(2 * Math.PI * bassFreq * 2 * t) * 0.1

    const combined =
      (melodySample * env + harmonySample * env + bassSample * bassEnv) * globalFade * 0.58

    const clamped = Math.max(-0.98, Math.min(0.98, combined))
    view.setInt16(44 + i * 2, Math.floor(clamped * 32767), true)
  }

  const blob = new Blob([buffer], { type: 'audio/wav' })
  if (typeof URL.createObjectURL === 'function') {
    const objectUrl = URL.createObjectURL(blob)
    cachedSynthUrls.set(cacheKey, objectUrl)
    return objectUrl
  }
  return ''
}

export function revokeAllSynthUrls(): void {
  if (typeof URL.revokeObjectURL === 'function') {
    for (const url of cachedSynthUrls.values()) {
      URL.revokeObjectURL(url)
    }
  }
  cachedSynthUrls.clear()
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Generates deterministic high-contrast concert-hall artwork SVGs in burgundy, deep charcoal, and champagne gold.
 */
export function generateTheaterCoverDataUri(
  title: string,
  subtitle: string,
  tone: 'gold' | 'burgundy' | 'amber' = 'gold'
): string {
  const palette =
    tone === 'burgundy'
      ? { bg1: '#181716', bg2: '#321B22', accent: '#C6A878', ring: '#542C35' }
      : tone === 'amber'
        ? { bg1: '#101010', bg2: '#22201E', accent: '#D6AD73', ring: '#542C35' }
        : { bg1: '#101010', bg2: '#26181C', accent: '#C6A878', ring: '#321B22' }

  const shortTitle = escapeXml(title.slice(0, 26))
  const shortSub = escapeXml(subtitle.slice(0, 28))

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <radialGradient id="stageGlow" cx="50%" cy="38%" r="65%">
        <stop offset="0%" stop-color="${palette.ring}" stop-opacity="0.88"/>
        <stop offset="65%" stop-color="${palette.bg2}" stop-opacity="0.96"/>
        <stop offset="100%" stop-color="${palette.bg1}" stop-opacity="1"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#stageGlow)"/>
    <circle cx="200" cy="168" r="106" fill="none" stroke="${palette.accent}" stroke-opacity="0.28" stroke-width="1.5"/>
    <circle cx="200" cy="168" r="76" fill="none" stroke="${palette.accent}" stroke-opacity="0.48" stroke-width="1"/>
    <path d="M120 274 Q200 236 280 274" fill="none" stroke="${palette.accent}" stroke-opacity="0.55" stroke-width="1.5"/>
    <circle cx="200" cy="168" r="24" fill="${palette.accent}" fill-opacity="0.14" stroke="${palette.accent}" stroke-width="1.5"/>
    <rect x="24" y="24" width="352" height="352" fill="none" stroke="${palette.accent}" stroke-opacity="0.22" stroke-width="1"/>
    <text x="200" y="318" text-anchor="middle" fill="#F1EDE6" font-family="Georgia, serif" font-size="21" font-weight="600">${shortTitle}</text>
    <text x="200" y="346" text-anchor="middle" fill="${palette.accent}" font-family="Georgia, serif" font-size="13" letter-spacing="2">${shortSub}</text>
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

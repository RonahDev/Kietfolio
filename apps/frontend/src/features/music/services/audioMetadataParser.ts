import {
  SUPPORTED_AUDIO_EXTENSIONS,
  type MusicTrack,
  type SupportedAudioFormat,
} from '../types/music'
import { generateTheaterCoverDataUri } from './wavSynthEngine'

const SUPPORTED_SET = new Set<string>(SUPPORTED_AUDIO_EXTENSIONS)

export interface ParsedAudioResult {
  track: MusicTrack
  blob: Blob
}

export function extractFileExtension(fileName: string): string {
  const idx = fileName.lastIndexOf('.')
  if (idx === -1 || idx === fileName.length - 1) return ''
  return fileName.slice(idx + 1).toLowerCase()
}

export function isSupportedAudioExtension(ext: string): ext is SupportedAudioFormat {
  return SUPPORTED_SET.has(ext.toLowerCase())
}

function readAscii(bytes: Uint8Array, start: number, length: number): string {
  let out = ''
  const end = Math.min(bytes.length, start + length)
  for (let i = start; i < end; i++) {
    out += String.fromCharCode(bytes[i])
  }
  return out
}

function hasKnownNonAudioSignature(bytes: Uint8Array): boolean {
  if (bytes.length < 4) return false
  const head4 = readAscii(bytes, 0, 4)
  if (head4 === '%PDF' || head4 === '\x89PNG' || head4 === 'GIF8' || head4 === 'PK\x03\x04') {
    return true
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return true // JPEG
  }
  const trimmed = readAscii(bytes, 0, Math.min(bytes.length, 64)).trimStart().toLowerCase()
  if (
    trimmed.startsWith('<!doctype') ||
    trimmed.startsWith('<html') ||
    trimmed.startsWith('<?xml') ||
    trimmed.startsWith('{') ||
    trimmed.startsWith('not real audio')
  ) {
    return true
  }
  return false
}

/**
 * Validates audio format extension and binary signature so corrupt or spoofed files are rejected gracefully.
 */
export function validateAudioHeader(bytes: Uint8Array, ext: SupportedAudioFormat): boolean {
  if (bytes.length < 12) return false
  if (hasKnownNonAudioSignature(bytes)) return false

  switch (ext) {
    case 'wav': {
      const riff = readAscii(bytes, 0, 4)
      const wave = readAscii(bytes, 8, 4)
      return riff === 'RIFF' && wave === 'WAVE'
    }
    case 'flac':
      return readAscii(bytes, 0, 4) === 'fLaC'
    case 'ogg':
      return readAscii(bytes, 0, 4) === 'OggS'
    case 'm4a':
      return readAscii(bytes, 4, 4) === 'ftyp'
    case 'mp3': {
      if (readAscii(bytes, 0, 3) === 'ID3') return true
      // Scan first 512 bytes for MPEG frame sync (11 set bits: 0xFF 0xE0+)
      const limit = Math.min(bytes.length - 1, 512)
      for (let i = 0; i < limit; i++) {
        if (bytes[i] === 0xff && (bytes[i + 1] & 0xe0) === 0xe0 && bytes[i + 1] !== 0xff) {
          return true
        }
      }
      return false
    }
    case 'aac': {
      if (readAscii(bytes, 0, 4) === 'ADIF' || readAscii(bytes, 4, 4) === 'ftyp') return true
      const limit = Math.min(bytes.length - 1, 256)
      for (let i = 0; i < limit; i++) {
        if (bytes[i] === 0xff && (bytes[i + 1] & 0xf0) === 0xf0) return true
      }
      return false
    }
    default:
      return false
  }
}

function decodeId3Text(frameBytes: Uint8Array): string {
  if (frameBytes.length <= 1) return ''
  const encoding = frameBytes[0]
  const payload = frameBytes.subarray(1)
  try {
    if (encoding === 1 || encoding === 2) {
      const decoder = new TextDecoder(encoding === 1 ? 'utf-16le' : 'utf-16be')
      const startOffset =
        payload.length >= 2 &&
        ((payload[0] === 0xff && payload[1] === 0xfe) ||
          (payload[0] === 0xfe && payload[1] === 0xff))
          ? 2
          : 0
      return decoder.decode(payload.subarray(startOffset)).replace(/\0+$/g, '').trim()
    }
    return new TextDecoder(encoding === 3 ? 'utf-8' : 'iso-8859-1')
      .decode(payload)
      .replace(/\0+$/g, '')
      .trim()
  } catch {
    return ''
  }
}

export interface Id3Tags {
  title?: string
  artist?: string
  album?: string
  genre?: string
}

/**
 * Lightweight pure-TS ID3v2.3 / ID3v2.4 parser reading common text frames without loading whole blobs.
 */
export function parseId3v2Tags(bytes: Uint8Array): Id3Tags {
  const tags: Id3Tags = {}
  if (bytes.length < 10 || readAscii(bytes, 0, 3) !== 'ID3') {
    return tags
  }
  const majorVersion = bytes[3]
  if (majorVersion < 3 || majorVersion > 4) return tags

  const tagSize =
    ((bytes[6] & 0x7f) << 21) |
    ((bytes[7] & 0x7f) << 14) |
    ((bytes[8] & 0x7f) << 7) |
    (bytes[9] & 0x7f)

  const maxOffset = Math.min(bytes.length, 10 + tagSize)
  let offset = 10

  while (offset + 10 <= maxOffset) {
    const frameId = readAscii(bytes, offset, 4)
    if (!/^[A-Z0-9]{4}$/.test(frameId)) break

    const frameSize =
      majorVersion === 4
        ? ((bytes[offset + 4] & 0x7f) << 21) |
          ((bytes[offset + 5] & 0x7f) << 14) |
          ((bytes[offset + 6] & 0x7f) << 7) |
          (bytes[offset + 7] & 0x7f)
        : ((bytes[offset + 4] << 24) >>> 0) +
          (bytes[offset + 5] << 16) +
          (bytes[offset + 6] << 8) +
          bytes[offset + 7]

    if (frameSize <= 0 || offset + 10 + frameSize > maxOffset) break

    const payload = bytes.subarray(offset + 10, offset + 10 + frameSize)
    if (frameId === 'TIT2') tags.title = decodeId3Text(payload) || tags.title
    else if (frameId === 'TPE1') tags.artist = decodeId3Text(payload) || tags.artist
    else if (frameId === 'TALB') tags.album = decodeId3Text(payload) || tags.album
    else if (frameId === 'TCON') tags.genre = decodeId3Text(payload) || tags.genre

    offset += 10 + frameSize
  }

  return tags
}

export function parseWavDurationSeconds(bytes: Uint8Array): number {
  if (bytes.length < 44 || readAscii(bytes, 0, 4) !== 'RIFF' || readAscii(bytes, 8, 4) !== 'WAVE') {
    return 0
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let offset = 12
  let byteRate = 0
  let dataSize = 0

  while (offset + 8 <= bytes.length) {
    const chunkId = readAscii(bytes, offset, 4)
    const chunkSize = view.getUint32(offset + 4, true)
    if (chunkId === 'fmt ' && offset + 24 <= bytes.length) {
      byteRate = view.getUint32(offset + 16, true)
    } else if (chunkId === 'data') {
      dataSize = chunkSize
      break
    }
    offset += 8 + chunkSize + (chunkSize % 2)
  }

  if (byteRate > 0 && dataSize > 0) {
    return Math.round((dataSize / byteRate) * 10) / 10
  }
  return 0
}

export function parseFilenameMetadata(fileName: string): { title: string; artist: string } {
  const withoutExt = fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ').trim()
  const withoutTrackPrefix = withoutExt.replace(/^\d+\s*[.-]\s*/, '').trim()
  const parts = withoutTrackPrefix.split(/\s+-\s+/)
  if (parts.length >= 2) {
    const artistCandidate = parts[0].trim()
    const titleCandidate = parts.slice(1).join(' - ').trim()
    if (artistCandidate && titleCandidate) {
      return { artist: artistCandidate, title: titleCandidate }
    }
  }
  return {
    title: withoutTrackPrefix || withoutExt || 'Untitled Performance',
    artist: 'Personal Recording',
  }
}

async function probeAudioElementDuration(file: File): Promise<number> {
  if (typeof Audio === 'undefined' || typeof URL.createObjectURL !== 'function') {
    return 0
  }

  const objectUrl = URL.createObjectURL(file)
  return new Promise<number>((resolve) => {
    const audio = new Audio()
    audio.preload = 'metadata'
    let settled = false

    const finish = (duration: number) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('error', onError)
      audio.src = ''
      URL.revokeObjectURL(objectUrl)
      resolve(Number.isFinite(duration) && duration > 0 ? Math.round(duration * 10) / 10 : 0)
    }

    const onLoaded = () => finish(audio.duration)
    const onError = () => finish(0)

    const timer = setTimeout(() => finish(0), 1200)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('error', onError)
    audio.src = objectUrl
  })
}

export async function parseImportedAudioFile(file: File): Promise<ParsedAudioResult> {
  const ext = extractFileExtension(file.name)
  if (!isSupportedAudioExtension(ext)) {
    throw new Error(
      `Unsupported format "${ext ? `.${ext}` : 'unknown'}". Supported formats: ${SUPPORTED_AUDIO_EXTENSIONS.map((e) => `.${e}`).join(', ')}.`
    )
  }

  if (file.size === 0) {
    throw new Error(`"${file.name}" is empty (0 bytes) and cannot be imported.`)
  }

  // Only slice the header/metadata prefix instead of reading entire 50MB+ FLAC files into JS arrays.
  const headerSlice = file.slice(0, Math.min(file.size, 65536))
  const headerBuffer = await headerSlice.arrayBuffer()
  const headerBytes = new Uint8Array(headerBuffer)

  if (!validateAudioHeader(headerBytes, ext)) {
    throw new Error(`"${file.name}" appears corrupted or is not a valid .${ext} audio stream.`)
  }

  const id3Tags = ext === 'mp3' ? parseId3v2Tags(headerBytes) : {}
  const fallbackName = parseFilenameMetadata(file.name)

  let duration = 0
  if (ext === 'wav') {
    duration = parseWavDurationSeconds(headerBytes)
  }
  if (duration === 0) {
    duration = await probeAudioElementDuration(file)
  }

  const title = id3Tags.title || fallbackName.title
  const artist = id3Tags.artist || fallbackName.artist
  const album = id3Tags.album || 'Imported Collection'
  const genre = id3Tags.genre || 'Personal Archive'

  const trackId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  const artworkUrl = generateTheaterCoverDataUri(title, artist, 'burgundy')

  const track: MusicTrack = {
    id: trackId,
    title,
    artist,
    album,
    genre,
    duration,
    format: ext,
    sourceType: 'local',
    artworkUrl,
    fileSize: file.size,
    fileName: file.name,
    addedAt: Date.now(),
    playCount: 0,
  }

  return {
    track,
    blob: file,
  }
}

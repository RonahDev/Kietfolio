import { beforeEach, describe, expect, it } from 'vitest'
import {
  parseFilenameMetadata,
  parseId3v2Tags,
  parseImportedAudioFile,
  parseWavDurationSeconds,
  validateAudioHeader,
} from '../services/audioMetadataParser'
import { musicIndexedDb, resetMusicDbConnectionForTests } from '../services/musicIndexedDb'
import type { MusicPlaylist } from '../types/music'

function makeValidWavFile(fileName: string, durationSec = 2): File {
  const sampleRate = 8000
  const samples = sampleRate * durationSec
  const buf = new ArrayBuffer(44 + samples * 2)
  const view = new DataView(buf)
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i))
  }
  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + samples * 2, true)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeStr(36, 'data')
  view.setUint32(40, samples * 2, true)
  return new File([buf], fileName, { type: 'audio/wav' })
}

function makeId3Mp3Bytes(title: string, artist: string, album: string): Uint8Array {
  const enc = new TextEncoder()
  const buildTextFrame = (id: string, text: string): Uint8Array => {
    const strBytes = enc.encode(text)
    const size = 1 + strBytes.length
    const frame = new Uint8Array(10 + size)
    for (let i = 0; i < 4; i++) frame[i] = id.charCodeAt(i)
    frame[4] = (size >>> 24) & 0xff
    frame[5] = (size >>> 16) & 0xff
    frame[6] = (size >>> 8) & 0xff
    frame[7] = size & 0xff
    frame[10] = 3 // UTF-8
    frame.set(strBytes, 11)
    return frame
  }

  const fTitle = buildTextFrame('TIT2', title)
  const fArtist = buildTextFrame('TPE1', artist)
  const fAlbum = buildTextFrame('TALB', album)
  const payloadSize = fTitle.length + fArtist.length + fAlbum.length

  const out = new Uint8Array(10 + payloadSize + 16)
  out[0] = 0x49 // I
  out[1] = 0x44 // D
  out[2] = 0x33 // 3
  out[3] = 3 // v2.3
  out[6] = (payloadSize >>> 21) & 0x7f
  out[7] = (payloadSize >>> 14) & 0x7f
  out[8] = (payloadSize >>> 7) & 0x7f
  out[9] = payloadSize & 0x7f
  out.set(fTitle, 10)
  out.set(fArtist, 10 + fTitle.length)
  out.set(fAlbum, 10 + fTitle.length + fArtist.length)
  return out
}

describe('Audio Metadata Parser & Format Validation', () => {
  it('validates supported audio headers (.wav, .flac, .ogg, .m4a, .mp3, .aac) and rejects spoofed/corrupted headers', () => {
    expect(validateAudioHeader(new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x41, 0x56, 0x45]), 'wav')).toBe(true)
    expect(validateAudioHeader(new Uint8Array([0x66, 0x4c, 0x61, 0x43, 0, 0, 0, 0, 0, 0, 0, 0]), 'flac')).toBe(true)
    expect(validateAudioHeader(new Uint8Array([0x4f, 0x67, 0x67, 0x53, 0, 0, 0, 0, 0, 0, 0, 0]), 'ogg')).toBe(true)
    expect(validateAudioHeader(new Uint8Array([0, 0, 0, 24, 0x66, 0x74, 0x79, 0x70, 0x4d, 0x34, 0x41, 0x20]), 'm4a')).toBe(true)
    expect(validateAudioHeader(new Uint8Array([0xff, 0xfb, 0x90, 0x64, 0, 0, 0, 0, 0, 0, 0, 0]), 'mp3')).toBe(true)
    expect(validateAudioHeader(new Uint8Array([0xff, 0xf1, 0x50, 0x80, 0, 0, 0, 0, 0, 0, 0, 0]), 'aac')).toBe(true)

    const htmlSpoof = new TextEncoder().encode('<!DOCTYPE html><html>fake mp3</html>')
    expect(validateAudioHeader(htmlSpoof, 'mp3')).toBe(false)
    expect(validateAudioHeader(new Uint8Array([0x25, 0x50, 0x44, 0x46, 1, 2, 3, 4, 5, 6, 7, 8]), 'wav')).toBe(false)
  })

  it('extracts ID3v2 tags accurately from MP3 byte header', async () => {
    const mp3Bytes = makeId3Mp3Bytes('Clair de Lune', 'Claude Debussy', 'Suite Bergamasque')
    const file = new File([mp3Bytes.buffer as ArrayBuffer], '01_debussy.mp3', {
      type: 'audio/mpeg',
    })

    const tags = parseId3v2Tags(mp3Bytes)
    expect(tags.title).toBe('Clair de Lune')
    expect(tags.artist).toBe('Claude Debussy')
    expect(tags.album).toBe('Suite Bergamasque')

    const parsed = await parseImportedAudioFile(file)
    expect(parsed.track.title).toBe('Clair de Lune')
    expect(parsed.track.artist).toBe('Claude Debussy')
    expect(parsed.track.album).toBe('Suite Bergamasque')
    expect(parsed.track.format).toBe('mp3')
    expect(parsed.track.sourceType).toBe('local')
  })

  it('falls back cleanly to filename metadata and computes WAV duration', async () => {
    const wavFile = makeValidWavFile('02 - Frederic Chopin - Raindrop Prelude.wav', 3)
    const parsed = await parseImportedAudioFile(wavFile)
    expect(parsed.track.artist).toBe('Frederic Chopin')
    expect(parsed.track.title).toBe('Raindrop Prelude')
    expect(parsed.track.duration).toBe(3)

    const fallbackOnly = parseFilenameMetadata('symphony_no_5.flac')
    expect(fallbackOnly.title).toBe('symphony no 5')
    expect(parseWavDurationSeconds(new Uint8Array(10))).toBe(0)
  })

  it('rejects unsupported file extensions, empty files, and corrupted audio streams cleanly', async () => {
    const txtFile = new File(['hello world'], 'notes.txt', { type: 'text/plain' })
    await expect(parseImportedAudioFile(txtFile)).rejects.toThrow(/Unsupported format/)

    const emptyMp3 = new File([], 'empty.mp3', { type: 'audio/mpeg' })
    await expect(parseImportedAudioFile(emptyMp3)).rejects.toThrow(/empty/)

    const corruptedWav = new File(['not real audio bytes here'], 'broken.wav', { type: 'audio/wav' })
    await expect(parseImportedAudioFile(corruptedWav)).rejects.toThrow(/corrupted/)
  })
})

describe('Music IndexedDB Persistence & Store Isolation', () => {
  beforeEach(async () => {
    resetMusicDbConnectionForTests()
    await musicIndexedDb.clearAllLocalMusicData()
  })

  it('persists imported track metadata separately from binary Blobs and restores playlists, favorites, and history', async () => {
    const wavFile = makeValidWavFile('Johann Bach - Aria.wav', 2)
    const parsed = await parseImportedAudioFile(wavFile)

    await musicIndexedDb.saveImportedTrack(parsed.track, parsed.blob)

    const loadedTracks = await musicIndexedDb.getAllImportedTracks()
    expect(loadedTracks).toHaveLength(1)
    expect(loadedTracks[0].id).toBe(parsed.track.id)
    expect((loadedTracks[0] as unknown as { blob?: Blob }).blob).toBeUndefined()

    const loadedBlob = await musicIndexedDb.getAudioBlob(parsed.track.id)
    expect(loadedBlob).not.toBeNull()
    expect(loadedBlob?.size).toBe(wavFile.size)

    const playlist: MusicPlaylist = {
      id: 'pl_baroque',
      name: 'Baroque Study',
      description: 'Evening harpsichord and strings',
      coverUrl: 'data:image/svg+xml;utf8,<svg></svg>',
      trackIds: [parsed.track.id],
      createdAt: 1000,
      updatedAt: 1000,
    }
    await musicIndexedDb.putPlaylist(playlist)
    await musicIndexedDb.saveFavorites([parsed.track.id])
    await musicIndexedDb.upsertHistoryEntry({ trackId: parsed.track.id, playedAt: 5000 })

    expect(await musicIndexedDb.getAllPlaylists()).toHaveLength(1)
    expect(await musicIndexedDb.getFavorites()).toEqual([parsed.track.id])
    expect(await musicIndexedDb.getHistory()).toEqual([{ trackId: parsed.track.id, playedAt: 5000 }])

    await musicIndexedDb.deleteImportedTrack(parsed.track.id)
    expect(await musicIndexedDb.getAllImportedTracks()).toHaveLength(0)
    expect(await musicIndexedDb.getAudioBlob(parsed.track.id)).toBeNull()
  })
})

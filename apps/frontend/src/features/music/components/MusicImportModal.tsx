import React, { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, FileAudio, FolderOpen, Loader2, Upload, X } from 'lucide-react'
import { formatFileSize, useMusicTheater } from '../hooks/useMusicTheater'
import { SUPPORTED_AUDIO_EXTENSIONS } from '../types/music'

interface MusicImportDropzoneProps {
  defaultPlaylistId?: string
  onImportFinished?: () => void
}

export const MusicImportDropzone: React.FC<MusicImportDropzoneProps> = ({
  defaultPlaylistId = '',
  onImportFinished,
}) => {
  const { playlists, importFiles, importItems, isImporting, clearImportItems } = useMusicTheater()
  const [targetPlaylistId, setTargetPlaylistId] = useState(defaultPlaylistId)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const handleSelectedFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    await importFiles(fileList, targetPlaylistId || undefined)
    onImportFinished?.()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#C6A878]">
            Local Lossless & Audio Vault
          </p>
          <p className="text-xs text-[#A49C92] mt-0.5">
            Supported: {SUPPORTED_AUDIO_EXTENSIONS.map((ext) => `.${ext}`).join(', ')} • Stored 100% locally in your browser IndexedDB.
          </p>
        </div>

        <label className="flex items-center gap-2 text-xs text-[#A49C92]">
          <span>Add to Playlist:</span>
          <select
            value={targetPlaylistId}
            onChange={(e) => setTargetPlaylistId(e.target.value)}
            aria-label="Target playlist for imported songs"
            className="px-3 py-1.5 rounded-lg bg-[#22201E] border border-[#C6A878]/25 text-xs text-[#F1EDE6]"
          >
            <option value="">Library Only</option>
            {playlists.map((pl) => (
              <option key={pl.id} value={pl.id}>
                {pl.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Drag and Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragOver(false)
          void handleSelectedFiles(e.dataTransfer.files)
        }}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragOver
            ? 'border-[#C6A878] bg-[#321B22]/60'
            : 'border-[#C6A878]/30 bg-[#181716] hover:border-[#C6A878]/55'
        }`}
      >
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#321B22] border border-[#C6A878]/35 flex items-center justify-center">
          <Upload className="w-5 h-5 text-[#C6A878]" />
        </div>
        <h4
          className="text-xl font-semibold text-[#F1EDE6] mb-1"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Drop Audio Files Here
        </h4>
        <p className="text-xs text-[#A49C92] mb-5">
          Drag one or multiple audio tracks directly from your computer, or browse files and folders.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={isImporting}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            <FileAudio className="w-4 h-4" />
            <span>Select Audio Files</span>
          </button>

          <button
            type="button"
            disabled={isImporting}
            onClick={() => folderInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#C6A878]/30 bg-[#22201E] hover:bg-[#321B22] text-[#F1EDE6] text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <FolderOpen className="w-4 h-4 text-[#C6A878]" />
            <span>Import Folder</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".mp3,.wav,.flac,.m4a,.ogg,.aac,audio/*"
          data-testid="audio-file-input"
          className="hidden"
          onChange={(e) => {
            void handleSelectedFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <input
          ref={folderInputRef}
          type="file"
          multiple
          // @ts-expect-error webkitdirectory is supported by Chromium/Edge/Firefox for local folder import
          webkitdirectory=""
          data-testid="audio-folder-input"
          className="hidden"
          onChange={(e) => {
            void handleSelectedFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {/* Progress & Validation Feedback */}
      {importItems.length > 0 && (
        <div className="rounded-2xl border border-[#C6A878]/20 bg-[#22201E]/75 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#C6A878] uppercase tracking-wider">
              Import Progress ({importItems.filter((i) => i.status === 'done').length}/
              {importItems.length})
            </span>
            {!isImporting && (
              <button
                type="button"
                onClick={clearImportItems}
                className="text-xs text-[#A49C92] hover:text-[#F1EDE6] cursor-pointer"
              >
                Clear Log
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2">
            {importItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-[#181716] border border-[#C6A878]/10 px-3 py-2 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-[#F1EDE6] truncate">{item.fileName}</p>
                    <span className="text-[10px] text-[#A49C92] shrink-0">
                      {formatFileSize(item.size)}
                    </span>
                  </div>
                  {item.error ? (
                    <p className="text-[11px] text-rose-300 mt-0.5">{item.error}</p>
                  ) : (
                    <div className="w-full h-1 rounded-full bg-[#22201E] mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-[#C6A878] transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  {item.status === 'done' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#C6A878]" />
                  ) : item.status === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-[#D6AD73] animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface MusicImportModalProps {
  isOpen: boolean
  onClose: () => void
  defaultPlaylistId?: string
}

export const MusicImportModal: React.FC<MusicImportModalProps> = ({
  isOpen,
  onClose,
  defaultPlaylistId,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Import Local Audio Files"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-[#C6A878]/30 bg-[#101010] p-6 text-[#F1EDE6] shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#C6A878]">
              My Music Collection
            </p>
            <h3
              className="text-2xl font-semibold text-[#F1EDE6]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Import Audio Into Your Private Hall
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close import modal"
            className="p-2 rounded-lg text-[#A49C92] hover:text-[#F1EDE6] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <MusicImportDropzone defaultPlaylistId={defaultPlaylistId} />
      </div>
    </div>
  )
}

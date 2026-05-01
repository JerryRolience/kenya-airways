"use client"

import { useRef, useState } from "react"
import {
  Upload,
  Trash2,
  X,
  FileText,
  FileArchive,
  FileSpreadsheet,
  Video,
  Headphones,
  Image as ImageIcon,
  File as FileIcon,
} from "lucide-react"

// ---- utils ----
const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

const getFileIcon = (file: File) => {
  const type = file.type
  const name = file.name

  if (type.includes("pdf") || name.match(/\.(docx?|pdf)$/i)) return FileText
  if (type.includes("zip") || name.match(/\.(zip|rar)$/i)) return FileArchive
  if (name.match(/\.xlsx?$/i)) return FileSpreadsheet
  if (type.startsWith("video/")) return Video
  if (type.startsWith("audio/")) return Headphones
  if (type.startsWith("image/")) return ImageIcon

  return FileIcon
}

// ---- simulate upload ----
const simulateUpload = (file: File, onProgress: (p: number) => void, onComplete: () => void) => {
  let uploaded = 0
  const total = file.size

  const tick = () => {
    const chunk = Math.random() * 300000 + 2000
    uploaded = Math.min(total, uploaded + chunk)

    const percent = Math.floor((uploaded / total) * 100)
    onProgress(percent)

    if (uploaded < total) {
      setTimeout(tick, Math.random() * 400 + 50)
    } else {
      onComplete()
    }
  }

  tick()
}

export default function MultiFileUploadComponent() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState<Record<string, { progress: number; done: boolean }>>({})
  const [dragging, setDragging] = useState(false)

  const maxFiles = 6
  const maxSizeMB = 5
  const maxSize = maxSizeMB * 1024 * 1024

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).slice(0, maxFiles)

    const validFiles = newFiles.filter(f => f.size <= maxSize)

    setFiles(prev => [...prev, ...validFiles])

    validFiles.forEach(file => {
      const id = file.name + file.lastModified

      simulateUpload(
        file,
        p =>
          setProgress(prev => ({
            ...prev,
            [id]: { progress: p, done: false },
          })),
        () =>
          setProgress(prev => ({
            ...prev,
            [id]: { progress: 100, done: true },
          })),
      )
    })
  }

  const removeFile = (file: File) => {
    const id = file.name + file.lastModified
    setFiles(prev => prev.filter(f => f !== file))
    setProgress(prev => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  const clearAll = () => {
    setFiles([])
    setProgress({})
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`border-input relative flex min-h-52 flex-col rounded-xl border border-dashed p-4 transition
        ${dragging ? "bg-accent/50" : ""}`}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
      >
        <input ref={inputRef} type="file" multiple className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />

        {files.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium">Files ({files.length})</h3>
              <div className="flex gap-2">
                <button onClick={() => inputRef.current?.click()} className="flex items-center gap-1 border px-2 py-1 text-xs">
                  <Upload className="size-3" /> Add
                </button>
                <button onClick={clearAll} className="flex items-center gap-1 border px-2 py-1 text-xs">
                  <Trash2 className="size-3" /> Clear
                </button>
              </div>
            </div>

            {files.map(file => {
              const id = file.name + file.lastModified
              const Icon = getFileIcon(file)
              const prog = progress[id]

              return (
                <div key={id} className="border p-2 rounded">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <Icon className="size-5" />
                      <div>
                        <p className="text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                      </div>
                    </div>

                    <button onClick={() => removeFile(file)}>
                      <X className="size-4" />
                    </button>
                  </div>

                  {prog && !prog.done && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-200 rounded">
                        <div className="h-full bg-black" style={{ width: `${prog.progress}%` }} />
                      </div>
                      <p className="text-xs">{prog.progress}%</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <ImageIcon className="mb-2" />
            <p className="text-sm">Drop files here</p>
            <p className="text-xs text-muted-foreground">
              Max {maxFiles} files · {maxSizeMB}MB each
            </p>
            <button onClick={() => inputRef.current?.click()} className="mt-3 border px-3 py-1 text-sm">
              Select files
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

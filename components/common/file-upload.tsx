"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  preview?: boolean
}

export function FileUpload({ onFileSelect, accept = "image/*", maxSize = 5242880, preview = true }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewState, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    if (selectedFile.size > maxSize) {
      alert(`File size must be less than ${maxSize / 1024 / 1024}MB`)
      return
    }

    setFile(selectedFile)
    onFileSelect(selectedFile)

    if (preview) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-4">
      <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />

      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Click to upload</p>
          <p className="text-xs text-muted-foreground">or drag and drop</p>
        </div>
      ) : preview && previewState ? (
        <div className="space-y-2">
          <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
            <Image src={previewState || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="flex-1"
            >
              Change
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleClear} className="text-destructive">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-foreground">{file?.name}</span>
          <Button type="button" variant="ghost" size="sm" onClick={handleClear} className="text-destructive">
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}


'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Camera, Upload, X, Check, AlertCircle } from 'lucide-react'
import { AvatarUploadResult } from '../../types/settings'

interface AvatarUploadProps {
  currentAvatarUrl?: string
  onUpload: (file: File) => Promise<AvatarUploadResult>
  isUploading?: boolean
}

export default function AvatarUpload({ currentAvatarUrl, onUpload, isUploading = false }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Formato não suportado. Use PNG, JPG, GIF ou WebP.'
    }

    if (file.size > maxSize) {
      return 'Arquivo muito grande. Máximo 5MB.'
    }

    return null
  }

  const handleFileSelect = (file: File) => {
    const error = validateFile(file)
    if (error) {
      setErrorMessage(error)
      setUploadStatus('error')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    handleUpload(file)
  }

  const handleUpload = async (file: File) => {
    setUploadStatus('uploading')
    setErrorMessage(null)

    try {
      const result = await onUpload(file)
      
      if (result.success) {
        setUploadStatus('success')
        setTimeout(() => {
          setUploadStatus('idle')
          setPreview(null)
        }, 2000)
      } else {
        setUploadStatus('error')
        setErrorMessage(result.error || 'Erro ao fazer upload')
      }
    } catch (error) {
      setUploadStatus('error')
      setErrorMessage('Erro inesperado ao fazer upload')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const currentImage = preview || currentAvatarUrl || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80'

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )
      case 'success':
        return <Check className="w-6 h-6 text-green-400" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />
      default:
        return <Camera className="w-6 h-6 text-white" />
    }
  }

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'bg-blue-500/20 border-blue-500/40'
      case 'success':
        return 'bg-green-500/20 border-green-500/40'
      case 'error':
        return 'bg-red-500/20 border-red-500/40'
      default:
        return dragActive ? 'bg-white/20 border-white/40' : 'bg-black/50 border-transparent'
    }
  }

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        {/* Avatar Image */}
        <div
          className={`
            relative w-20 h-20 rounded-full overflow-hidden cursor-pointer group transition-all duration-300
            ${dragActive ? 'ring-2 ring-white/40 scale-105' : 'ring-1 ring-white/10 hover:ring-white/20'}
            ${uploadStatus === 'success' ? 'ring-2 ring-green-400/60' : ''}
            ${uploadStatus === 'error' ? 'ring-2 ring-red-400/60' : ''}
          `}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Image
            src={currentImage}
            alt="Avatar"
            fill
            sizes="80px"
            className={`object-cover transition-all duration-300 ${
              uploadStatus === 'uploading' ? 'opacity-50' : 'group-hover:opacity-80'
            }`}
          />

          {/* Overlay */}
          <div
            className={`
              absolute inset-0 flex items-center justify-center rounded-full transition-all duration-200
              ${getStatusColor()}
              ${uploadStatus === 'idle' 
                ? 'opacity-0 group-hover:opacity-100' 
                : 'opacity-100'
              }
            `}
          >
            {getStatusIcon()}
          </div>

          {/* Upload Progress Ring (when uploading) */}
          {uploadStatus === 'uploading' && (
            <div className="absolute inset-0 rounded-full">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-white"
                  strokeWidth="2"
                  strokeDasharray="75, 100"
                  fill="none"
                  stroke="currentColor"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    dur="1s"
                    values="0,100;75,100"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Info and Actions */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-1">Sua Foto de Perfil</h3>
        
        {uploadStatus === 'success' ? (
          <p className="text-green-400 text-sm mb-3">
            ✓ Foto atualizada com sucesso!
          </p>
        ) : uploadStatus === 'error' ? (
          <p className="text-red-400 text-sm mb-3">
            {errorMessage || 'Erro ao fazer upload'}
          </p>
        ) : uploadStatus === 'uploading' ? (
          <p className="text-blue-400 text-sm mb-3">
            Fazendo upload...
          </p>
        ) : (
          <p className="text-white/70 text-sm mb-3">
            Clique na imagem ou arraste um arquivo para alterar.
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={openFileDialog}
            disabled={uploadStatus === 'uploading'}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={16} />
            Escolher Arquivo
          </button>

          {uploadStatus === 'error' && (
            <button
              onClick={() => {
                setUploadStatus('idle')
                setErrorMessage(null)
                setPreview(null)
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-sm transition-colors"
            >
              <X size={16} />
              Limpar
            </button>
          )}
        </div>

        <p className="text-xs text-white/50 mt-2">
          Formatos: PNG, JPG, GIF, WebP • Máximo: 5MB
        </p>
      </div>
    </div>
  )
}

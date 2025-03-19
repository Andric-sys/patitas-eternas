"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  onImageUploaded: (imageId: string) => void
  className?: string
}

export default function ImageUpload({ onImageUploaded, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Tipo de archivo no válido",
        description: "Solo se permiten imágenes JPEG, PNG y WebP",
        variant: "destructive",
      })
      return
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Archivo demasiado grande",
        description: "El tamaño máximo permitido es 5MB",
        variant: "destructive",
      })
      return
    }

    // Crear vista previa
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    // Iniciar carga
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return newProgress
        })
      }, 300)

      // Crear FormData
      const formData = new FormData()
      formData.append("file", file)

      // Enviar al servidor
      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al subir la imagen")
      }

      setUploadProgress(100)

      const data = await response.json()
      onImageUploaded(data.imageId)

      toast({
        title: "Imagen subida exitosamente",
        description: "La imagen se ha subido correctamente",
      })
    } catch (error) {
      toast({
        title: "Error al subir la imagen",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Mantener el progreso al 100% por un momento antes de resetear
      setTimeout(() => {
        setUploadProgress(0)
      }, 1000)
    }
  }

  const handleRemovePreview = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
        disabled={isUploading}
      />

      {previewUrl ? (
        <div className="relative w-full max-w-xs mb-4">
          <div className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
            <Image src={previewUrl || "/placeholder.svg"} alt="Vista previa" fill className="object-cover" />
            <button
              type="button"
              onClick={handleRemovePreview}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-xs h-48 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors mb-4"
        >
          <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Haz clic para seleccionar una imagen</p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG o WebP (máx. 5MB)</p>
        </div>
      )}

      {uploadProgress > 0 && (
        <div className="w-full max-w-xs mb-4">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-gray-500 mt-1 text-center">
            {uploadProgress === 100 ? "Completado" : "Subiendo..."}
          </p>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center"
      >
        <Upload className="h-4 w-4 mr-2" />
        {previewUrl ? "Cambiar imagen" : "Subir imagen"}
      </Button>
    </div>
  )
}


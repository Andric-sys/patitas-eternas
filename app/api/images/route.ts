import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { saveImage } from "@/lib/gridfs"

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    // Procesar la imagen
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ message: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Tipo de archivo no válido. Solo se permiten JPEG, PNG y WebP" },
        { status: 400 },
      )
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ message: "El archivo es demasiado grande. Máximo 5MB" }, { status: 400 })
    }

    // Convertir a buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Generar nombre único
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/\s+/g, "-")}`

    // Guardar en GridFS
    const imageId = await saveImage(buffer, filename, file.type)

    return NextResponse.json(
      {
        message: "Imagen subida exitosamente",
        imageId,
        filename,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al subir imagen:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}


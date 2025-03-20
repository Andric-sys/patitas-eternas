import { type NextRequest, NextResponse } from "next/server"
import { getImageById, deleteImageById } from "@/lib/gridfs"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const result = await getImageById(id)

    if (!result) {
      return NextResponse.json({ message: "Imagen no encontrada" }, { status: 404 })
    }

    // Crear un ReadableStream a partir del stream de MongoDB
    const { stream, metadata } = result
    const readable = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => {
          controller.enqueue(chunk)
        })
        stream.on("end", () => {
          controller.close()
        })
        stream.on("error", (err) => {
          controller.error(err)
        })
      },
    })

    // Devolver la imagen con el tipo de contenido correcto
    return new NextResponse(readable, {
      headers: {
        "Content-Type": metadata.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error al obtener imagen:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const id = params.id
    const success = await deleteImageById(id)

    if (!success) {
      return NextResponse.json({ message: "Error al eliminar la imagen" }, { status: 500 })
    }

    return NextResponse.json({ message: "Imagen eliminada exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al eliminar imagen:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}


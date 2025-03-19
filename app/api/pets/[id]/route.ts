import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { findOne, updateOne, deleteOne, toObjectId } from "@/lib/db"
import { PetSchema } from "@/lib/models"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Obtener mascota
    const pet = await findOne("pets", { _id: toObjectId(id) })

    if (!pet) {
      return NextResponse.json({ message: "Mascota no encontrada" }, { status: 404 })
    }

    return NextResponse.json(pet)
  } catch (error) {
    console.error("Error al obtener mascota:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const id = params.id

    // Verificar si la mascota existe
    const existingPet = await findOne("pets", { _id: toObjectId(id) })

    if (!existingPet) {
      return NextResponse.json({ message: "Mascota no encontrada" }, { status: 404 })
    }

    // Obtener datos de la solicitud
    const petData = await req.json()

    // Validar con Zod
    const result = PetSchema.safeParse({
      ...petData,
      updatedAt: new Date(),
    })

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Datos de mascota inválidos",
          errors: result.error.format(),
        },
        { status: 400 },
      )
    }

    // Actualizar en la base de datos
    await updateOne("pets", { _id: toObjectId(id) }, result.data)

    return NextResponse.json({ message: "Mascota actualizada exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al actualizar mascota:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const id = params.id

    // Verificar si la mascota existe
    const existingPet = await findOne("pets", { _id: toObjectId(id) })

    if (!existingPet) {
      return NextResponse.json({ message: "Mascota no encontrada" }, { status: 404 })
    }

    // Eliminar de la base de datos
    await deleteOne("pets", { _id: toObjectId(id) })

    return NextResponse.json({ message: "Mascota eliminada exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al eliminar mascota:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}


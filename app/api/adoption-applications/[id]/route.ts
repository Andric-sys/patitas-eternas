import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { findOne, updateOne, toObjectId } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const id = params.id

    // Obtener solicitud
    const application = await findOne("adoption_applications", { _id: toObjectId(id) })

    if (!application) {
      return NextResponse.json({ message: "Solicitud no encontrada" }, { status: 404 })
    }

    // Verificar permisos (solo admin o el propio usuario pueden ver la solicitud)
    if (session.user.role !== "admin" && application.userId !== session.user.id) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("Error al obtener solicitud:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const id = params.id

    // Verificar si la solicitud existe
    const existingApplication = await findOne("adoption_applications", { _id: toObjectId(id) })

    if (!existingApplication) {
      return NextResponse.json({ message: "Solicitud no encontrada" }, { status: 404 })
    }

    // Obtener datos de la solicitud
    const { status } = await request.json()

    // Validar estado
    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ message: "Estado no válido" }, { status: 400 })
    }

    // Actualizar en la base de datos
    await updateOne(
      "adoption_applications",
      { _id: toObjectId(id) },
      {
        status,
        updatedAt: new Date(),
      },
    )

    // Si se aprueba la solicitud, actualizar el estado de la mascota
    if (status === "approved") {
      await updateOne(
        "pets",
        { _id: toObjectId(existingApplication.petId) },
        {
          status: "adopted",
          updatedAt: new Date(),
        },
      )
    }

    return NextResponse.json({ message: "Solicitud actualizada exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al actualizar solicitud:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}


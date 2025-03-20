import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { findMany, insertOne } from "@/lib/db"
import { AdoptionApplicationSchema } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    // Construir consulta
    const query: any = {}

    // Si no es admin, solo mostrar sus propias solicitudes
    if (session.user.role !== "admin") {
      query.userId = session.user.id
    }

    // Obtener solicitudes
    const applications = await findMany("adoption_applications", query)

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error al obtener solicitudes:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Obtener sesión (opcional, para asociar la solicitud a un usuario)
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Obtener datos de la solicitud
    const applicationData = await req.json()

    // Agregar userId si está disponible
    if (userId) {
      applicationData.userId = userId
    }

    // Validar con Zod
    const result = AdoptionApplicationSchema.safeParse(applicationData)

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Datos de solicitud inválidos",
          errors: result.error.format(),
        },
        { status: 400 },
      )
    }

    // Guardar en la base de datos
    const { insertedId } = await insertOne("adoption_applications", result.data)

    return NextResponse.json(
      {
        message: "Solicitud enviada exitosamente",
        applicationId: insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al crear solicitud:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}


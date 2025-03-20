import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { findMany, insertOne } from "@/lib/db"
import { PetSchema } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)

    // Extraer parámetros de consulta
    const species = url.searchParams.getAll("species")
    const size = url.searchParams.get("size")
    const minAge = url.searchParams.get("minAge")
    const maxAge = url.searchParams.get("maxAge")
    const status = url.searchParams.get("status") || "available"

    // Construir consulta
    const query: any = {}

    if (species.length > 0) {
      query.species = { $in: species }
    }

    if (size) {
      query.size = size
    }

    if (minAge || maxAge) {
      query.age = {}
      if (minAge) query.age.$gte = Number.parseInt(minAge)
      if (maxAge) query.age.$lte = Number.parseInt(maxAge)
    }

    if (status) {
      query.status = status
    }

    // Obtener mascotas
    const pets = await findMany("pets", query)

    return NextResponse.json(pets)
  } catch (error) {
    console.error("Error al obtener mascotas:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    // Obtener datos de la solicitud
    const petData = await req.json()

    // Validar con Zod
    const result = PetSchema.safeParse(petData)

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Datos de mascota inválidos",
          errors: result.error.format(),
        },
        { status: 400 },
      )
    }

    // Guardar en la base de datos
    const { insertedId } = await insertOne("pets", result.data)

    return NextResponse.json(
      {
        message: "Mascota creada exitosamente",
        petId: insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al crear mascota:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}


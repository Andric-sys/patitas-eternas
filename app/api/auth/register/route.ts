import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { findOne, insertOne } from "@/lib/db"
import { UserSchema } from "@/lib/models"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    // Validar los datos con Zod
    const result = UserSchema.safeParse({
      name,
      email,
      password,
      role: "user",
    })

    if (!result.success) {
      return NextResponse.json({ message: "Datos de usuario inválidos" }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const existingUser = await findOne("users", { email })
    if (existingUser) {
      return NextResponse.json({ message: "El correo electrónico ya está registrado" }, { status: 409 })
    }

    // Encriptar la contraseña
    const hashedPassword = await hash(password, 10)

    // Crear el usuario
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Guardar en la base de datos
    const { insertedId } = await insertOne("users", newUser)

    // Retornar respuesta exitosa
    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        userId: insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}



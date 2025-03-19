import clientPromise from "../lib/mongodb"

async function initDatabase() {
  try {
    console.log("Conectando a MongoDB...")
    const client = await clientPromise
    const db = client.db("patitas_eternas")

    console.log("Creando colecciones e índices...")

    // Crear índices para la colección de mascotas
    await db
      .collection("pets")
      .createIndexes([
        { key: { species: 1 } },
        { key: { status: 1 } },
        { key: { size: 1 } },
        { key: { age: 1 } },
        { key: { location: 1 } },
      ])
    console.log("Índices de mascotas creados")

    // Crear índices para la colección de solicitudes de adopción
    await db
      .collection("adoption_applications")
      .createIndexes([
        { key: { petId: 1 } },
        { key: { userId: 1 } },
        { key: { status: 1 } },
        { key: { submittedAt: -1 } },
      ])
    console.log("Índices de solicitudes creados")

    // Crear índices para la colección de usuarios
    await db.collection("users").createIndexes([{ key: { email: 1 }, unique: true }, { key: { role: 1 } }])
    console.log("Índices de usuarios creados")

    // Crear índices para la colección de pagos
    await db
      .collection("payments")
      .createIndexes([{ key: { userId: 1 } }, { key: { status: 1 } }, { key: { createdAt: -1 } }])
    console.log("Índices de pagos creados")

    // Crear un usuario administrador inicial si no existe
    const adminExists = await db.collection("users").findOne({ email: "admin@patitaseternas.com" })

    if (!adminExists) {
      await db.collection("users").insertOne({
        name: "Administrador",
        email: "admin@patitaseternas.com",
        // Contraseña: admin123 (deberías cambiarla después)
        password: "$2b$10$zPMYuUJYgG5TRxFBMnIqYOQqJl7EHrVQhMZ.R5ULsYL4UwKrOCgJi",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log("Usuario administrador creado")
    }

    console.log("Inicialización de la base de datos completada")
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    process.exit(1)
  }
}

initDatabase()


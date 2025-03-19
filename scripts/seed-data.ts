import clientPromise from "../lib/mongodb"

async function seedDatabase() {
  try {
    console.log("Conectando a MongoDB...")
    const client = await clientPromise
    const db = client.db("patitas_eternas")

    console.log("Creando datos de ejemplo...")

    // Datos de ejemplo para mascotas
    const samplePets = [
      {
        name: "Luna",
        species: "dog",
        breed: "Labrador",
        age: 2,
        size: "medium",
        gender: "female",
        location: "Ciudad de México",
        description:
          "Luna es una perra muy cariñosa y juguetona. Le encanta correr y jugar con pelotas. Es muy sociable con personas y otros perros. Está completamente vacunada y esterilizada.",
        characteristics: ["Juguetona", "Cariñosa", "Sociable", "Entrenada"],
        healthStatus: ["Vacunada", "Esterilizada", "Desparasitada"],
        status: "available",
        imageIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Michi",
        species: "cat",
        breed: "Siamés",
        age: 1,
        size: "small",
        gender: "male",
        location: "Guadalajara",
        description:
          "Michi es un gato muy tranquilo y cariñoso. Le gusta dormir en lugares cálidos y jugar con juguetes pequeños. Es muy independiente pero disfruta de la compañía humana.",
        characteristics: ["Tranquilo", "Independiente", "Curioso", "Limpio"],
        healthStatus: ["Vacunado", "Esterilizado", "Desparasitado"],
        status: "available",
        imageIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Rocky",
        species: "dog",
        breed: "Pastor Alemán",
        age: 3,
        size: "large",
        gender: "male",
        location: "Monterrey",
        description:
          "Rocky es un perro muy inteligente y leal. Es perfecto para familias activas. Le encanta aprender trucos nuevos y es muy protector con su familia.",
        characteristics: ["Inteligente", "Leal", "Activo", "Protector"],
        healthStatus: ["Vacunado", "Esterilizado", "Desparasitado"],
        status: "available",
        imageIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pelusa",
        species: "cat",
        breed: "Persa",
        age: 4,
        size: "small",
        gender: "female",
        location: "Puebla",
        description:
          "Pelusa es una gata muy elegante y tranquila. Le gusta la paz y la tranquilidad. Es perfecta para hogares tranquilos donde pueda recibir muchos mimos.",
        characteristics: ["Tranquila", "Cariñosa", "Elegante", "Independiente"],
        healthStatus: ["Vacunada", "Esterilizada", "Desparasitada"],
        status: "available",
        imageIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Insertar mascotas si la colección está vacía
    const petsCount = await db.collection("pets").countDocuments()
    if (petsCount === 0) {
      await db.collection("pets").insertMany(samplePets)
      console.log(`${samplePets.length} mascotas de ejemplo creadas`)
    } else {
      console.log("Ya existen mascotas en la base de datos, omitiendo creación")
    }

    console.log("Datos de ejemplo creados exitosamente")
  } catch (error) {
    console.error("Error al crear datos de ejemplo:", error)
    process.exit(1)
  }
}

seedDatabase()


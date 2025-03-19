import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Obtener todas las mascotas para generar URLs dinámicas
  const petsResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/pets?status=available`)
  const pets = await petsResponse.json()

  const petUrls = pets.map((pet: any) => ({
    url: `${process.env.NEXTAUTH_URL}/mascotas/${pet._id}`,
    lastModified: new Date(pet.updatedAt || pet.createdAt),
    changeFrequency: "daily",
    priority: 0.8,
  }))

  // URLs estáticas
  const routes = ["", "/mascotas", "/sobre-nosotros", "/contacto", "/donar"].map((route) => ({
    url: `${process.env.NEXTAUTH_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  }))

  return [...routes, ...petUrls]
}


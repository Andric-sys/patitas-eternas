import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Heart, Share2, ArrowLeft, PawPrint, Mail } from "lucide-react"
import AdoptionForm from "@/components/adoption-form"

// Definir los tipos para la mascota
interface Pet {
  id: string
  name: string
  species: "dog" | "cat"
  breed: string
  age: number
  size: "small" | "medium" | "large"
  gender: "male" | "female"
  location: string
  description: string
  characteristics: string[]
  healthStatus: string[]
  imageIds: string[]
}

// Función para obtener los datos de la mascota
async function getPetData(id: string): Promise<Pet | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/pets/${id}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch (error) {
    console.error("Error al obtener mascota:", error)
    return null
  }
}

// Componente de la página
export default async function PetDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const pet = await getPetData(params.id)

  if (!pet) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/mascotas" className="inline-flex items-center text-navy-800 hover:text-navy-600 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a mascotas
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="lg:col-span-2">
          <div className="relative rounded-lg overflow-hidden h-[400px] md:h-[500px]">
            <Image
              src={
                pet.imageIds && pet.imageIds.length > 0
                  ? `/api/images/${pet.imageIds[0]}`
                  : "/placeholder.svg?height=600&width=800"
              }
              alt={pet.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" className="flex items-center">
              <Heart className="mr-2 h-5 w-5" />
              Guardar
            </Button>
            <Button variant="outline" className="flex items-center">
              <Share2 className="mr-2 h-5 w-5" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-navy-900">{pet.name}</h1>
              <p className="text-gray-600">
                {pet.breed} · {pet.age} {pet.age === 1 ? "año" : "años"}
              </p>
            </div>

            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">{pet.location}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge className={pet.species === "dog" ? "bg-blue-500" : "bg-purple-500"}>
                {pet.species === "dog" ? "Perro" : "Gato"}
              </Badge>
              <Badge variant="outline">
                {pet.size === "small" ? "Pequeño" : pet.size === "medium" ? "Mediano" : "Grande"}
              </Badge>
              <Badge variant="outline">{pet.gender === "male" ? "Macho" : "Hembra"}</Badge>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <h2 className="text-xl font-semibold mb-2">Descripción</h2>
              <p className="text-gray-700">{pet.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Características</h2>
              <div className="flex flex-wrap gap-2">
                {pet.characteristics.map((trait, index) => (
                  <Badge key={index} variant="secondary" className="bg-navy-50 text-navy-800">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Estado de Salud</h2>
              <div className="flex flex-wrap gap-2">
                {pet.healthStatus.map((status, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                    {status}
                  </Badge>
                ))}
              </div>
            </div>

            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-navy-900 font-semibold mb-3">
              <PawPrint className="mr-2 h-5 w-5" />
              Solicitar Adopción
            </Button>

            <Button variant="outline" className="w-full">
              <Mail className="mr-2 h-5 w-5" />
              Contactar
            </Button>
          </div>
        </div>
      </div>

      {/* Adoption Form Section */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-navy-900 mb-6">Solicitar Adopción</h2>
        <AdoptionForm petId={pet.id} petName={pet.name} />
      </div>
    </div>
  )
}


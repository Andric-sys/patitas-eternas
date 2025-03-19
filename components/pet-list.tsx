"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Filter } from "lucide-react"

type Pet = {
  id: string
  name: string
  species: "dog" | "cat"
  breed: string
  age: number
  size: "small" | "medium" | "large"
  location: string
  imageUrl: string
  description: string
  imageIds: string[]
}

export default function PetList() {
  const searchParams = useSearchParams()
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true)

        // Construir URL con parámetros de búsqueda
        const params = new URLSearchParams()

        if (searchParams.getAll("species").length > 0) {
          searchParams.getAll("species").forEach((s) => params.append("species", s))
        }

        const size = searchParams.get("size")
        if (size) {
          params.set("size", size)
        }

        const minAge = searchParams.get("minAge")
        const maxAge = searchParams.get("maxAge")
        if (minAge) params.set("minAge", minAge)
        if (maxAge) params.set("maxAge", maxAge)

        // Obtener mascotas disponibles por defecto
        params.set("status", "available")

        const response = await fetch(`/api/pets?${params.toString()}`)

        if (!response.ok) {
          throw new Error("Error al obtener mascotas")
        }

        const data = await response.json()
        setPets(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPets()
  }, [searchParams])

  if (loading) {
    return <div>Cargando mascotas...</div>
  }

  return (
    <div>
      {activeFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500 flex items-center">
            <Filter className="h-4 w-4 mr-1" /> Filtros activos:
          </span>
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-100">
              {filter}
            </Badge>
          ))}
        </div>
      )}

      {pets.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No se encontraron mascotas</h3>
          <p className="text-gray-600 mb-4">Intenta con otros filtros o revisa más tarde.</p>
          <Button asChild variant="outline">
            <Link href="/mascotas">Ver todas las mascotas</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <Link href={`/mascotas/${pet.id}`} key={pet.id} className="group">
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={
                      pet.imageIds && pet.imageIds.length > 0
                        ? `/api/images/${pet.imageIds[0]}`
                        : "/placeholder.svg?height=300&width=400"
                    }
                    alt={pet.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault()
                      // Add to favorites logic would go here
                    }}
                  >
                    <Heart className="h-5 w-5 text-red-500" />
                  </button>
                  <Badge
                    className={`absolute bottom-2 left-2 ${pet.species === "dog" ? "bg-blue-500" : "bg-purple-500"}`}
                  >
                    {pet.species === "dog" ? "Perro" : "Gato"}
                  </Badge>
                </div>
                <CardContent className="p-4 flex-grow">
                  <h3 className="text-xl font-semibold text-navy-900">{pet.name}</h3>
                  <p className="text-gray-600">
                    {pet.breed} · {pet.age} {pet.age === 1 ? "año" : "años"}
                  </p>
                  <p className="text-gray-500 text-sm mt-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> {pet.location}
                  </p>
                  <p className="text-gray-700 mt-2 line-clamp-2">{pet.description}</p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0">
                  <Badge variant="outline" className="mr-2">
                    {pet.size === "small" ? "Pequeño" : pet.size === "medium" ? "Mediano" : "Grande"}
                  </Badge>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}


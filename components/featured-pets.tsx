"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin } from "lucide-react"

type Pet = {
  id: string
  name: string
  species: "dog" | "cat"
  breed: string
  age: string
  size: "small" | "medium" | "large"
  location: string
  imageUrl: string
  imageIds: string[]
}

export default function FeaturedPets() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("/api/pets?status=available")
        if (!response.ok) {
          throw new Error("Error al obtener mascotas")
        }
        const data = await response.json()
        // Limitar a 4 mascotas para la sección destacada
        setPets(data.slice(0, 4))
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPets()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <Badge className={`absolute bottom-2 left-2 ${pet.species === "dog" ? "bg-blue-500" : "bg-purple-500"}`}>
                {pet.species === "dog" ? "Perro" : "Gato"}
              </Badge>
            </div>
            <CardContent className="p-4 flex-grow">
              <h3 className="text-xl font-semibold text-navy-900">{pet.name}</h3>
              <p className="text-gray-600">
                {pet.breed} · {pet.age}
              </p>
              <p className="text-gray-500 text-sm mt-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1" /> {pet.location}
              </p>
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
  )
}


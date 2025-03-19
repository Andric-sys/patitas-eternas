"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  FileText,
  Users,
  PawPrint,
  Clock,
  Heart,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Mock data for pets
const mockPets = [
  {
    id: "1",
    name: "Luna",
    species: "dog",
    breed: "Labrador",
    age: 2,
    size: "medium",
    status: "available",
    location: "Ciudad de México",
    imageUrl: "/placeholder.svg?height=100&width=100",
    createdAt: "2023-10-15",
  },
  {
    id: "2",
    name: "Michi",
    species: "cat",
    breed: "Siamés",
    age: 1,
    size: "small",
    status: "pending",
    location: "Guadalajara",
    imageUrl: "/placeholder.svg?height=100&width=100",
    createdAt: "2023-10-20",
  },
  {
    id: "3",
    name: "Rocky",
    species: "dog",
    breed: "Pastor Alemán",
    age: 3,
    size: "large",
    status: "adopted",
    location: "Monterrey",
    imageUrl: "/placeholder.svg?height=100&width=100",
    createdAt: "2023-09-05",
  },
  {
    id: "4",
    name: "Pelusa",
    species: "cat",
    breed: "Persa",
    age: 4,
    size: "small",
    status: "available",
    location: "Puebla",
    imageUrl: "/placeholder.svg?height=100&width=100",
    createdAt: "2023-11-01",
  },
]

// Mock data for adoption applications
const mockApplications = [
  {
    id: "1",
    petName: "Luna",
    petId: "1",
    applicantName: "Carlos Rodríguez",
    email: "carlos@example.com",
    phone: "5512345678",
    status: "pending",
    submittedAt: "2023-11-05",
  },
  {
    id: "2",
    petName: "Michi",
    petId: "2",
    applicantName: "Ana López",
    email: "ana@example.com",
    phone: "5587654321",
    status: "approved",
    submittedAt: "2023-10-25",
  },
  {
    id: "3",
    petName: "Rocky",
    petId: "3",
    applicantName: "Miguel Hernández",
    email: "miguel@example.com",
    phone: "5523456789",
    status: "rejected",
    submittedAt: "2023-09-15",
  },
]

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [pets, setPets] = useState(mockPets)
  const [applications, setApplications] = useState(mockApplications)

  // Agregar estos estados y efectos al inicio del componente
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("/api/pets")
        if (!response.ok) {
          throw new Error("Error al obtener mascotas")
        }
        const data = await response.json()
        setPets(data)
      } catch (error) {
        console.error("Error:", error)
      }
    }

    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/adoption-applications")
        if (!response.ok) {
          throw new Error("Error al obtener solicitudes")
        }
        const data = await response.json()
        setApplications(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPets()
    fetchApplications()
  }, [])

  // Filter pets based on search term
  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter applications based on search term
  const filteredApplications = applications.filter(
    (app) =>
      app.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle pet status change
  const handleStatusChange = async (petId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/pets/${petId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar estado")
      }

      // Actualizar estado local
      setPets(pets.map((pet) => (pet.id === petId ? { ...pet, status: newStatus } : pet)))

      toast({
        title: "Estado actualizado",
        description: "El estado de la mascota ha sido actualizado correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la mascota.",
        variant: "destructive",
      })
    }
  }

  // Handle application status change
  const handleApplicationStatusChange = async (appId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/adoption-applications/${appId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar estado")
      }

      // Actualizar estado local
      setApplications(applications.map((app) => (app.id === appId ? { ...app, status: newStatus } : app)))

      toast({
        title: "Estado actualizado",
        description: "El estado de la solicitud ha sido actualizado correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la solicitud.",
        variant: "destructive",
      })
    }
  }

  // Handle pet deletion
  const handleDeletePet = async (petId: string) => {
    try {
      const response = await fetch(`/api/pets/${petId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar mascota")
      }

      // Actualizar estado local
      setPets(pets.filter((pet) => pet.id !== petId))

      toast({
        title: "Mascota eliminada",
        description: "La mascota ha sido eliminada correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la mascota.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Panel de Administración</CardTitle>
          <CardDescription>Gestiona mascotas, solicitudes de adopción y usuarios.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <PawPrint className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total de Mascotas</p>
                  <p className="text-2xl font-bold">{pets.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Solicitudes</p>
                  <p className="text-2xl font-bold">{applications.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adopciones Completadas</p>
                  <p className="text-2xl font-bold">{pets.filter((pet) => pet.status === "adopted").length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestión de Contenido</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-navy-900">
            <Link href="/admin/agregar-mascota">
              <Plus className="mr-2 h-4 w-4" /> Agregar Mascota
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pets" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pets">Mascotas</TabsTrigger>
          <TabsTrigger value="applications">Solicitudes de Adopción</TabsTrigger>
        </TabsList>

        <TabsContent value="pets">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Especie</TableHead>
                    <TableHead>Raza</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No se encontraron mascotas que coincidan con la búsqueda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPets.map((pet) => (
                      <TableRow key={pet.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden">
                              <Image
                                src={
                                  pet.imageIds && pet.imageIds.length > 0
                                    ? `/api/images/${pet.imageIds[0]}`
                                    : "/placeholder.svg?height=100&width=100"
                                }
                                alt={pet.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium">{pet.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={pet.species === "dog" ? "bg-blue-500" : "bg-purple-500"}>
                            {pet.species === "dog" ? "Perro" : "Gato"}
                          </Badge>
                        </TableCell>
                        <TableCell>{pet.breed}</TableCell>
                        <TableCell>
                          {pet.age} {pet.age === 1 ? "año" : "años"}
                        </TableCell>
                        <TableCell>{pet.location}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              pet.status === "available"
                                ? "bg-green-500"
                                : pet.status === "pending"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                            }
                          >
                            {pet.status === "available"
                              ? "Disponible"
                              : pet.status === "pending"
                                ? "En proceso"
                                : "Adoptado"}
                          </Badge>
                        </TableCell>
                        <TableCell>{pet.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" /> Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(pet.id, "available")}
                                disabled={pet.status === "available"}
                              >
                                <Check className="mr-2 h-4 w-4 text-green-500" /> Marcar como disponible
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(pet.id, "pending")}
                                disabled={pet.status === "pending"}
                              >
                                <Clock className="mr-2 h-4 w-4 text-yellow-500" /> Marcar en proceso
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(pet.id, "adopted")}
                                disabled={pet.status === "adopted"}
                              >
                                <Heart className="mr-2 h-4 w-4 text-blue-500" /> Marcar como adoptado
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeletePet(pet.id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No se encontraron solicitudes que coincidan con la búsqueda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="font-medium">{app.applicantName}</div>
                        </TableCell>
                        <TableCell>
                          <Link href={`/mascotas/${app.petId}`} className="text-blue-600 hover:underline">
                            {app.petName}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div>{app.email}</div>
                          <div className="text-sm text-gray-500">{app.phone}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              app.status === "approved"
                                ? "bg-green-500"
                                : app.status === "pending"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }
                          >
                            {app.status === "approved"
                              ? "Aprobada"
                              : app.status === "pending"
                                ? "Pendiente"
                                : "Rechazada"}
                          </Badge>
                        </TableCell>
                        <TableCell>{app.submittedAt}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" /> Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleApplicationStatusChange(app.id, "approved")}
                                disabled={app.status === "approved"}
                              >
                                <Check className="mr-2 h-4 w-4 text-green-500" /> Aprobar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleApplicationStatusChange(app.id, "pending")}
                                disabled={app.status === "pending"}
                              >
                                <Clock className="mr-2 h-4 w-4 text-yellow-500" /> Marcar pendiente
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleApplicationStatusChange(app.id, "rejected")}
                                disabled={app.status === "rejected"}
                              >
                                <X className="mr-2 h-4 w-4 text-red-500" /> Rechazar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


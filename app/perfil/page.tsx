"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { User, PawPrint, Heart, Clock, CheckCircle, XCircle } from "lucide-react"

type AdoptionApplication = {
  _id: string
  petId: string
  petName?: string
  petImage?: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [applications, setApplications] = useState<AdoptionApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirigir si no está autenticado
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/perfil")
    }

    // Cargar solicitudes de adopción
    if (status === "authenticated") {
      fetchApplications()
    }
  }, [status, router])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/adoption-applications")
      if (!response.ok) {
        throw new Error("Error al obtener solicitudes")
      }

      const data = await response.json()

      // Obtener detalles de las mascotas para cada solicitud
      const applicationsWithPetDetails = await Promise.all(
        data.map(async (app: AdoptionApplication) => {
          try {
            const petResponse = await fetch(`/api/pets/${app.petId}`)
            if (petResponse.ok) {
              const pet = await petResponse.json()
              return {
                ...app,
                petName: pet.name,
                petImage: pet.imageIds && pet.imageIds.length > 0 ? pet.imageIds[0] : null,
              }
            }
            return app
          } catch (error) {
            console.error("Error al obtener detalles de mascota:", error)
            return app
          }
        }),
      )

      setApplications(applicationsWithPetDetails)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar tus solicitudes de adopción",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-800"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Redirigiendo en useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Mi Perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                  <AvatarFallback className="bg-navy-100 text-navy-800 text-xl">
                    {session.user.name?.charAt(0).toUpperCase() || <User />}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-navy-900">{session.user.name}</h2>
                <p className="text-gray-500 text-sm">{session.user.email}</p>

                {session.user.role === "admin" && <Badge className="mt-2 bg-yellow-500">Administrador</Badge>}
              </div>

              <Separator className="my-6" />

              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/perfil">
                    <User className="mr-2 h-4 w-4" />
                    Mi Perfil
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/perfil/favoritos">
                    <Heart className="mr-2 h-4 w-4" />
                    Favoritos
                  </a>
                </Button>
                {session.user.role === "admin" && (
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/admin">
                      <PawPrint className="mr-2 h-4 w-4" />
                      Panel de Administración
                    </a>
                  </Button>
                )}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="applications">
            <TabsList className="mb-6">
              <TabsTrigger value="applications">Mis Solicitudes</TabsTrigger>
              <TabsTrigger value="profile">Datos Personales</TabsTrigger>
            </TabsList>

            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Solicitudes de Adopción</CardTitle>
                  <CardDescription>Historial de tus solicitudes de adopción y su estado actual</CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <PawPrint className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No tienes solicitudes de adopción</h3>
                      <p className="text-gray-500 mb-4">Explora nuestras mascotas disponibles y solicita adoptar una</p>
                      <Button asChild className="bg-navy-800 hover:bg-navy-900">
                        <a href="/mascotas">Ver Mascotas</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {applications.map((application) => (
                        <div key={application._id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                          <div className="w-full md:w-24 h-24 relative rounded-md overflow-hidden">
                            {application.petImage ? (
                              <img
                                src={`/api/images/${application.petImage}`}
                                alt={application.petName || "Mascota"}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <PawPrint className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-navy-900">{application.petName || "Mascota"}</h3>
                                <p className="text-sm text-gray-500">
                                  Solicitud enviada el {new Date(application.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge
                                className={
                                  application.status === "approved"
                                    ? "bg-green-500"
                                    : application.status === "pending"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }
                              >
                                {application.status === "approved"
                                  ? "Aprobada"
                                  : application.status === "pending"
                                    ? "Pendiente"
                                    : "Rechazada"}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center text-sm">
                              {application.status === "pending" ? (
                                <>
                                  <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                                  <span className="text-gray-600">Tu solicitud está siendo revisada</span>
                                </>
                              ) : application.status === "approved" ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                  <span className="text-gray-600">¡Felicidades! Tu solicitud ha sido aprobada</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                                  <span className="text-gray-600">Lo sentimos, tu solicitud no fue aprobada</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Datos Personales</CardTitle>
                  <CardDescription>Información de tu perfil y preferencias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                      <p className="mt-1 text-navy-900">{session.user.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Correo Electrónico</h3>
                      <p className="mt-1 text-navy-900">{session.user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Tipo de Cuenta</h3>
                      <p className="mt-1 text-navy-900">
                        {session.user.role === "admin" ? "Administrador" : "Usuario"}
                      </p>
                    </div>

                    <Button className="bg-navy-800 hover:bg-navy-900">Editar Perfil</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Trash2 } from "lucide-react"
import ImageUpload from "@/components/image-upload"

const petSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  species: z.enum(["dog", "cat"], {
    required_error: "La especie es requerida",
  }),
  breed: z.string().min(1, "La raza es requerida"),
  age: z.coerce.number().min(0, "La edad debe ser un número positivo"),
  size: z.enum(["small", "medium", "large"], {
    required_error: "El tamaño es requerido",
  }),
  gender: z.enum(["male", "female"], {
    required_error: "El género es requerido",
  }),
  location: z.string().min(1, "La ubicación es requerida"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  characteristics: z.array(z.string()).min(1, "Selecciona al menos una característica"),
  healthStatus: z.array(z.string()).min(1, "Selecciona al menos un estado de salud"),
})

const characteristicOptions = [
  { id: "playful", label: "Juguetón" },
  { id: "friendly", label: "Amigable" },
  { id: "calm", label: "Tranquilo" },
  { id: "active", label: "Activo" },
  { id: "independent", label: "Independiente" },
  { id: "affectionate", label: "Cariñoso" },
  { id: "trained", label: "Entrenado" },
  { id: "protective", label: "Protector" },
]

const healthStatusOptions = [
  { id: "vaccinated", label: "Vacunado" },
  { id: "sterilized", label: "Esterilizado" },
  { id: "dewormed", label: "Desparasitado" },
  { id: "microchipped", label: "Microchip" },
  { id: "specialNeeds", label: "Necesidades especiales" },
]

export default function AddPetPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const form = useForm<z.infer<typeof petSchema>>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      species: "dog",
      breed: "",
      age: 0,
      size: "medium",
      gender: "male",
      location: "",
      description: "",
      characteristics: [],
      healthStatus: [],
    },
  })

  const handleImageUploaded = (imageId: string) => {
    setUploadedImages((prev) => [...prev, imageId])
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(values: z.infer<typeof petSchema>) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          imageIds: uploadedImages,
          status: "available",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al crear mascota")
      }

      toast({
        title: "Mascota agregada",
        description: "La mascota ha sido agregada exitosamente",
      })

      router.push("/admin")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6 flex items-center text-navy-800" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Agregar Nueva Mascota</CardTitle>
          <CardDescription>
            Completa el formulario para agregar una nueva mascota disponible para adopción
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre de la mascota" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="species"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Especie</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="dog" />
                              </FormControl>
                              <FormLabel className="font-normal">Perro</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cat" />
                              </FormControl>
                              <FormLabel className="font-normal">Gato</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Raza</FormLabel>
                        <FormControl>
                          <Input placeholder="Raza de la mascota" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Edad (años)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Género</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el género" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Macho</SelectItem>
                              <SelectItem value="female">Hembra</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tamaño</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tamaño" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="small">Pequeño</SelectItem>
                            <SelectItem value="medium">Mediano</SelectItem>
                            <SelectItem value="large">Grande</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ubicación</FormLabel>
                        <FormControl>
                          <Input placeholder="Ciudad o localidad" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe la personalidad, historia y necesidades de la mascota"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="characteristics"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Características</FormLabel>
                          <FormDescription>
                            Selecciona las características que mejor describen a la mascota
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {characteristicOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="characteristics"
                              render={({ field }) => {
                                return (
                                  <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(field.value?.filter((value) => value !== option.id))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{option.label}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="healthStatus"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Estado de Salud</FormLabel>
                          <FormDescription>Selecciona las condiciones de salud que aplican</FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {healthStatusOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="healthStatus"
                              render={({ field }) => {
                                return (
                                  <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(field.value?.filter((value) => value !== option.id))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{option.label}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Imágenes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <ImageUpload onImageUploaded={handleImageUploaded} />
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium mb-2">Imágenes subidas:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {uploadedImages.map((imageId, index) => (
                          <div key={imageId} className="relative group">
                            <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                              <img
                                src={`/api/images/${imageId}`}
                                alt={`Imagen ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full bg-navy-800 hover:bg-navy-900" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Mascota"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}


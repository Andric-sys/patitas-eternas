"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido.",
  }),
  phone: z.string().min(10, {
    message: "Por favor ingresa un número de teléfono válido.",
  }),
  address: z.string().min(5, {
    message: "Por favor ingresa una dirección válida.",
  }),
  housingType: z.enum(["house", "apartment", "other"], {
    required_error: "Por favor selecciona un tipo de vivienda.",
  }),
  hasOtherPets: z.boolean().default(false),
  otherPetsDetails: z.string().optional(),
  experience: z
    .string()
    .min(10, {
      message: "Por favor comparte más detalles sobre tu experiencia.",
    })
    .max(500, {
      message: "La respuesta es demasiado larga.",
    }),
  reason: z
    .string()
    .min(10, {
      message: "Por favor comparte más detalles sobre por qué quieres adoptar.",
    })
    .max(500, {
      message: "La respuesta es demasiado larga.",
    }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar los términos y condiciones." }),
  }),
})

export default function AdoptionForm({ petId, petName }: { petId: string; petName: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      housingType: "house",
      hasOtherPets: false,
      otherPetsDetails: "",
      experience: "",
      reason: "",
      termsAccepted: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/adoption-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          petId,
          ...values,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al enviar la solicitud")
      }

      toast({
        title: "Solicitud enviada",
        description: `Tu solicitud para adoptar a ${petName} ha sido recibida. Te contactaremos pronto.`,
      })

      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Hubo un problema al enviar tu solicitud. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulario de Adopción</CardTitle>
        <CardDescription>
          Completa este formulario para iniciar el proceso de adopción de {petName}. Todos los campos son obligatorios a
          menos que se indique lo contrario.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu número de teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu dirección completa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="housingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Vivienda</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="house" />
                        </FormControl>
                        <FormLabel className="font-normal">Casa</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="apartment" />
                        </FormControl>
                        <FormLabel className="font-normal">Apartamento</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="other" />
                        </FormControl>
                        <FormLabel className="font-normal">Otro</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasOtherPets"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>¿Tienes otras mascotas?</FormLabel>
                    <FormDescription>Marca esta casilla si actualmente tienes otras mascotas en casa.</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("hasOtherPets") && (
              <FormField
                control={form.control}
                name="otherPetsDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalles de tus mascotas actuales</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe qué mascotas tienes, sus edades y cómo se comportan con otros animales."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experiencia con mascotas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cuéntanos sobre tu experiencia previa con mascotas."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Comparte cualquier experiencia relevante que tengas con mascotas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Por qué quieres adoptar a {petName}?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explica por qué quieres adoptar a esta mascota y cómo planeas cuidarla."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Términos y Condiciones</FormLabel>
                    <FormDescription>
                      Acepto los términos y condiciones de adopción, incluyendo visitas de seguimiento y compromiso de
                      cuidado responsable.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-navy-800 hover:bg-navy-900" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-gray-500 text-center">
          Todas las solicitudes son revisadas por nuestro equipo. Te contactaremos dentro de 48 horas.
        </p>
      </CardFooter>
    </Card>
  )
}


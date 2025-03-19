"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Mail, Phone, MapPin, Send } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido.",
  }),
  subject: z.string().min(1, {
    message: "Por favor selecciona un asunto.",
  }),
  message: z
    .string()
    .min(10, {
      message: "El mensaje debe tener al menos 10 caracteres.",
    })
    .max(500, {
      message: "El mensaje no puede exceder los 500 caracteres.",
    }),
})

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      console.log("Form submitted:", values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Mensaje enviado",
        description: "Hemos recibido tu mensaje. Te responderemos pronto.",
      })

      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu mensaje. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-navy-900 mb-6 text-center">Contacto</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold text-navy-900 mb-6">Envíanos un mensaje</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
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
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asunto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un asunto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="adopcion">Información sobre adopción</SelectItem>
                        <SelectItem value="donacion">Donaciones</SelectItem>
                        <SelectItem value="voluntariado">Voluntariado</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensaje</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escribe tu mensaje aquí..."
                        className="resize-none min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-navy-900"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Enviar Mensaje
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-navy-900 mb-6">Información de Contacto</h2>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <Mail className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-navy-900">Correo Electrónico</h3>
                <p className="text-gray-600">contacto@patitaseternas.com</p>
                <p className="text-gray-500 text-sm mt-1">Respondemos en un plazo de 24-48 horas.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <Phone className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-navy-900">Teléfono</h3>
                <p className="text-gray-600">+52 (55) 1234-5678</p>
                <p className="text-gray-500 text-sm mt-1">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <MapPin className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-navy-900">Ubicación</h3>
                <p className="text-gray-600">Av. Reforma 123, Col. Centro</p>
                <p className="text-gray-600">Ciudad de México, CP 06000</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-navy-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-navy-900 mb-3">Horario de Atención</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-navy-700">Lunes - Viernes:</span>
                <span className="text-navy-900 font-medium">9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-navy-700">Sábado:</span>
                <span className="text-navy-900 font-medium">10:00 AM - 2:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-navy-700">Domingo:</span>
                <span className="text-navy-900 font-medium">Cerrado</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}


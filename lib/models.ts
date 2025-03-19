import { z } from "zod"

// Esquema para mascotas
export const PetSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  species: z.enum(["dog", "cat"], {
    required_error: "La especie es requerida",
  }),
  breed: z.string().min(1, "La raza es requerida"),
  age: z.number().min(0, "La edad debe ser un número positivo"),
  size: z.enum(["small", "medium", "large"], {
    required_error: "El tamaño es requerido",
  }),
  gender: z.enum(["male", "female"], {
    required_error: "El género es requerido",
  }),
  location: z.string().min(1, "La ubicación es requerida"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  characteristics: z.array(z.string()),
  healthStatus: z.array(z.string()),
  status: z.enum(["available", "pending", "adopted"]).default("available"),
  imageIds: z.array(z.string()).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type Pet = z.infer<typeof PetSchema>

// Esquema para solicitudes de adopción
export const AdoptionApplicationSchema = z.object({
  petId: z.string().min(1, "El ID de la mascota es requerido"),
  userId: z.string().optional(),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor ingresa un correo electrónico válido"),
  phone: z.string().min(10, "Por favor ingresa un número de teléfono válido"),
  address: z.string().min(5, "Por favor ingresa una dirección válida"),
  housingType: z.enum(["house", "apartment", "other"], {
    required_error: "Por favor selecciona un tipo de vivienda",
  }),
  hasOtherPets: z.boolean().default(false),
  otherPetsDetails: z.string().optional(),
  experience: z.string().min(10, "Por favor comparte más detalles sobre tu experiencia"),
  reason: z.string().min(10, "Por favor comparte más detalles sobre por qué quieres adoptar"),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  submittedAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type AdoptionApplication = z.infer<typeof AdoptionApplicationSchema>

// Esquema para usuarios
export const UserSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor ingresa un correo electrónico válido"),
  password: z.string().optional(), // Opcional porque puede autenticarse con proveedores
  image: z.string().optional(),
  role: z.enum(["user", "admin"]).default("user"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type User = z.infer<typeof UserSchema>

// Esquema para donaciones/pagos
export const PaymentSchema = z.object({
  userId: z.string().optional(),
  amount: z.number().min(1, "El monto debe ser mayor a 0"),
  currency: z.string().default("MXN"),
  paymentMethod: z.string(),
  paymentId: z.string(),
  status: z.enum(["pending", "completed", "failed"]).default("pending"),
  description: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type Payment = z.infer<typeof PaymentSchema>


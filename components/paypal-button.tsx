"use client"

import { useState } from "react"
import { PayPalButtons } from "@paypal/react-paypal-js"
import { toast } from "@/hooks/use-toast"

interface PayPalButtonProps {
  amount: number
  description: string
  onSuccess: (details: any) => void
}

export default function PayPalButton({ amount, description, onSuccess }: PayPalButtonProps) {
  const [isPending, setIsPending] = useState(false)

  const createOrder = async () => {
    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          description,
        }),
      })

      const orderData = await response.json()

      if (!response.ok) {
        throw new Error(orderData.message || "Error al crear la orden")
      }

      return orderData.id
    } catch (error) {
      toast({
        title: "Error al crear la orden",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive",
      })
      throw error
    }
  }

  const onApprove = async (data: any, actions: any) => {
    try {
      setIsPending(true)

      // Capturar el pago
      const details = await actions.order.capture()

      // Registrar el pago en nuestro sistema
      const response = await fetch("/api/payments/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: data.orderID,
          paymentId: details.id,
          amount,
          description,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al procesar el pago")
      }

      // Notificar éxito
      toast({
        title: "Pago completado",
        description: "Tu pago se ha procesado correctamente. ¡Gracias por tu donación!",
      })

      // Llamar al callback de éxito
      onSuccess(details)
    } catch (error) {
      toast({
        title: "Error al procesar el pago",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="w-full">
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "rect", label: "donate" }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          toast({
            title: "Error en PayPal",
            description: "Ocurrió un error al procesar el pago con PayPal",
            variant: "destructive",
          })
          console.error("PayPal error:", err)
        }}
        disabled={isPending}
      />
      {isPending && <p className="text-sm text-center text-gray-500 mt-2">Procesando tu pago, por favor espera...</p>}
    </div>
  )
}


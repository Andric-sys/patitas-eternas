import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    // Obtener datos de la solicitud
    const { amount, description } = await req.json()

    // Validar datos
    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "El monto debe ser mayor a 0" }, { status: 400 })
    }

    // Obtener sesión (opcional, para asociar el pago a un usuario)
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Crear orden en PayPal
    const paypalResponse = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "MXN",
              value: amount.toString(),
            },
            description: description || "Donación a Patitas Eternas",
          },
        ],
        application_context: {
          brand_name: "Patitas Eternas",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
        },
      }),
    })

    if (!paypalResponse.ok) {
      const errorData = await paypalResponse.json()
      console.error("Error de PayPal:", errorData)
      return NextResponse.json({ message: "Error al crear la orden en PayPal" }, { status: 500 })
    }

    const paypalData = await paypalResponse.json()

    return NextResponse.json({
      id: paypalData.id,
      status: paypalData.status,
    })
  } catch (error) {
    console.error("Error al crear orden:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}


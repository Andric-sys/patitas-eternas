import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { insertOne } from "@/lib/db"
import { PaymentSchema } from "@/lib/models"

export async function POST(req: NextRequest) {
  try {
    // Obtener datos de la solicitud
    const { orderId, paymentId, amount, description } = await req.json()

    // Validar datos
    if (!orderId || !paymentId || !amount) {
      return NextResponse.json({ message: "Faltan datos requeridos" }, { status: 400 })
    }

    // Obtener sesión (opcional, para asociar el pago a un usuario)
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Validar el pago con PayPal (opcional, ya que onApprove ya lo capturó)
    const paypalResponse = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64")}`,
      },
    })

    if (!paypalResponse.ok) {
      const errorData = await paypalResponse.json()
      console.error("Error de PayPal:", errorData)
      return NextResponse.json({ message: "Error al verificar el pago con PayPal" }, { status: 500 })
    }

    const paypalData = await paypalResponse.json()

    if (paypalData.status !== "COMPLETED" && paypalData.status !== "APPROVED") {
      return NextResponse.json({ message: "El pago no ha sido completado en PayPal" }, { status: 400 })
    }

    // Crear registro de pago en nuestra base de datos
    const payment = {
      userId: userId || null,
      amount: Number.parseFloat(amount),
      currency: "MXN",
      paymentMethod: "paypal",
      paymentId,
      orderId,
      status: "completed",
      description: description || "Donación a Patitas Eternas",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Validar con Zod
    const validatedPayment = PaymentSchema.parse(payment)

    // Guardar en la base de datos
    const { insertedId } = await insertOne("payments", validatedPayment)

    return NextResponse.json({
      message: "Pago registrado exitosamente",
      paymentId: insertedId.toString(),
    })
  } catch (error) {
    console.error("Error al capturar pago:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}


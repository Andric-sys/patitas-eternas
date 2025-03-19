"use client"

import type { ReactNode } from "react"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"

interface PayPalProviderProps {
  children: ReactNode
}

export default function PayPalProvider({ children }: PayPalProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""

  return (
    <PayPalScriptProvider
      options={{
        "client-id": clientId,
        currency: "MXN",
        intent: "capture",
      }}
    >
      {children}
    </PayPalScriptProvider>
  )
}


"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PawPrint, Heart, DollarSign } from "lucide-react"
import PayPalButton from "@/components/paypal-button"
import PayPalProvider from "@/components/paypal-provider"

const DONATION_AMOUNTS = [100, 200, 500, 1000]

export default function DonatePage() {
  const { data: session } = useSession()
  const [customAmount, setCustomAmount] = useState("")
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [donationDescription, setDonationDescription] = useState("")
  const [donationComplete, setDonationComplete] = useState(false)

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Solo permitir números
    if (/^\d*$/.test(value)) {
      setCustomAmount(value)
      setSelectedAmount(null)
    }
  }

  const finalAmount = selectedAmount || (customAmount ? Number.parseInt(customAmount) : 0)

  const handleDonationSuccess = () => {
    setDonationComplete(true)
    setSelectedAmount(null)
    setCustomAmount("")
    setDonationDescription("")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 p-4 rounded-full">
              <Heart className="h-10 w-10 text-yellow-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Apoya Nuestra Misión</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Tu donación ayuda a rescatar, cuidar y encontrar hogares para mascotas abandonadas. Cada peso marca la
            diferencia en la vida de un animal necesitado.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Haz una Donación</CardTitle>
            <CardDescription>Elige un monto o ingresa una cantidad personalizada</CardDescription>
          </CardHeader>
          <CardContent>
            {donationComplete ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-4 rounded-full">
                    <PawPrint className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">¡Gracias por tu donación!</h3>
                <p className="text-gray-600 mb-6">Tu generosidad nos ayuda a seguir rescatando y cuidando mascotas.</p>
                <Button onClick={() => setDonationComplete(false)} className="bg-navy-800 hover:bg-navy-900">
                  Realizar otra donación
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="amount" className="mb-2 block">
                    Selecciona un monto (MXN)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {DONATION_AMOUNTS.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={selectedAmount === amount ? "default" : "outline"}
                        className={selectedAmount === amount ? "bg-navy-800 hover:bg-navy-900" : ""}
                        onClick={() => handleAmountSelect(amount)}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  <div className="relative mt-4">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="customAmount"
                      placeholder="Otra cantidad"
                      className="pl-10"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="mb-2 block">
                    Mensaje (opcional)
                  </Label>
                  <Input
                    id="description"
                    placeholder="Escribe un mensaje para tu donación"
                    value={donationDescription}
                    onChange={(e) => setDonationDescription(e.target.value)}
                  />
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">Método de pago</h3>
                  <Tabs defaultValue="paypal">
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="paypal" className="flex-1">
                        PayPal
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="paypal">
                      {finalAmount > 0 ? (
                        <PayPalProvider>
                          <PayPalButton
                            amount={finalAmount}
                            description={donationDescription || "Donación a Patitas Eternas"}
                            onSuccess={handleDonationSuccess}
                          />
                        </PayPalProvider>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          Por favor selecciona o ingresa un monto para continuar
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-gray-500 text-center max-w-md">
              Todas las donaciones son utilizadas para el rescate, atención médica, alimentación y cuidado de mascotas
              abandonadas.
            </p>
          </CardFooter>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <PawPrint className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">Rescate</h3>
                <p className="text-gray-600 text-sm">
                  Ayudamos a rescatar mascotas abandonadas y en situación de calle.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">Cuidado</h3>
                <p className="text-gray-600 text-sm">
                  Proporcionamos atención médica, alimentación y refugio temporal.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">Transparencia</h3>
                <p className="text-gray-600 text-sm">Publicamos informes mensuales sobre el uso de las donaciones.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


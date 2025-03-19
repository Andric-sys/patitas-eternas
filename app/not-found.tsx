"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
//import { Suspense } from "react"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-navy-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-navy-800 mb-6">Página no encontrada</h2>
      <p className="text-gray-600 max-w-md mb-8">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Suspense fallback={<Button variant="default">Volver al inicio</Button>}>
        <Button asChild className="bg-navy-800 hover:bg-navy-900">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
      </Suspense>
    </div>
  )
}


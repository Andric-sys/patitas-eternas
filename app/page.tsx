import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PawPrint, Search, Info, Mail } from "lucide-react"
import FeaturedPets from "@/components/featured-pets"
import HowItWorks from "@/components/how-it-works"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/placeholder.svg?height=600&width=1200')",
              backgroundPosition: "center 40%",
            }}
          >
            <div className="absolute inset-0 bg-navy-900/70"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 z-10 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Encuentra un amigo para toda la vida</h1>
            <p className="text-xl mb-8">
              Patitas Eternas conecta mascotas en busca de un hogar con adoptantes responsables.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-navy-900 font-semibold">
                <Link href="/mascotas">
                  <Search className="mr-2 h-5 w-5" />
                  Buscar Mascotas
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/sobre-nosotros">
                  <Info className="mr-2 h-5 w-5" />
                  Conoce Más
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-2">Mascotas Destacadas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Estas adorables mascotas están esperando encontrar un hogar amoroso. ¡Conócelas!
            </p>
          </div>
          <FeaturedPets />
          <div className="text-center mt-10">
            <Button asChild size="lg" className="bg-navy-800 hover:bg-navy-900 text-white">
              <Link href="/mascotas">Ver Todas las Mascotas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-2">¿Cómo Funciona?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Adoptar una mascota con Patitas Eternas es un proceso simple y seguro.
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">¿Listo para cambiar una vida?</h2>
          <p className="text-navy-800 max-w-2xl mx-auto mb-8">
            Cada adopción es una nueva oportunidad para una mascota y una familia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-navy-800 hover:bg-navy-900 text-white">
              <Link href="/mascotas">
                <PawPrint className="mr-2 h-5 w-5" />
                Adoptar
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-navy-800 text-navy-800 hover:bg-navy-800/10">
              <Link href="/contacto">
                <Mail className="mr-2 h-5 w-5" />
                Contactar
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}


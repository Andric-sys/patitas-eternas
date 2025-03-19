import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, Users, Shield, PawPrint } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-navy-900 mb-6 text-center">Sobre Nosotros</h1>

        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
          <Image
            src="/placeholder.svg?height=400&width=1000"
            alt="Equipo de Patitas Eternas"
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <h2 className="text-2xl font-bold text-navy-900">Nuestra Misión</h2>
          <p>
            En Patitas Eternas, nuestra misión es conectar a mascotas abandonadas con familias amorosas, promoviendo la
            adopción responsable y el bienestar animal. Creemos que cada mascota merece un hogar donde sea querida y
            cuidada adecuadamente.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8">Nuestra Historia</h2>
          <p>
            Patitas Eternas nació en 2020 como respuesta a la creciente cantidad de animales abandonados en nuestras
            comunidades. Un grupo de amantes de los animales decidió crear una plataforma que facilitara el proceso de
            adopción, haciendo más sencillo para las personas encontrar a su compañero perfecto y para las mascotas
            encontrar un hogar permanente.
          </p>
          <p>
            Desde entonces, hemos ayudado a más de 500 perros y gatos a encontrar familias amorosas, y continuamos
            trabajando incansablemente para reducir el número de animales sin hogar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-navy-900 mb-2">Amor</h3>
            <p className="text-gray-600">
              Actuamos con amor y compasión hacia todos los animales, reconociendo su valor intrínseco.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-navy-900 mb-2">Responsabilidad</h3>
            <p className="text-gray-600">
              Promovemos la tenencia responsable de mascotas y el compromiso a largo plazo.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-navy-900 mb-2">Comunidad</h3>
            <p className="text-gray-600">
              Construimos una comunidad de adoptantes y voluntarios comprometidos con el bienestar animal.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <PawPrint className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-navy-900 mb-2">Educación</h3>
            <p className="text-gray-600">
              Educamos sobre la importancia de la adopción y el cuidado adecuado de las mascotas.
            </p>
          </div>
        </div>

        <div className="bg-navy-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">¿Quieres ser parte de nuestra misión?</h2>
          <p className="text-navy-700 mb-6">Hay muchas formas de ayudar: adoptar, apadrinar, donar o ser voluntario.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-navy-900">
              <a href="/contacto">Contáctanos</a>
            </Button>
            <Button asChild variant="outline" className="border-navy-800 text-navy-800 hover:bg-navy-800/10">
              <a href="/donar">Donar</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


import { Search, ClipboardCheck, Heart, Home } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-yellow-500" />,
      title: "Busca",
      description: "Explora nuestro catálogo de mascotas y utiliza filtros para encontrar tu compañero ideal.",
    },
    {
      icon: <ClipboardCheck className="h-10 w-10 text-yellow-500" />,
      title: "Solicita",
      description: "Completa un formulario de solicitud para iniciar el proceso de adopción.",
    },
    {
      icon: <Heart className="h-10 w-10 text-yellow-500" />,
      title: "Conoce",
      description: "Coordina una visita para conocer a tu futura mascota y asegurarte de que es una buena conexión.",
    },
    {
      icon: <Home className="h-10 w-10 text-yellow-500" />,
      title: "Adopta",
      description: "Finaliza el proceso y dale la bienvenida a tu nuevo miembro de la familia.",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-navy-50 flex items-center justify-center mb-4">{step.icon}</div>
          <h3 className="text-xl font-semibold text-navy-900 mb-2">{step.title}</h3>
          <p className="text-gray-600">{step.description}</p>
        </div>
      ))}
    </div>
  )
}


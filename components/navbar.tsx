"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { PawPrint, Menu, X, User } from "lucide-react"
// Importar useSession
import { useSession } from "next-auth/react"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const routes = [
    { href: "/", label: "Inicio" },
    { href: "/mascotas", label: "Mascotas" },
    { href: "/sobre-nosotros", label: "Sobre Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ]

  // Agregar dentro del componente Navbar, antes del return:
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <PawPrint className="h-6 w-6 text-yellow-500" />
              <span className="text-xl font-bold text-navy-900">Patitas Eternas</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-navy-900 ${
                  pathname === route.href ? "text-navy-900" : "text-gray-600"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          {/* Reemplazar el DropdownMenu en la sección de navegación de escritorio con: */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {session ? (
                    session.user.image ? (
                      <img
                        src={session.user.image || "/placeholder.svg"}
                        alt={session.user.name || "Usuario"}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {session ? (
                  <>
                    <DropdownMenuLabel>{session.user.name || "Usuario"}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/perfil">Mi Perfil</Link>
                    </DropdownMenuItem>
                    {session.user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Panel de Administración</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/api/auth/signout">Cerrar Sesión</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login">Iniciar Sesión</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register">Registrarse</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-navy-900">
              <Link href="/mascotas">Adoptar</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6 text-navy-900" /> : <Menu className="h-6 w-6 text-navy-900" />}
          </button>
        </div>
      </div>

      {/* También actualizar la sección de navegación móvil para incluir enlaces de autenticación: */}
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`text-sm font-medium transition-colors hover:text-navy-900 ${
                    pathname === route.href ? "text-navy-900" : "text-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {route.label}
                </Link>
              ))}

              {session ? (
                <>
                  <Link
                    href="/perfil"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-navy-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  {session.user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-gray-600 transition-colors hover:text-navy-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Panel de Administración
                    </Link>
                  )}
                  <Link
                    href="/api/auth/signout"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-navy-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cerrar Sesión
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-navy-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-navy-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
            <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-navy-900">
              <Link href="/mascotas" onClick={() => setIsMenuOpen(false)}>
                Adoptar
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}


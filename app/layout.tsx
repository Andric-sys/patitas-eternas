import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Analytics from "@/components/analytics"

// Importar los proveedores necesarios
import { SessionProvider } from "next-auth/react"
import PayPalProvider from "@/components/paypal-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Patitas Eternas - Plataforma de Adopción de Mascotas",
  description: "Conectamos mascotas en busca de un hogar con adoptantes responsables.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://patitaseternas.vercel.app"),
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    title: "Patitas Eternas - Adopta una mascota",
    description:
      "Plataforma de adopción de mascotas que conecta animales en busca de un hogar con adoptantes responsables",
    siteName: "Patitas Eternas",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Patitas Eternas - Adopción de mascotas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patitas Eternas - Adopta una mascota",
    description:
      "Plataforma de adopción de mascotas que conecta animales en busca de un hogar con adoptantes responsables",
    images: ["/og-image.jpg"],
  },
    generator: 'v0.dev'
}

// Modificar el componente RootLayout para incluir los proveedores
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <PayPalProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </PayPalProvider>
          </ThemeProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}



import './globals.css'
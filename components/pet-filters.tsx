"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Filter, X } from "lucide-react"

export default function PetFilters() {
  const router = useRouter()

  const SearchParamsWrapper = () => {
    const searchParams = useSearchParams()
    return searchParams
  }

  const [species, setSpecies] = useState<string[]>([])

  // Usa un efecto para inicializar species después del renderizado
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const speciesParam = params.get("species") || ""
    if (speciesParam) {
      setSpecies([speciesParam])
    }
  }, [])

  const [size, setSize] = useState<string>(new URLSearchParams(window.location.search).get("size") || "")
  const [age, setAge] = useState<number[]>([0, 15])
  const [expanded, setExpanded] = useState(true)

  const handleSpeciesChange = (value: string) => {
    setSpecies((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (species.length > 0) {
      species.forEach((s) => params.append("species", s))
    }

    if (size) {
      params.set("size", size)
    }

    if (age[0] > 0 || age[1] < 15) {
      params.set("minAge", age[0].toString())
      params.set("maxAge", age[1].toString())
    }

    router.push(`/mascotas?${params.toString()}`)
  }

  const resetFilters = () => {
    setSpecies([])
    setSize("")
    setAge([0, 15])
    router.push("/mascotas")
  }

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Filter className="mr-2 h-5 w-5" /> Filtros
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 lg:hidden" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Ocultar" : "Mostrar"}
          </Button>
        </div>
      </CardHeader>

      <div className={expanded ? "block" : "hidden lg:block"}>
        <CardContent className="pt-2">
          <Accordion type="multiple" defaultValue={["species", "size", "age"]} className="w-full">
            <AccordionItem value="species">
              <AccordionTrigger>Especie</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dog"
                      checked={species.includes("dog")}
                      onCheckedChange={() => handleSpeciesChange("dog")}
                    />
                    <Label htmlFor="dog">Perros</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cat"
                      checked={species.includes("cat")}
                      onCheckedChange={() => handleSpeciesChange("cat")}
                    />
                    <Label htmlFor="cat">Gatos</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="size">
              <AccordionTrigger>Tamaño</AccordionTrigger>
              <AccordionContent>
                <RadioGroup value={size} onValueChange={setSize}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small">Pequeño</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Mediano</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large">Grande</Label>
                  </div>
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="age">
              <AccordionTrigger>Edad</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Slider defaultValue={[0, 15]} max={15} step={1} value={age} onValueChange={setAge} />
                  <div className="flex justify-between text-sm">
                    <span>{age[0]} años</span>
                    <span>{age[1]} años</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex flex-col space-y-2 mt-6">
            <Button onClick={applyFilters} className="bg-navy-800 hover:bg-navy-900">
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={resetFilters} className="border-gray-300 text-gray-700">
              <X className="mr-2 h-4 w-4" /> Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}


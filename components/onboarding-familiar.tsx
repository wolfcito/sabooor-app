"use client"

import type React from "react"

import { useState } from "react"
import { Minus, Plus, X, Loader2, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { saveFamilyData } from "@/app/actions"

type FamilyMember = {
  id: string
  type: "mama" | "papa" | "adolescente" | "nino"
  count: number
}

type Restriction = {
  id: string
  name: string
  checked: boolean
}

export function OnboardingFamiliar() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "1", type: "mama", count: 1 },
    { id: "2", type: "papa", count: 1 },
    { id: "3", type: "adolescente", count: 0 },
    { id: "4", type: "nino", count: 0 },
  ])

  const [restrictions, setRestrictions] = useState<Restriction[]>([
    { id: "1", name: "Lácteos", checked: false },
    { id: "2", name: "Gluten", checked: false },
    { id: "3", name: "Frutos Secos", checked: false },
    { id: "4", name: "Mariscos", checked: false },
    { id: "5", name: "Huevo", checked: false },
    { id: "6", name: "Soya", checked: false },
    { id: "7", name: "Vegetariano", checked: false },
    { id: "8", name: "Carnes", checked: true },
    { id: "9", name: "Vegano", checked: false },
  ])

  const [prohibitedDishes, setProhibitedDishes] = useState<string[]>([])
  const [newDish, setNewDish] = useState("")

  const updateMemberCount = (id: string, increment: boolean) => {
    setFamilyMembers(
      familyMembers.map((member) => {
        if (member.id === id) {
          const newCount = increment ? member.count + 1 : Math.max(0, member.count - 1)
          return { ...member, count: newCount }
        }
        return member
      }),
    )
  }

  const toggleRestriction = (id: string) => {
    setRestrictions(
      restrictions.map((restriction) => {
        if (restriction.id === id) {
          return { ...restriction, checked: !restriction.checked }
        }
        return restriction
      }),
    )
  }

  const addProhibitedDish = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newDish.trim()) {
      setProhibitedDishes([...prohibitedDishes, newDish.trim()])
      setNewDish("")
      e.preventDefault()
    }
  }

  const removeProhibitedDish = (dish: string) => {
    setProhibitedDishes(prohibitedDishes.filter((d) => d !== dish))
  }

  const getMemberIcon = (type: string) => {
    switch (type) {
      case "mama":
        return "/placeholder.svg?height=48&width=48"
      case "papa":
        return "/placeholder.svg?height=48&width=48"
      case "adolescente":
        return "/placeholder.svg?height=48&width=48"
      case "nino":
        return "/placeholder.svg?height=48&width=48"
      default:
        return "/placeholder.svg?height=48&width=48"
    }
  }

  const getMemberLabel = (type: string) => {
    switch (type) {
      case "mama":
        return "Mamá"
      case "papa":
        return "Papá"
      case "adolescente":
        return "Adolescente"
      case "nino":
        return "Niño"
      default:
        return type
    }
  }

  const handleSaveAndContinue = async () => {
    setIsLoading(true)

    try {
      // Guardar datos en Supabase y procesar con OpenAI
      await saveFamilyData(familyMembers, restrictions, prohibitedDishes)

      // Redirigir al dashboard
      router.push("/")
    } catch (error) {
      console.error("Error saving family data:", error)
      // En caso de error, también redirigimos al dashboard
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Atrás</span>
        </Button>
        <h1 className="text-xl font-medium ml-2">Mis gustos</h1>
      </header>


      {/* Body */}
      <div className="flex-1 p-4 overflow-auto">
        {/* Selector de integrantes */}
        <section className="mb-6">
          <h2 className="text-lg font-medium mb-4">Integrantes de la familia</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {familyMembers.map((member) => (
              <div key={member.id} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mb-2">
                  <Image
                    src={getMemberIcon(member.type) || "/placeholder.svg"}
                    alt={getMemberLabel(member.type)}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <span className="text-sm mb-2">{getMemberLabel(member.type)}</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateMemberCount(member.id, false)}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Disminuir</span>
                  </Button>
                  <span className="w-8 text-center">{member.count}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateMemberCount(member.id, true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Aumentar</span>
                  </Button>
                </div>
                <span className="text-xs mt-1">Cantidad</span>
              </div>
            ))}
          </div>
        </section>

        {/* Restricciones y alergias */}
        <section className="mb-6">
          <h2 className="text-lg font-medium mb-4">Restricciones y alergias</h2>
          <div className="grid grid-cols-2 gap-y-3">
            {restrictions.map((restriction) => (
              <div key={restriction.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`restriction-${restriction.id}`}
                  checked={restriction.checked}
                  onCheckedChange={() => toggleRestriction(restriction.id)}
                />
                <Label htmlFor={`restriction-${restriction.id}`} className="text-base">
                  {restriction.name}
                </Label>
              </div>
            ))}
          </div>
        </section>

        {/* Platillos prohibidos */}
        <section className="mb-6">
          <h2 className="text-lg font-medium mb-4">Platillos prohibidos</h2>
          <div className="space-y-4">
            <Input
              placeholder="Escribe y presiona Enter"
              value={newDish}
              onChange={(e) => setNewDish(e.target.value)}
              onKeyDown={addProhibitedDish}
              className="w-full"
            />
            <div className="flex flex-wrap gap-2">
              {prohibitedDishes.map((dish, index) => (
                <div key={index} className="flex items-center bg-slate-100 rounded-full px-3 py-1">
                  <span className="text-sm mr-1">{dish}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0"
                    onClick={() => removeProhibitedDish(dish)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="p-4 border-t">
        <Button className="w-full h-12" onClick={handleSaveAndContinue} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar y continuar"
          )}
        </Button>
      </footer>
    </div>
  )
}

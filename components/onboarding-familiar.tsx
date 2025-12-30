"use client"

import type React from "react"
import { useState } from "react"
import { Minus, Plus, X, Loader2, ArrowLeft, ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { saveFamilyData } from "@/app/actions"

type FamilyMember = {
  id: string
  type: "mama" | "papa" | "adolescente" | "nino"
  count: number
}

type DietOption = {
  id: string
  name: string
  selected: boolean
}

export function OnboardingFamiliar() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep] = useState(2)

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "1", type: "mama", count: 1 },
    { id: "2", type: "papa", count: 1 },
    { id: "3", type: "adolescente", count: 0 },
    { id: "4", type: "nino", count: 0 },
  ])

  const [dietOptions, setDietOptions] = useState<DietOption[]>([
    { id: "1", name: "Sin gluten", selected: false },
    { id: "2", name: "Vegetariano", selected: true },
    { id: "3", name: "Vegano", selected: false },
    { id: "4", name: "Sin lácteos", selected: false },
    { id: "5", name: "Sin nueces", selected: false },
  ])

  const [avoidedIngredients, setAvoidedIngredients] = useState<string[]>(["Hígado", "Picante"])
  const [ingredientSearch, setIngredientSearch] = useState("")

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

  const toggleDietOption = (id: string) => {
    setDietOptions(
      dietOptions.map((option) => {
        if (option.id === id) {
          return { ...option, selected: !option.selected }
        }
        return option
      }),
    )
  }

  const addIngredient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && ingredientSearch.trim()) {
      if (!avoidedIngredients.includes(ingredientSearch.trim())) {
        setAvoidedIngredients([...avoidedIngredients, ingredientSearch.trim()])
      }
      setIngredientSearch("")
      e.preventDefault()
    }
  }

  const removeIngredient = (ingredient: string) => {
    setAvoidedIngredients(avoidedIngredients.filter((i) => i !== ingredient))
  }

  const getMemberIcon = (type: string) => {
    switch (type) {
      case "mama":
        return "bg-orange-100 text-orange-500"
      case "papa":
        return "bg-orange-100 text-orange-500"
      case "adolescente":
        return "bg-blue-100 text-blue-500"
      case "nino":
        return "bg-blue-100 text-blue-500"
      default:
        return "bg-gray-100 text-gray-500"
    }
  }

  const getMemberEmoji = (type: string) => {
    switch (type) {
      case "mama":
        return "👩"
      case "papa":
        return "👨"
      case "adolescente":
        return "🧑"
      case "nino":
        return "👶"
      default:
        return "👤"
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
      const restrictions = dietOptions
        .filter(d => d.selected)
        .map((d, i) => ({ id: String(i + 1), name: d.name, checked: true }))

      await saveFamilyData(familyMembers, restrictions, avoidedIngredients)
      router.push("/")
    } catch (error) {
      console.error("Error saving family data:", error)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold flex-1 text-center mr-10">Mis gustos</h1>
      </header>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-2 rounded-full transition-all ${
              step === currentStep ? "w-6 bg-primary" : "w-2 bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Body */}
      <main className="flex-1 px-4 overflow-auto pb-24">
        {/* Title Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Configuremos tu hogar</h2>
          <p className="text-muted-foreground">
            Para recomendarte lo mejor, necesitamos saber quiénes comerán y qué evitar.
          </p>
        </div>

        {/* Family Members Section */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4">¿Quiénes comen en casa?</h3>
          <div className="space-y-3">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-card rounded-2xl p-4 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-lg ${getMemberIcon(member.type)}`}>
                    {getMemberEmoji(member.type)}
                  </div>
                  <span className="font-medium text-foreground">{getMemberLabel(member.type)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateMemberCount(member.id, false)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className={`w-8 text-center font-medium ${member.count > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {member.count}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full ${member.count > 0 ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
                    onClick={() => updateMemberCount(member.id, true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Diet Options Section */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4">¿Alguna alergia o dieta especial?</h3>
          <div className="flex flex-wrap gap-2">
            {dietOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleDietOption(option.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  option.selected
                    ? "bg-primary text-white"
                    : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        </section>

        {/* Avoided Ingredients Section */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4">¿Qué ingredientes evitamos?</h3>
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Escribe aquí, ej. Cebolla..."
              value={ingredientSearch}
              onChange={(e) => setIngredientSearch(e.target.value)}
              onKeyDown={addIngredient}
              className="h-12 pl-12 rounded-2xl bg-card border-border"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {avoidedIngredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-green-50 text-green-700 rounded-full px-3 py-1.5"
              >
                <span className="text-sm font-medium">{ingredient}</span>
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-green-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background">
        <Button
          className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-semibold text-base"
          onClick={handleSaveAndContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              Guardar y continuar
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </footer>
    </div>
  )
}

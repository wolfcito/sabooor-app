"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Loader2, Clock, Users, ChevronDown, ChevronUp, Calendar, Maximize2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClientSupabaseClient } from "@/lib/supabase"
import { generateMenu } from "@/app/actions"
import { BottomNavigation } from "@/components/bottom-navigation"

type MealDay = {
  id: string
  day: string
  recipe: string
  protein: string
  side: string
}

type RecipeData = {
  name: string
  description: string
  cookingTime: number
  servings: number
  difficulty: string
  ingredients: { name: string; quantity: string; unit: string }[]
}

const dayNames: Record<string, string> = {
  "Lun": "Lunes",
  "Mar": "Martes",
  "Mié": "Miércoles",
  "Jue": "Jueves",
  "Vie": "Viernes",
  "Sáb": "Sábado",
  "Dom": "Domingo",
}

export function MenuSemanal() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [weekMenu, setWeekMenu] = useState<MealDay[]>([])
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const supabase = createClientSupabaseClient()
        const { data, error } = await supabase.from("weekly_menu").select("*")

        if (error) throw error

        if (data && data.length > 0) {
          setWeekMenu(data)
        } else {
          setWeekMenu([
            { id: "1", day: "Lun", recipe: JSON.stringify({ name: "Pollo al horno", description: "Delicioso pollo con hierbas", cookingTime: 45, servings: 4, difficulty: "Fácil", ingredients: [] }), protein: "Pollo", side: "Verduras" },
            { id: "2", day: "Mar", recipe: JSON.stringify({ name: "Pasta con albóndigas", description: "Pasta casera con salsa", cookingTime: 30, servings: 4, difficulty: "Media", ingredients: [] }), protein: "Carne", side: "Pasta" },
            { id: "3", day: "Mié", recipe: JSON.stringify({ name: "Pescado a la plancha", description: "Pescado fresco con limón", cookingTime: 20, servings: 3, difficulty: "Fácil", ingredients: [] }), protein: "Pescado", side: "Arroz" },
            { id: "4", day: "Jue", recipe: JSON.stringify({ name: "Tacos de carnitas", description: "Tacos mexicanos tradicionales", cookingTime: 60, servings: 4, difficulty: "Media", ingredients: [] }), protein: "Cerdo", side: "Tortillas" },
          ])
        }
      } catch (error) {
        console.error("Error fetching menu:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenu()
  }, [])

  const handleGenerateMenu = async () => {
    setIsGenerating(true)
    try {
      const result = await generateMenu()
      if (result.success && result.weeklyMenu) {
        setWeekMenu(result.weeklyMenu)
      }
    } catch (error) {
      console.error("Error generating menu:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCards(newExpanded)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "fácil":
        return "bg-green-100 text-green-700"
      case "media":
        return "bg-yellow-100 text-yellow-700"
      case "difícil":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getCurrentWeekRange = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const monday = new Date(now)
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    return `Semana del ${monday.getDate()} - ${sunday.getDate()} ${months[sunday.getMonth()]}`
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Cargando menú...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-foreground">Tu Menú Semanal</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGenerateMenu}
            disabled={isGenerating}
            className="text-primary"
          >
            <RefreshCw className={`h-6 w-6 ${isGenerating ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <span className="font-medium">{getCurrentWeekRange()}</span>
          <Calendar className="h-5 w-5" />
        </div>
      </header>

      {/* Menu List */}
      <main className="flex-1 px-4 pb-32 overflow-auto">
        {weekMenu.map((day, index) => {
          let recipeData: RecipeData
          try {
            recipeData = JSON.parse(day.recipe)
          } catch {
            recipeData = { name: day.recipe, description: "", cookingTime: 0, servings: 0, difficulty: "", ingredients: [] }
          }

          const isExpanded = expandedCards.has(day.id)
          const isToday = index === 0

          return (
            <div key={day.id} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-foreground">{dayNames[day.day] || day.day}</h2>
                {isToday && <div className="h-3 w-3 rounded-full bg-primary" />}
              </div>

              <Card className="rounded-2xl border-border overflow-hidden">
                <div className="flex p-3">
                  {/* Recipe Image */}
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <span className="text-4xl">🍲</span>
                  </div>

                  {/* Recipe Info */}
                  <div className="flex-1 ml-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground line-clamp-1 flex-1">{recipeData.name}</h3>
                      <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1">
                        <Maximize2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{recipeData.cookingTime}m</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{recipeData.servings}</span>
                      </div>
                      <Badge className={`text-xs ${getDifficultyColor(recipeData.difficulty)}`}>
                        {recipeData.difficulty || "Fácil"}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2">
                      {day.protein} {day.side && `• ${day.side}`}
                    </p>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && recipeData.ingredients && recipeData.ingredients.length > 0 && (
                  <div className="px-3 pb-3 border-t border-border pt-3">
                    <h4 className="font-medium text-sm mb-2">Ingredientes:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {recipeData.ingredients.slice(0, 5).map((ing, i) => (
                        <li key={i}>• {ing.name} - {ing.quantity} {ing.unit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ver más button */}
                <button
                  onClick={() => toggleExpand(day.id)}
                  className="w-full py-2 text-primary text-sm font-medium flex items-center justify-center gap-1 border-t border-border"
                >
                  {isExpanded ? (
                    <>Ver menos <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>Ver más <ChevronDown className="h-4 w-4" /></>
                  )}
                </button>
              </Card>
            </div>
          )
        })}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2">
        <Button
          className="h-12 px-6 rounded-full bg-primary hover:bg-primary/90 text-white font-medium shadow-lg"
          onClick={() => router.push("/lista-compra")}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Generar lista
        </Button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

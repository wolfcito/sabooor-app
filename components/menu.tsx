"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Loader2, Clock, Users, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientSupabaseClient } from "@/lib/supabase"
import { generateWeeklyMenu } from "@/lib/openai"

type Recipe = {
  name: string
  description: string
  ingredients: {
    name: string
    quantity: string
    unit: string
  }[]
  instructions: string[]
  cookingTime: string
  servings: string
  difficulty: string
  nutritionalInfo: {
    calories: string
    protein: string
    carbs: string
    fat: string
  }
}

type MenuItem = {
  day: string
  recipe: Recipe
  protein: string
  side: string
}

export function Menu() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [weeklyMenu, setWeeklyMenu] = useState<MenuItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClientSupabaseClient()

        // Obtener menú semanal
        const { data: menuData, error: menuError } = await supabase
          .from("weekly_menu")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)

        if (menuError) {
          throw menuError
        }

        if (menuData && menuData.length > 0) {
          setWeeklyMenu(menuData[0].menu_items)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleGenerateMenu = async () => {
    setIsGenerating(true)

    try {
      // Obtener datos necesarios para generar el menú
      const supabase = createClientSupabaseClient()
      
      const { data: familyData } = await supabase.from("family_members").select("*")
      const { data: restrictionsData } = await supabase.from("restrictions").select("*")
      const { data: productsData } = await supabase.from("products").select("*")
      
      // Generar menú con OpenAI
      const result = await generateWeeklyMenu(
        familyData || [],
        restrictionsData || [],
        [], // TODO: Implementar platos prohibidos
        productsData || []
      )

      if (result.weeklyMenu) {
        setWeeklyMenu(result.weeklyMenu)
        
        // Guardar en Supabase
        await supabase.from("weekly_menu").insert({
          menu_items: result.weeklyMenu,
          created_at: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error("Error generating menu:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Cargando menú...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Atrás</span>
        </Button>
        <h1 className="text-xl font-medium ml-2">Menú Semanal</h1>
      </header>

      {/* Body */}
      <main className="flex-1 p-4">
        <Button className="w-full mb-4" onClick={handleGenerateMenu} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando menú...
            </>
          ) : (
            "Generar nuevo menú"
          )}
        </Button>

        <div className="space-y-6">
          {weeklyMenu.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">{item.day}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Receta principal */}
                  <div>
                    <h3 className="font-medium text-lg mb-2">{item.recipe.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">{item.recipe.description}</p>
                    
                    <div className="flex gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {item.recipe.cookingTime} min
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <Users className="h-4 w-4 mr-1" />
                        {item.recipe.servings} porciones
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <ChefHat className="h-4 w-4 mr-1" />
                        {item.recipe.difficulty}
                      </div>
                    </div>

                    {/* Ingredientes */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Ingredientes</h4>
                      <ul className="list-disc pl-5 text-sm">
                        {item.recipe.ingredients.map((ingredient, idx) => (
                          <li key={idx}>
                            {ingredient.quantity} {ingredient.unit} de {ingredient.name}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Instrucciones */}
                    <div>
                      <h4 className="font-medium mb-2">Preparación</h4>
                      <ol className="list-decimal pl-5 text-sm">
                        {item.recipe.instructions.map((instruction, idx) => (
                          <li key={idx} className="mb-2">{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Información nutricional */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Información nutricional por porción</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Calorías: {item.recipe.nutritionalInfo.calories}</div>
                      <div>Proteínas: {item.recipe.nutritionalInfo.protein}g</div>
                      <div>Carbohidratos: {item.recipe.nutritionalInfo.carbs}g</div>
                      <div>Grasas: {item.recipe.nutritionalInfo.fat}g</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
} 
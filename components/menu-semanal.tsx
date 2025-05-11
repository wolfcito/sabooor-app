"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Drumstick, Carrot, Loader2, Clock, Flame, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { createClientSupabaseClient } from "@/lib/supabase"
import { generateMenu } from "@/app/actions"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

type MealDay = {
  id: string
  day: string
  recipe: string
  protein: string
  side: string
}

export function MenuSemanal() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [weekMenu, setWeekMenu] = useState<MealDay[]>([])

  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const toggleExpand = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index)
  }
  console.log({weekMenu})

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const supabase = createClientSupabaseClient()
        const { data, error } = await supabase.from("weekly_menu").select("*")

        if (error) {
          throw error
        }

        if (data && data.length > 0) {
          setWeekMenu(
            data.map((item) => ({
              id: item.id,
              day: item.day,
              recipe: item.recipe,
              protein: item.protein,
              side: item.side,
            })),
          )
        } else {
          // Si no hay datos, generamos un menú por defecto
          setWeekMenu([
            { id: "1", day: "Lun", recipe: "Pollo al horno", protein: "Pollo", side: "Verduras mixtas" },
            { id: "2", day: "Mar", recipe: "Pasta con albóndigas", protein: "Carne molida", side: "Pasta" },
            { id: "3", day: "Mié", recipe: "Pescado a la plancha", protein: "Pescado", side: "Arroz" },
            { id: "4", day: "Jue", recipe: "Tacos de carnitas", protein: "Cerdo", side: "Tortillas" },
            { id: "5", day: "Vie", recipe: "Pizza casera", protein: "Queso", side: "Masa" },
            { id: "6", day: "Sáb", recipe: "Hamburguesas", protein: "Carne molida", side: "Pan" },
            { id: "7", day: "Dom", recipe: "Lasaña", protein: "Carne molida", side: "Pasta" },
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
      // Generar menú con OpenAI
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

  const handleConfirm = () => {
    router.push("/lista-compra")
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
        <h1 className="text-xl font-medium ml-2">Menú semanal</h1>
      </header>

      {/* Body */}
      <main className="flex-1 p-4">
       

      <TooltipProvider>
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex w-max space-x-4 p-1">
          {weekMenu.map((day, index) => {
            const recipeObj = JSON.parse(day.recipe)
console.log('day',{day})
console.log('recipeObj',{recipeObj})
            return (
              <Card
                key={`${index}`}
                className={`transition-all duration-300 flex-shrink-0 ${
                  expandedCard === index ? "w-[400px]" : "w-[300px]"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {day.day}
                    </Badge>
                    {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button> */}
                  </div>

                  <h3 className="font-medium text-lg mb-2 line-clamp-2 min-h-[3rem]">{recipeObj.name}</h3>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{recipeObj.description}</p>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-sm text-slate-500">
                          <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{recipeObj.cookingTime} min</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tiempo de preparación</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-sm text-slate-500">
                          <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{recipeObj.servings} porciones</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Porciones</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-sm text-slate-500">
                          <Flame className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{recipeObj.difficulty}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Dificultad</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-sm text-slate-500">
                          <Drumstick className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{day.protein}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Proteína principal</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {expandedCard === index && (
                    <div className="mt-3 border-t pt-3">
                      <h4 className="font-medium mb-2">Ingredientes principales:</h4>
                      <ul className="text-sm space-y-1 mb-3">
                        {recipeObj.ingredients.slice(0, 3).map((ing, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-1">•</span>
                            <span>
                              {ing.name} - {ing.quantity} {ing.unit}
                            </span>
                          </li>
                        ))}
                        {recipeObj.ingredients.length > 3 && (
                          <li className="text-muted-foreground">+ {recipeObj.ingredients.length - 3} más</li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
                  <div className="flex items-center text-sm text-slate-500">
                    <Carrot className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{day.side}</span>
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => toggleExpand(index)}>
                    {expandedCard === index ? "Ver menos" : "Ver más"}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </TooltipProvider>
      </main>

      {/* Footer */}
  
      {/* <footer className="p-4 border-t">
  
      <div>
          
          <div className="grid grid-cols-3 gap-3">
            <Button 
              key="confirm-menu"
              variant="outline" 
              className="w-full h-auto py-3 flex flex-col items-center"
              onClick={handleConfirm}
            >
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs">Confirmar menú</span>
            </Button>
            <Button 
              key="generate-menu"
              variant="outline" 
              className="w-full h-auto py-3 flex flex-col items-center"
              onClick={handleGenerateMenu} 
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando menú...
                </>
              ) : (
                <>
                  <ChefHat className="h-5 w-5" />
                  <span className="text-xs">Generar otro menú</span>
                </>
              )}
            </Button>
          
          </div>
        </div>
      </footer> */}
      
    </div>
  )
}

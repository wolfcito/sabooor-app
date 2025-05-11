"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Edit, Drumstick, Carrot, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { createClientSupabaseClient } from "@/lib/supabase"
import { generateMenu } from "@/app/actions"

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
        <h1 className="text-xl font-medium ml-2">Tu menú de la semana</h1>
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

        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex w-max space-x-4 p-1">
            {weekMenu.map((day) => (
              <Card key={day.id} className="w-[300px] flex-shrink-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-slate-100 rounded-full px-3 py-1 text-sm font-medium">{day.day}</div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                  </div>
                  <h3 className="font-medium line-clamp-2 min-h-[2.5rem]">{day.recipe}</h3>
                  <div className="flex items-center mt-2 text-sm text-slate-500">
                    <Drumstick className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{day.protein}</span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-slate-500">
                    <Carrot className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{day.side}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t">
        <Button className="w-full" onClick={handleConfirm}>
          Confirmar menú
        </Button>
      </footer>
    </div>
  )
}

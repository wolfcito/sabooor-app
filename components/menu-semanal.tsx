"use client"

import { useState } from "react"
import { ArrowLeft, Edit, Drumstick, Carrot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

type MealDay = {
  id: string
  day: string
  recipe: string
  protein: string
  side: string
}

export function MenuSemanal() {
  const router = useRouter()
  const [weekMenu, setWeekMenu] = useState<MealDay[]>([
    { id: "1", day: "Lun", recipe: "Pollo al horno", protein: "Pollo", side: "Verduras mixtas" },
    { id: "2", day: "Mar", recipe: "Pasta con albóndigas", protein: "Carne molida", side: "Pasta" },
    { id: "3", day: "Mié", recipe: "Pescado a la plancha", protein: "Pescado", side: "Arroz" },
    { id: "4", day: "Jue", recipe: "Tacos de carnitas", protein: "Cerdo", side: "Tortillas" },
    { id: "5", day: "Vie", recipe: "Pizza casera", protein: "Queso", side: "Masa" },
    { id: "6", day: "Sáb", recipe: "Hamburguesas", protein: "Carne molida", side: "Pan" },
    { id: "7", day: "Dom", recipe: "Lasaña", protein: "Carne molida", side: "Pasta" },
  ])

  const handleConfirm = () => {
    router.push("/lista-compra")
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
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex w-max space-x-4 p-1">
            {weekMenu.map((day) => (
              <Card key={day.id} className="w-[200px] flex-shrink-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-slate-100 rounded-full px-3 py-1 text-sm font-medium">{day.day}</div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                  </div>
                  <h3 className="font-medium">{day.recipe}</h3>
                  <div className="flex items-center mt-2 text-sm text-slate-500">
                    <Drumstick className="h-4 w-4 mr-1" />
                    <span>{day.protein}</span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-slate-500">
                    <Carrot className="h-4 w-4 mr-1" />
                    <span>{day.side}</span>
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

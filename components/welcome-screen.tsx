"use client"

import { useEffect, useState } from "react"
import { Menu, Loader2, Heart, Utensils, FileText, BarChart3, ShoppingCart, Recycle, BookOpen } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { generateMenu } from "@/app/actions"
import { createClientSupabaseClient } from "@/lib/supabase"

type MealDay = {
  id: string
  day: string
  recipe: string
  protein: string
  side: string
}

export function WelcomeScreen() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [weekMenu, setWeekMenu] = useState<MealDay[]>([])
  const [favIndex] = useState(0)

  useEffect(() => {
    const fetchMenu = async () => {
      const supabase = createClientSupabaseClient()
      const { data, error } = await supabase.from("weekly_menu").select("*")
      if (!error && data) setWeekMenu(data)
    }
    fetchMenu()
  }, [])

  const favoriteRecipe = weekMenu.length > 0
    ? JSON.parse(weekMenu[favIndex].recipe)
    : null

  const handleCook = async () => {
    if (!prompt.trim()) {
      router.push("/menu-semanal")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) throw new Error("Error en la generación del texto")

      await response.json()
      const result = await generateMenu()

      if (!result.success) throw new Error("Error al generar el menú")

      router.push("/menu-semanal")
    } catch (error) {
      console.error("Error processing prompt:", error)
      router.push("/menu-semanal")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleCook()
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 relative">
            <Image src="/logo.png" alt="Sabooor" fill className="object-contain" />
          </div>
          <span className="text-xl font-bold text-foreground">Sabooor</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/lista-compra")}>Lista de compra</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/sobrantes")}>Registrar sobrantes</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-4 overflow-auto">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-center mb-4">
          <span className="text-foreground">tu chefcito</span>
          <span className="text-primary">...</span>
        </h1>

        {/* Search Input */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <Input
              placeholder="Genera el menú para esta semana..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              className="h-14 pl-4 pr-4 rounded-2xl bg-card border-border text-base"
            />
          </div>
          <Button
            className="h-14 w-14 rounded-2xl bg-primary hover:bg-primary/90"
            onClick={handleCook}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : (
              <BookOpen className="h-6 w-6 text-white" />
            )}
          </Button>
        </div>

        {/* Favorite Card */}
        <Card className="mb-6 overflow-hidden rounded-2xl border-border">
          <div className="relative h-48 bg-gradient-to-b from-teal-700 to-teal-800 flex items-center justify-center">
            <div className="text-6xl">🍽️</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm font-medium text-foreground">FAVORITO DE LA SEMANA</span>
              </div>
            </div>
          </div>
          <div className="p-4 text-center">
            <h2 className="text-xl font-bold text-foreground mb-1">
              {favoriteRecipe ? favoriteRecipe.name : "¿Qué vamos a cocinar?"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {favoriteRecipe
                ? favoriteRecipe.description
                : "Aún no tienes favoritos. ¡Empieza a generar tu menú para descubrir nuevos sabores!"
              }
            </p>
          </div>
        </Card>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card
            className="p-4 rounded-2xl border-border cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/configuracion")}
          >
            <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
              <Heart className="h-5 w-5 text-red-400" />
            </div>
            <h3 className="font-semibold text-foreground">Gustos</h3>
            <p className="text-sm text-muted-foreground">Preferencias</p>
          </Card>

          <Card
            className="p-4 rounded-2xl border-border cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/menu-semanal")}
          >
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
              <Utensils className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Menú</h3>
            <p className="text-sm text-muted-foreground">Plan semanal</p>
          </Card>

          <Card
            className="p-4 rounded-2xl border-border cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/subir-factura")}
          >
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-foreground">Factura</h3>
            <p className="text-sm text-muted-foreground">Gastos</p>
          </Card>

          <Card
            className="p-4 rounded-2xl border-border cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/metricas")}
          >
            <div className="h-10 w-10 rounded-xl bg-pink-50 flex items-center justify-center mb-3">
              <BarChart3 className="h-5 w-5 text-pink-400" />
            </div>
            <h3 className="font-semibold text-foreground">Reporte</h3>
            <p className="text-sm text-muted-foreground">Análisis</p>
          </Card>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-14 rounded-2xl bg-red-50 border-red-100 hover:bg-red-100 text-red-400"
            onClick={() => router.push("/lista-compra")}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Lista
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-14 rounded-2xl bg-green-50 border-green-100 hover:bg-green-100 text-green-500"
            onClick={() => router.push("/sobrantes")}
          >
            <Recycle className="h-5 w-5 mr-2" />
            Sobrantes
          </Button>
        </div>
      </main>
    </div>
  )
}

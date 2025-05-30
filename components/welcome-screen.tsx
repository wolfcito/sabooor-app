"use client"

import { useEffect, useState } from "react"
import { Menu, Loader2, Calendar, ShoppingCart, Utensils, Star, ChefHat, Settings, FileText, BarChart2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { generateMenu } from "@/app/actions"
import { createClientSupabaseClient } from "@/lib/supabase"

type MealDay = {
  id: string
  day: string
  recipe: string    // JSON-string
  protein: string
  side: string
}

export function WelcomeScreen() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [weekMenu, setWeekMenu] = useState<MealDay[]>([])
  const [favIndex, setFavIndex] = useState(0)

  useEffect(() => {
    const fetchMenu = async () => {
      const supabase = createClientSupabaseClient()
      const { data, error } = await supabase.from("weekly_menu").select("*")
      console.log('data',{data})
      if (!error && data) setWeekMenu(data)
    }
    fetchMenu()
  }, [])

  const favoriteRecipe = weekMenu.length > 0
    ? JSON.parse(weekMenu[favIndex].recipe)
    : null

  const handleCook = async () => {
    if (!prompt.trim()) {
      // Si no hay prompt, simplemente redirigimos al menú semanal
      router.push("/menu-semanal")
      return
    }

    setIsLoading(true)

    try {
      // Llamamos a nuestra API route
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Error en la generación del texto")
      }

      const { text } = await response.json()
      console.log("Respuesta del asistente:", text)

      // Generamos el menú semanal usando la acción del servidor
      const result = await generateMenu()

      if (!result.success) {
        throw new Error("Error al generar el menú")
      }

      // Redirigimos al menú semanal
      router.push("/menu-semanal")
    } catch (error) {
      console.error("Error processing prompt:", error)
      // En caso de error, también redirigimos al menú semanal
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
    <div className="flex flex-col min-h-screen">
      {/* Header con menú hamburguesa */}
      <header className="p-4 flex items-center justify-between border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {/* <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem> */}
            {/* <DropdownMenuItem onClick={() => router.push("/subir-factura")}>Subir factura</DropdownMenuItem> */}
            {/* <DropdownMenuItem onClick={() => router.push("/menu-semanal")}>Menú semanal</DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => router.push("/lista-compra")}>Lista de compra</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/sobrantes")}>Registrar sobrantes</DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => router.push("/metricas")}>Métricas y ahorro</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center p-6 justify-center">
        <div className="w-full max-w-md flex flex-col">
          {/* Logo y nombre */}
          <div className="mb-6 flex items-center">
            <div className="h-24 w-24 relative mb-4">
              <Image src="/logo.png" alt="Sabooor Logo" fill className="object-contain" />
            </div>
            <div>
            <h1 className="text-4xl font-bold mb-1">Sabooor</h1>
            <p className="text-lg text-slate-500 italic">tu chefcito...</p>
            </div>
          </div>

          {/* Input y botón */}
          <div className="w-full space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Genera el menú para esta semana..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
                className="h-12"
              />
              <Button 
                className="h-12 w-12 rounded-lg p-0" 
                onClick={handleCook} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ChefHat className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          
          
        {/* Favoritos */}
      <div className="my-8">
        <h2 className="font-medium mb-3">Favorito</h2>

        {favoriteRecipe ? (
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 fill-yellow-500 mr-2" />
              <span className="font-semibold">{favoriteRecipe.name}</span>
            </div>
            <p className="text-sm text-slate-500">
              {favoriteRecipe.servings} porciones
            </p>
            <div className="mt-2 text-sm text-slate-600 line-clamp-2">
              {favoriteRecipe.description}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Aún no hay un favorito generado.</p>
        )}
      </div>

        

        </div>
      </main>

      
      <footer className="p-4 border-t">
      {/* Accesos rápidos */}
      <div>
          {/* <h2 className="text-lg font-medium mb-3">Accesos rápidos</h2> */}
          <div className="grid grid-cols-4 gap-3">
          <Button 
              variant="outline" 
              className="w-full h-auto py-3 flex flex-col items-center"
              onClick={() => router.push("/configuracion")}
            >
              <Settings className="h-5 w-5 mb-1" />
              <span className="text-xs">Gustos</span>
            </Button>
           
            <Button 
              variant="outline" 
              className="w-full h-auto py-3 flex flex-col items-center"
              onClick={() => router.push("/subir-factura")}
            >
              <FileText className="h-5 w-5 mb-1" />
              <span className="text-xs">Factura</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full h-auto py-3 flex flex-col items-center"
              onClick={() => router.push("/metricas")}
            >
             <BarChart2 className="h-5 w-5 mb-1" />
              <span className="text-xs">Reporte</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-auto py-3 flex flex-col items-center"
              onClick={() => router.push("/menu-semanal")}
            > 
            <Utensils className="h-5 w-5 mb-1" />  
              <span className="text-xs">Menú</span>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

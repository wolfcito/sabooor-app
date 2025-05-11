"use client"

import { useState } from "react"
import { Menu, Loader2, Calendar, ShoppingCart, Utensils, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { generateMenu } from "@/app/actions"

export function WelcomeScreen() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

      // Generamos el menú semanal basado en los datos almacenados
      await generateMenu()

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
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/subir-factura")}>Subir factura</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/menu-semanal")}>Menú semanal</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/lista-compra")}>Lista de compra</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/sobrantes")}>Registrar sobrantes</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/metricas")}>Métricas y ahorro</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center p-6 justify-center">
        <div className="w-full max-w-md flex flex-col">
          {/* Logo y nombre */}
          <div className="mb-6 flex flex-col">
            {/* <div className="h-24 w-24 relative mb-4">
              <Image src="/placeholder.svg?height=96&width=96" alt="Sabooor Logo" fill className="object-contain" />
            </div> */}
            <h1 className="text-4xl font-bold mb-1">Sabooor</h1>
            <p className="text-lg text-slate-500 italic">tu chefcito...</p>
          </div>

          {/* Input y botón */}
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Genera el menú para este mes..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
                className="h-12"
              />
            </div>
            <Button className="w-full h-12 text-lg" onClick={handleCook} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Hora de cocinar"
              )}
            </Button>
          </div>
          
          
          {/* Vista previa de último menú */}
        <div className="my-8">
          <h2 className="font-medium mb-3">Favoritos</h2>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="flex px-3 py-1 font-medium"><Star className="h-5 w-5 fill-yellow-500" />x5</div>
              <div className="ml-auto">
                <Utensils className="h-5 w-5 text-slate-400" />
              </div>
            </div>
            <h3 className="font-medium mt-2">Pollo al horno con verduras</h3>
            <p className="text-sm text-slate-500">4 porciones</p>
          </div>
        </div>

        

        </div>
      </main>

      
      <footer className="p-4 border-t">
      {/* Accesos rápidos */}
      <div>
          {/* <h2 className="text-lg font-medium mb-3">Accesos rápidos</h2> */}
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="w-full h-auto py-3 flex flex-col items-center"
              onClick={() => router.push("/menu-semanal")}
            >
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs">Ver menú</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-auto py-3 flex flex-col items-center"
              onClick={() => router.push("/lista-compra")}
            >
              <ShoppingCart className="h-5 w-5 mb-1" />
              <span className="text-xs">Lista de compra</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-auto py-3 flex flex-col items-center"
              onClick={() => router.push("/sobrantes")}
            >
              <Utensils className="h-5 w-5 mb-1" />
              <span className="text-xs">Registrar sobrantes</span>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

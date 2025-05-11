"use client"

import { useState } from "react"
import { Menu, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Logo y nombre */}
          <div className="mb-6 flex flex-col items-center">
            <div className="h-24 w-24 relative mb-4">
              <Image src="/placeholder.svg?height=96&width=96" alt="Sabooor Logo" fill className="object-contain" />
            </div>
            <h1 className="text-4xl font-bold mb-1">Sabooor</h1>
            <p className="text-lg text-slate-500 italic">tu chefcito.</p>
          </div>

          {/* Input y botón */}
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Genera el menú para este mes..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
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
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t">
        <Button className="w-full" onClick={() => router.push("/dashboard")}>
          Guardar y continuar
        </Button>
      </footer>
    </div>
  )
}

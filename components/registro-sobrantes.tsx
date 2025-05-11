"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { saveLeftoversData } from "@/app/actions"

type Leftover = {
  id: string
  meal: string
  product: string
  quantity: string
}

export function RegistroSobrantes() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [meal, setMeal] = useState<string>("")
  const [product, setProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("")
  const [leftovers, setLeftovers] = useState<Leftover[]>([
    { id: "1", meal: "Almuerzo", product: "Arroz", quantity: "200g" },
    { id: "2", meal: "Cena", product: "Pollo", quantity: "150g" },
  ])

  const addLeftover = () => {
    if (meal && product && quantity) {
      const newId = (Number.parseInt(leftovers[leftovers.length - 1]?.id || "0") + 1).toString()
      setLeftovers([...leftovers, { id: newId, meal, product, quantity }])
      setProduct("")
      setQuantity("")
    }
  }

  const handleSaveLeftovers = async () => {
    setIsLoading(true)

    try {
      // Guardar sobrantes en Supabase y procesar con OpenAI
      await saveLeftoversData(leftovers)

      // Redirigir al dashboard
      router.push("/")
    } catch (error) {
      console.error("Error saving leftovers:", error)
      // En caso de error, también redirigimos al dashboard
      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Atrás</span>
        </Button>
        <h1 className="text-xl font-medium ml-2">Reporte de sobras</h1>
      </header>

      {/* Body */}
      <main className="flex-1 p-4">
        <div className="space-y-6">
          {/* Formulario rápido */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium">Comida</label>
              <Select value={meal} onValueChange={setMeal}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una comida" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desayuno">Desayuno</SelectItem>
                  <SelectItem value="almuerzo">Almuerzo</SelectItem>
                  <SelectItem value="cena">Cena</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Producto</label>
              <Input placeholder="Nombre del producto" value={product} onChange={(e) => setProduct(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cantidad</label>
              <Input placeholder="Ej: 200g" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>

            <Button onClick={addLeftover} disabled={!meal || !product || !quantity}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>

          {/* Listado */}
          <div>
            <h2 className="text-lg font-medium mb-3">Sobrantes del día</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 font-medium">Comida</th>
                    <th className="text-left p-3 font-medium">Producto</th>
                    <th className="text-left p-3 font-medium">Cantidad</th>
                    <th className="text-left p-3 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {leftovers.map((leftover) => (
                    <tr key={leftover.id} className="border-t">
                      <td className="p-3">{leftover.meal}</td>
                      <td className="p-3">{leftover.product}</td>
                      <td className="p-3">{leftover.quantity}</td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm" className="h-8">
                          <Sparkles className="h-4 w-4 mr-1" />
                          Ver remix
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t">
        <Button className="w-full" onClick={handleSaveLeftovers} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar sobrantes"
          )}
        </Button>
      </footer>
    </div>
  )
}

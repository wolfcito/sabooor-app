"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Product = {
  id: string
  name: string
  category: string
}

export function CatalogoProductos() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Pollo entero", category: "proteina" },
    { id: "2", name: "Zanahorias", category: "verdura" },
    { id: "3", name: "Leche", category: "lacteo" },
    { id: "4", name: "Huevos", category: "huevos" },
    { id: "5", name: "Arroz", category: "otros" },
  ])

  const handleCategoryChange = (id: string, category: string) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          return { ...product, category }
        }
        return product
      }),
    )
  }

  const handleSave = () => {
    router.push("/menu-semanal")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Atrás</span>
        </Button>
        <h1 className="text-xl font-medium ml-2">Categoriza tus productos</h1>
      </header>

      {/* Body */}
      <main className="flex-1 p-4">
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-2 border-b">
              <span className="font-medium">{product.name}</span>
              <Select value={product.category} onValueChange={(value) => handleCategoryChange(product.id, value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proteina">Proteína</SelectItem>
                  <SelectItem value="verdura">Verdura</SelectItem>
                  <SelectItem value="lacteo">Lácteo</SelectItem>
                  <SelectItem value="huevos">Huevos</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t">
        <Button className="w-full" onClick={handleSave}>
          Guardar categorías
        </Button>
      </footer>
    </div>
  )
}

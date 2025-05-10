"use client"

import { useState } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

type Product = {
  id: string
  name: string
  quantity: string
  price: string
}

export function ValidarDatos() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Pollo entero", quantity: "1", price: "89.90" },
    { id: "2", name: "Zanahorias", quantity: "500", price: "22.50" },
    { id: "3", name: "Leche", quantity: "1", price: "24.00" },
    { id: "4", name: "Huevos", quantity: "12", price: "45.00" },
  ])

  const handleProductChange = (id: string, field: keyof Product, value: string) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          return { ...product, [field]: value }
        }
        return product
      }),
    )
  }

  const addNewProduct = () => {
    const newId = (Number.parseInt(products[products.length - 1]?.id || "0") + 1).toString()
    setProducts([...products, { id: newId, name: "", quantity: "", price: "" }])
  }

  const handleConfirm = () => {
    router.push("/catalogo-productos")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Atrás</span>
        </Button>
        <h1 className="text-xl font-medium ml-2">Valida tu factura</h1>
      </header>

      {/* Body */}
      <main className="flex-1 p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-2 font-medium text-sm px-2">
            <div className="col-span-6">Producto</div>
            <div className="col-span-3">Cantidad</div>
            <div className="col-span-3">Precio</div>
          </div>

          {products.map((product) => (
            <div key={product.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6">
                <Input
                  value={product.name}
                  onChange={(e) => handleProductChange(product.id, "name", e.target.value)}
                  className="border-0 border-b rounded-none focus-visible:ring-0 px-2"
                />
              </div>
              <div className="col-span-3">
                <Input
                  value={product.quantity}
                  onChange={(e) => handleProductChange(product.id, "quantity", e.target.value)}
                  className="border-0 border-b rounded-none focus-visible:ring-0 px-2"
                  type="number"
                />
              </div>
              <div className="col-span-3">
                <Input
                  value={product.price}
                  onChange={(e) => handleProductChange(product.id, "price", e.target.value)}
                  className="border-0 border-b rounded-none focus-visible:ring-0 px-2"
                  type="number"
                  step="0.01"
                />
              </div>
            </div>
          ))}

          <Button
            variant="ghost"
            className="w-full flex items-center justify-center text-slate-500"
            onClick={addNewProduct}
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar producto
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button className="flex-1" onClick={handleConfirm}>
          Confirmar
        </Button>
      </footer>
    </div>
  )
}

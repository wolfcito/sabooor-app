"use client"

import { useState } from "react"
import { ArrowLeft, ChevronDown, ChevronUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type Category = {
  id: string
  name: string
  expanded: boolean
  items: ShoppingItem[]
}

type ShoppingItem = {
  id: string
  name: string
  quantity: string
  checked: boolean
}

export function ListaCompra() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Proteína",
      expanded: true,
      items: [
        { id: "1", name: "Pollo entero", quantity: "1 kg", checked: false },
        { id: "2", name: "Carne molida", quantity: "500 g", checked: false },
        { id: "3", name: "Pescado", quantity: "400 g", checked: false },
      ],
    },
    {
      id: "2",
      name: "Verduras",
      expanded: true,
      items: [
        { id: "4", name: "Zanahorias", quantity: "500 g", checked: false },
        { id: "5", name: "Tomates", quantity: "6 unidades", checked: false },
        { id: "6", name: "Lechuga", quantity: "1 unidad", checked: false },
        { id: "7", name: "Cebolla", quantity: "3 unidades", checked: false },
      ],
    },
    {
      id: "3",
      name: "Lácteos",
      expanded: true,
      items: [
        { id: "8", name: "Leche", quantity: "1 L", checked: false },
        { id: "9", name: "Queso", quantity: "200 g", checked: false },
      ],
    },
  ])

  const toggleCategory = (categoryId: string) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return { ...category, expanded: !category.expanded }
        }
        return category
      }),
    )
  }

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, checked: !item.checked }
              }
              return item
            }),
          }
        }
        return category
      }),
    )
  }

  const markAll = () => {
    setCategories(
      categories.map((category) => ({
        ...category,
        items: category.items.map((item) => ({ ...item, checked: true })),
      })),
    )
  }

  const downloadPDF = () => {
    // Implementación para descargar PDF
    alert("Descargando lista de compra en PDF...")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Atrás</span>
        </Button>
        <h1 className="text-xl font-medium ml-2">Lista de compra</h1>
      </header>

      {/* Body */}
      <main className="flex-1 p-4">
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="border rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-3 bg-slate-50 cursor-pointer"
                onClick={() => toggleCategory(category.id)}
              >
                <h2 className="font-medium">{category.name}</h2>
                {category.expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
              {category.expanded && (
                <div className="p-3 space-y-2">
                  {category.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`item-${item.id}`}
                          checked={item.checked}
                          onCheckedChange={() => toggleItem(category.id, item.id)}
                        />
                        <Label
                          htmlFor={`item-${item.id}`}
                          className={`text-base ${item.checked ? "line-through text-slate-400" : ""}`}
                        >
                          {item.name}
                        </Label>
                      </div>
                      <span className="text-sm text-slate-500">{item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t flex gap-2">
        <Button variant="outline" className="flex-1" onClick={markAll}>
          Marcar todo
        </Button>
        <Button className="flex-1" onClick={downloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Descargar PDF
        </Button>
      </footer>
    </div>
  )
}

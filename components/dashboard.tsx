"use client"

import { Camera, Calendar, ShoppingCart, Utensils, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Dashboard() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header fijo */}
      <header className="sticky top-0 z-10 bg-white border-b p-4 flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Atrás</span>
        </Button>
        <h1 className="text-xl font-medium">Dashboard</h1>
        <Button variant="ghost" size="icon">
          <User className="h-6 w-6" />
          <span className="sr-only">Usuario</span>
        </Button>
      </header>

      {/* Sección principal */}
      <main className="flex-1 p-4">
        {/* Card "Subir factura" */}
        <Link href="/subir-factura">
          <div className="bg-slate-50 rounded-lg p-6 flex flex-col items-center justify-center mb-6 border border-dashed border-slate-200">
            <Camera className="h-12 w-12 text-slate-400 mb-2" />
            <p className="text-lg font-medium">Sube tu factura</p>
            <p className="text-sm text-slate-500">Escanea tus compras para optimizar tu menú</p>
          </div>
        </Link>

        {/* Vista previa de último menú */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Tu último menú</h2>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="bg-slate-100 rounded-full px-3 py-1 text-sm font-medium">Lunes</div>
              <div className="ml-auto">
                <Utensils className="h-5 w-5 text-slate-400" />
              </div>
            </div>
            <h3 className="font-medium mt-2">Pollo al horno con verduras</h3>
            <p className="text-sm text-slate-500">4 porciones</p>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div>
          <h2 className="text-lg font-medium mb-3">Accesos rápidos</h2>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/menu">
              <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center">
                <Calendar className="h-5 w-5 mb-1" />
                <span className="text-xs">Ver menú</span>
              </Button>
            </Link>
            <Link href="/lista-compra">
              <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center">
                <ShoppingCart className="h-5 w-5 mb-1" />
                <span className="text-xs">Lista de compra</span>
              </Button>
            </Link>
            <Link href="/sobrantes">
              <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center">
                <Utensils className="h-5 w-5 mb-1" />
                <span className="text-xs">Registrar sobrantes</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

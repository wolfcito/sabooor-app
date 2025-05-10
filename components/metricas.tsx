"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Metricas() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Atrás</span>
        </Button>
        <h1 className="text-xl font-medium ml-2">Métricas y ahorro</h1>
      </header>

      {/* Body */}
      <main className="flex-1 p-4">
        <div className="space-y-6">
          {/* KPIs en cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Desperdicio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12%</div>
                <p className="text-xs text-slate-500">vs. 25% promedio nacional</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Ahorro estimado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$850</div>
                <p className="text-xs text-slate-500">este mes</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfica de barras */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Evolución del desperdicio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end justify-between gap-2">
                {[25, 22, 18, 15, 12].map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-8 bg-primary rounded-t-sm" style={{ height: `${value * 6}px` }}></div>
                    <span className="text-xs mt-1">Sem {index + 1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recomendaciones rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                <li className="text-sm">Usa las yemas sobrantes para hacer mayonesa casera</li>
                <li className="text-sm">El pollo sobrante puede usarse en ensaladas o tacos</li>
                <li className="text-sm">Congela el arroz sobrante en porciones individuales</li>
                <li className="text-sm">Las verduras a punto de vencer pueden usarse en sopas</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

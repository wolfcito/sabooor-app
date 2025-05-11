"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientSupabaseClient } from "@/lib/supabase"
import { generateMetricsData } from "@/app/actions"

type Metrics = {
  wastePercentage: number
  estimatedSavings: number
  weeklyWaste: number[]
}

type Recommendation = {
  id: string
  text: string
}

export function Metricas() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [metrics, setMetrics] = useState<Metrics>({
    wastePercentage: 12,
    estimatedSavings: 850,
    weeklyWaste: [25, 22, 18, 15, 12],
  })
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    { id: "1", text: "Usa las yemas sobrantes para hacer mayonesa casera" },
    { id: "2", text: "El pollo sobrante puede usarse en ensaladas o tacos" },
    { id: "3", text: "Congela el arroz sobrante en porciones individuales" },
    { id: "4", text: "Las verduras a punto de vencer pueden usarse en sopas" },
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClientSupabaseClient()

        // Obtener métricas
        const { data: metricsData, error: metricsError } = await supabase
          .from("metrics")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)

        if (metricsError) {
          throw metricsError
        }

        // Obtener recomendaciones
        const { data: recommendationsData, error: recommendationsError } = await supabase
          .from("recommendations")
          .select("*")

        if (recommendationsError) {
          throw recommendationsError
        }

        if (metricsData && metricsData.length > 0) {
          // Ordenar métricas por semana
          const sortedMetrics = metricsData.sort((a, b) => a.week_number - b.week_number)

          setMetrics({
            wastePercentage: sortedMetrics[sortedMetrics.length - 1].waste_percentage,
            estimatedSavings: sortedMetrics[sortedMetrics.length - 1].estimated_savings,
            weeklyWaste: sortedMetrics.map((m) => m.waste_percentage),
          })
        }

        if (recommendationsData && recommendationsData.length > 0) {
          setRecommendations(
            recommendationsData.map((r) => ({
              id: r.id,
              text: r.text,
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleGenerateMetrics = async () => {
    setIsGenerating(true)

    try {
      // Generar métricas con OpenAI
      const result = await generateMetricsData()

      if (result.success) {
        if (result.metrics) {
          setMetrics({
            wastePercentage: result.metrics.wastePercentage,
            estimatedSavings: result.metrics.estimatedSavings,
            weeklyWaste: result.metrics.weeklyWaste,
          })
        }

        if (result.recommendations) {
          setRecommendations(
            result.recommendations.map((text, index) => ({
              id: (index + 1).toString(),
              text,
            })),
          )
        }
      }
    } catch (error) {
      console.error("Error generating metrics:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Cargando métricas...</p>
      </div>
    )
  }

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
        <Button className="w-full mb-4" onClick={handleGenerateMetrics} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualizando métricas...
            </>
          ) : (
            "Actualizar métricas"
          )}
        </Button>

        <div className="space-y-6">
          {/* KPIs en cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Desperdicio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metrics.wastePercentage}%</div>
                <p className="text-xs text-slate-500">vs. 25% promedio nacional</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Ahorro estimado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${metrics.estimatedSavings}</div>
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
                {metrics.weeklyWaste.map((value, index) => (
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
                {recommendations.map((recommendation) => (
                  <li key={recommendation.id} className="text-sm">
                    {recommendation.text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

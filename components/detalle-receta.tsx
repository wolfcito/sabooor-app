"use client"

import { useState } from "react"
import { ArrowLeft, Share2, Heart, Clock, Users, BarChart3, Flame, ListPlus, Play, Timer, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

type Ingredient = {
  name: string
  quantity: string
  unit: string
  description?: string
  checked?: boolean
}

type Step = {
  number: number
  title: string
  description: string
  timer?: number
}

type Recipe = {
  id: string
  name: string
  category: string
  image: string
  cookingTime: number
  servings: number
  difficulty: string
  calories: number
  description: string
  ingredients: Ingredient[]
  steps: Step[]
}

const sampleRecipe: Recipe = {
  id: "1",
  name: "Lasaña Familiar de Calabacín",
  category: "CENA FAMILIAR",
  image: "/recipe-lasagna.png",
  cookingTime: 45,
  servings: 4,
  difficulty: "Fácil",
  calories: 320,
  description: "Una versión saludable y deliciosa de la lasaña clásica. Sustituimos la pasta por láminas de calabacín fresco, perfectas para una cena nutritiva y ligera sin sacrificar el sabor.",
  ingredients: [
    { name: "calabacines grandes", quantity: "2", unit: "", description: "Cortados en láminas finas", checked: false },
    { name: "carne picada", quantity: "500", unit: "g", description: "Ternera magra o pavo", checked: false },
    { name: "tomate triturado", quantity: "400", unit: "g", description: "Natural o en conserva", checked: true },
    { name: "queso mozzarella", quantity: "200", unit: "g", description: "Rallado para gratinar", checked: false },
    { name: "cebolla y 2 dientes de ajo", quantity: "1", unit: "", checked: false },
  ],
  steps: [
    {
      number: 1,
      title: "Preparar el calabacín",
      description: "Lavar los calabacines y cortar en láminas longitudinales finas. Espolvorear con un poco de sal y dejar reposar 10 min para que suelten agua. Secar bien con papel de cocina.",
    },
    {
      number: 2,
      title: "Hacer el relleno",
      description: "En una sartén con aceite, sofreír la cebolla y el ajo picados. Añadir la carne, salpimentar y cocinar hasta que dore. Agregar el tomate y cocinar 10 minutos más a fuego lento.",
      timer: 10,
    },
    {
      number: 3,
      title: "Montar y hornear",
      description: "En una fuente, alternar capas de calabacín, relleno de carne y queso. Terminar con una capa generosa de mozzarella. Hornear a 200°C durante 20 minutos o hasta que gratine.",
    },
  ],
}

interface DetalleRecetaProps {
  recipe?: Recipe
}

export function DetalleReceta({ recipe = sampleRecipe }: DetalleRecetaProps) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set(recipe.ingredients.map((ing, i) => ing.checked ? i : -1).filter(i => i >= 0))
  )

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedIngredients(newChecked)
  }

  const uncheckedCount = recipe.ingredients.length - checkedIngredients.size

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-72 bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center">
        <span className="text-8xl">🍝</span>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        {/* Navigation Buttons */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-full backdrop-blur-sm ${
                isFavorite ? "bg-primary text-white" : "bg-black/20 text-white hover:bg-black/30"
              }`}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="flex-1 -mt-8 bg-background rounded-t-3xl relative">
        <div className="px-4 py-6">
          {/* Category Badge */}
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-3">
            {recipe.category}
          </Badge>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-4">{recipe.name}</h1>

          {/* Info Row */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{recipe.cookingTime} min</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} personas</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Flame className="h-4 w-4" />
              <span>{recipe.calories} kcal</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            {recipe.description}
          </p>

          {/* Add to List Button */}
          <div className="flex gap-2 mb-8">
            <Button className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-medium">
              <ListPlus className="h-5 w-5 mr-2" />
              Agregar a lista ({uncheckedCount})
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-2xl border-border"
            >
              <Play className="h-5 w-5" />
            </Button>
          </div>

          {/* Ingredients Section */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">Para la lasaña</h2>
            <div className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <button
                  key={index}
                  onClick={() => toggleIngredient(index)}
                  className="w-full flex items-start gap-3 text-left"
                >
                  <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    checkedIngredients.has(index)
                      ? "bg-primary border-primary"
                      : "border-border"
                  }`}>
                    {checkedIngredients.has(index) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className={checkedIngredients.has(index) ? "text-muted-foreground line-through" : ""}>
                    <p className="font-medium text-foreground">
                      {ingredient.quantity}{ingredient.unit} {ingredient.name}
                    </p>
                    {ingredient.description && (
                      <p className="text-sm text-muted-foreground">{ingredient.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Steps Section */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">Pasos de preparación</h2>
            <div className="space-y-6">
              {recipe.steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{step.number}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    {step.timer && (
                      <div className="flex items-center gap-2 mt-3 text-primary">
                        <Timer className="h-4 w-4" />
                        <span className="text-sm font-medium">Temporizador: {step.timer} min</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Final Step */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">¡Listo para servir!</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Deja reposar 5 minutos antes de cortar para que las capas se asienten mejor.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

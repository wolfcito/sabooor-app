import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Función para procesar imágenes de facturas
export async function processReceiptImage(imageBase64: string) {
  const base64Image = imageBase64.split(",")[1] // Eliminar el prefijo de data URL si existe

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `
      Analiza esta imagen de una factura de supermercado y extrae la siguiente información en formato JSON:
      {
        "products": [
          {
            "name": "Nombre del producto",
            "quantity_units": número de unidades (si aplica),
            "quantity_kg": cantidad en kilogramos (si aplica),
            "unit_price": precio unitario,
            "total_price": precio total
          }
        ]
      }
      
      Asegúrate de extraer todos los productos visibles en la factura.
    `,
    system:
      "Eres un asistente especializado en extraer información de facturas de supermercado. Tu tarea es analizar imágenes de facturas y extraer información detallada de los productos comprados.",
  })

  try {
    return JSON.parse(text)
  } catch (error) {
    console.error("Error parsing OpenAI response:", error)
    return { products: [] }
  }
}

// Función para procesar datos de onboarding familiar
export async function processFamilyData(familyMembers: any[], restrictions: any[], prohibitedDishes: string[]) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `
      Analiza estos datos de una familia y proporciona recomendaciones:
      
      Miembros de la familia: ${JSON.stringify(familyMembers)}
      Restricciones alimenticias: ${JSON.stringify(restrictions)}
      Platos prohibidos: ${JSON.stringify(prohibitedDishes)}
      
      Proporciona recomendaciones generales para esta familia en formato JSON:
      {
        "recommendations": [
          "Recomendación 1",
          "Recomendación 2",
          "Recomendación 3"
        ]
      }
    `,
    system:
      "Eres un nutricionista especializado en planificación de comidas familiares. Tu tarea es analizar los datos de una familia y proporcionar recomendaciones personalizadas.",
  })

  try {
    return JSON.parse(text)
  } catch (error) {
    console.error("Error parsing OpenAI response:", error)
    return { recommendations: [] }
  }
}

// Función para procesar datos de sobrantes
export async function processLeftovers(leftovers: any[]) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `
      Analiza estos datos de sobrantes de comida y proporciona recomendaciones:
      
      Sobrantes: ${JSON.stringify(leftovers)}
      
      Proporciona recomendaciones para aprovechar estos sobrantes en formato JSON:
      {
        "recommendations": [
          "Recomendación 1",
          "Recomendación 2",
          "Recomendación 3"
        ]
      }
    `,
    system:
      "Eres un chef especializado en reducir el desperdicio de alimentos. Tu tarea es analizar los sobrantes de comida y proporcionar recomendaciones creativas para aprovecharlos.",
  })

  try {
    return JSON.parse(text)
  } catch (error) {
    console.error("Error parsing OpenAI response:", error)
    return { recommendations: [] }
  }
}

// Función para generar menú semanal
export async function generateWeeklyMenu(
  familyMembers: any[],
  restrictions: any[],
  prohibitedDishes: string[],
  products: any[],
) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `
      Genera un menú semanal para esta familia basado en:
      
      Miembros de la familia: ${JSON.stringify(familyMembers)}
      Restricciones alimenticias: ${JSON.stringify(restrictions)}
      Platos prohibidos: ${JSON.stringify(prohibitedDishes)}
      Productos disponibles: ${JSON.stringify(products)}
      
      Proporciona un menú para los 7 días de la semana en formato JSON:
      {
        "weeklyMenu": [
          {
            "day": "Lun",
            "recipe": "Nombre de la receta",
            "protein": "Proteína principal",
            "side": "Acompañamiento"
          },
          ...
        ]
      }
    `,
    system:
      "Eres un chef especializado en planificación de comidas familiares. Tu tarea es generar menús semanales personalizados basados en las preferencias y restricciones de la familia, así como los productos disponibles.",
  })

  try {
    return JSON.parse(text)
  } catch (error) {
    console.error("Error parsing OpenAI response:", error)
    return { weeklyMenu: [] }
  }
}

// Función para generar métricas y recomendaciones
export async function generateMetrics(familyMembers: any[], products: any[], leftovers: any[]) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `
      Genera métricas y recomendaciones basadas en:
      
      Miembros de la familia: ${JSON.stringify(familyMembers)}
      Productos comprados: ${JSON.stringify(products)}
      Sobrantes registrados: ${JSON.stringify(leftovers)}
      
      Proporciona métricas y recomendaciones en formato JSON:
      {
        "metrics": {
          "wastePercentage": porcentaje de desperdicio estimado,
          "estimatedSavings": ahorro estimado en pesos,
          "weeklyWaste": [porcentaje1, porcentaje2, porcentaje3, porcentaje4, porcentaje5]
        },
        "recommendations": [
          "Recomendación 1",
          "Recomendación 2",
          "Recomendación 3",
          "Recomendación 4"
        ]
      }
    `,
    system:
      "Eres un analista especializado en reducción de desperdicio alimentario y ahorro en el hogar. Tu tarea es generar métricas y recomendaciones basadas en los datos de compras y sobrantes de una familia.",
  })

  try {
    return JSON.parse(text)
  } catch (error) {
    console.error("Error parsing OpenAI response:", error)
    return {
      metrics: {
        wastePercentage: 0,
        estimatedSavings: 0,
        weeklyWaste: [0, 0, 0, 0, 0],
      },
      recommendations: [],
    }
  }
}

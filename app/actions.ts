"use server"

import {
  saveFamilyMembers,
  saveDietaryRestrictions,
  saveProhibitedDishes,
  saveProducts,
  saveLeftovers,
  saveWeeklyMenu,
  saveMetrics,
  saveRecommendations,
  getFamilyMembers,
  getDietaryRestrictions,
  getProhibitedDishes,
  getProducts,
  getLeftovers,
} from "@/services/supabase-service"

import {
  processReceiptImage,
  processFamilyData,
  processLeftovers,
  generateWeeklyMenu,
  generateMetrics,
} from "@/lib/openai"

// Acción para guardar datos de onboarding familiar
export async function saveFamilyData(familyMembers: any[], restrictions: any[], prohibitedDishes: string[]) {
  try {
    await saveFamilyMembers(familyMembers)
    await saveDietaryRestrictions(restrictions)
    await saveProhibitedDishes(prohibitedDishes)

    // Procesar datos con OpenAI para obtener recomendaciones
    const aiResponse = await processFamilyData(familyMembers, restrictions, prohibitedDishes)

    // Guardar recomendaciones
    if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
      await saveRecommendations(aiResponse.recommendations)
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving family data:", error)
    return { success: false, error }
  }
}

// Acción para procesar imagen de factura
export async function processReceipt(imageBase64: string) {
  try {
    // Procesar imagen con OpenAI
    const aiResponse = await processReceiptImage(imageBase64)

    // Verificar si la respuesta tiene productos
    if (!aiResponse || !aiResponse.products) {
      console.error("Invalid AI response:", aiResponse)
      return { success: false, error: "Invalid AI response" }
    }

    // Guardar productos extraídos
    if (aiResponse.products.length > 0) {
      await saveProducts(aiResponse.products)
      return { success: true, products: aiResponse.products }
    } else {
      return { success: false, error: "No products found in the receipt" }
    }
  } catch (error) {
    console.error("Error processing receipt:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Acción para guardar productos validados
export async function saveValidatedProducts(products: any[]) {
  try {
    await saveProducts(products)
    return { success: true }
  } catch (error) {
    console.error("Error saving validated products:", error)
    return { success: false, error }
  }
}

// Acción para guardar categorías de productos
export async function saveProductCategories(products: any[]) {
  try {
    // Actualizamos los productos con sus categorías
    await saveProducts(products)
    return { success: true }
  } catch (error) {
    console.error("Error saving product categories:", error)
    return { success: false, error }
  }
}

// Acción para guardar sobrantes
export async function saveLeftoversData(leftovers: any[]) {
  try {
    await saveLeftovers(leftovers)

    // Procesar sobrantes con OpenAI para obtener recomendaciones
    const aiResponse = await processLeftovers(leftovers)

    // Guardar recomendaciones
    if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
      await saveRecommendations(aiResponse.recommendations)
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving leftovers:", error)
    return { success: false, error }
  }
}

// Acción para generar menú semanal
export async function generateMenu() {
  try {
    // Obtener datos necesarios
    const familyMembers = await getFamilyMembers()
    const restrictions = await getDietaryRestrictions()
    const prohibitedDishes = await getProhibitedDishes()
    const products = await getProducts()

    // Generar menú con OpenAI
    const aiResponse = await generateWeeklyMenu(
      familyMembers,
      restrictions,
      prohibitedDishes.map((dish) => dish.name),
      products,
    )

    // Guardar menú generado
    if (aiResponse.weeklyMenu && aiResponse.weeklyMenu.length > 0) {
      await saveWeeklyMenu(aiResponse.weeklyMenu)
    }

    return { success: true, weeklyMenu: aiResponse.weeklyMenu }
  } catch (error) {
    console.error("Error generating menu:", error)
    return { success: false, error }
  }
}

// Acción para generar métricas
export async function generateMetricsData() {
  try {
    // Obtener datos necesarios
    const familyMembers = await getFamilyMembers()
    const products = await getProducts()
    const leftovers = await getLeftovers()

    // Generar métricas con OpenAI
    const aiResponse = await generateMetrics(familyMembers, products, leftovers)

    // Guardar métricas y recomendaciones
    if (aiResponse.metrics) {
      await saveMetrics(aiResponse.metrics)
    }

    if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
      await saveRecommendations(aiResponse.recommendations)
    }

    return {
      success: true,
      metrics: aiResponse.metrics,
      recommendations: aiResponse.recommendations,
    }
  } catch (error) {
    console.error("Error generating metrics:", error)
    return { success: false, error }
  }
}

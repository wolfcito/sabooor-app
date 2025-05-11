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

// Logger utility
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? data : '')
  },
  error: (message: string, error: any) => {
    console.error(`[ERROR] ${message}`, error)
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data ? data : '')
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data ? data : '')
    }
  }
}

// Acción para guardar datos de onboarding familiar
export async function saveFamilyData(familyMembers: any[], restrictions: any[], prohibitedDishes: string[]) {
  try {
    logger.info('Starting family data save process', {
      familyMembersCount: familyMembers.length,
      restrictionsCount: restrictions.length,
      prohibitedDishesCount: prohibitedDishes.length
    })

    await saveFamilyMembers(familyMembers)
    await saveDietaryRestrictions(restrictions)
    await saveProhibitedDishes(prohibitedDishes)

    logger.debug('Saved family data to database, processing with AI')

    // Procesar datos con OpenAI para obtener recomendaciones
    const aiResponse = await processFamilyData(familyMembers, restrictions, prohibitedDishes)

    // Guardar recomendaciones
    if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
      logger.info('Saving AI recommendations', { count: aiResponse.recommendations.length })
      await saveRecommendations(aiResponse.recommendations)
    }

    logger.info('Family data save process completed successfully')
    return { success: true }
  } catch (error) {
    logger.error('Error in saveFamilyData', error)
    return { success: false, error }
  }
}

// Acción para procesar imagen de factura
export async function processReceipt(imageBase64: string) {
  try {
    logger.info('Starting receipt processing')

    // Procesar imagen con OpenAI
    const aiResponse = await processReceiptImage(imageBase64)

    // Verificar si la respuesta tiene productos
    if (!aiResponse || !aiResponse.products) {
      logger.error('Invalid AI response', aiResponse)
      return { success: false, error: "Invalid AI response" }
    }

    // Guardar productos extraídos
    if (aiResponse.products.length > 0) {
      logger.info('Saving extracted products', { count: aiResponse.products.length })
      await saveProducts(aiResponse.products)
      return { success: true, products: aiResponse.products }
    } else {
      logger.warn('No products found in receipt')
      return { success: false, error: "No products found in the receipt" }
    }
  } catch (error) {
    logger.error('Error in processReceipt', error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Acción para guardar productos validados
export async function saveValidatedProducts(products: any[]) {
  try {
    logger.info('Saving validated products', { count: products.length })
    await saveProducts(products)
    return { success: true }
  } catch (error) {
    logger.error('Error in saveValidatedProducts', error)
    return { success: false, error }
  }
}

// Acción para guardar categorías de productos
export async function saveProductCategories(products: any[]) {
  try {
    logger.info('Saving product categories', { count: products.length })
    await saveProducts(products)
    return { success: true }
  } catch (error) {
    logger.error('Error in saveProductCategories', error)
    return { success: false, error }
  }
}

// Acción para guardar sobrantes
export async function saveLeftoversData(leftovers: any[]) {
  try {
    logger.info('Starting leftovers save process', { count: leftovers.length })
    await saveLeftovers(leftovers)

    logger.debug('Saved leftovers to database, processing with AI')

    // Procesar sobrantes con OpenAI para obtener recomendaciones
    const aiResponse = await processLeftovers(leftovers)

    // Guardar recomendaciones
    if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
      logger.info('Saving AI recommendations', { count: aiResponse.recommendations.length })
      await saveRecommendations(aiResponse.recommendations)
    }

    logger.info('Leftovers save process completed successfully')
    return { success: true }
  } catch (error) {
    logger.error('Error in saveLeftoversData', error)
    return { success: false, error }
  }
}

// Acción para generar menú semanal
export async function generateMenu() {
  try {
    logger.info('Starting weekly menu generation')

    // Obtener datos necesarios
    const familyMembers = await getFamilyMembers()
    const restrictions = await getDietaryRestrictions()
    const prohibitedDishes = await getProhibitedDishes()
    const products = await getProducts()

    logger.debug('Retrieved data for menu generation', {
      familyMembersCount: familyMembers.length,
      restrictionsCount: restrictions.length,
      productsCount: products.length
    })

    // Generar menú con OpenAI
    const aiResponse = await generateWeeklyMenu(
      familyMembers,
      restrictions,
      prohibitedDishes.map((dish) => dish.name),
      products,
    )

    // Guardar menú generado
    if (aiResponse.weeklyMenu && aiResponse.weeklyMenu.length > 0) {
      logger.info('Saving generated menu', { count: aiResponse.weeklyMenu.length })
      await saveWeeklyMenu(aiResponse.weeklyMenu)
    }

    logger.info('Menu generation completed successfully')
    return { success: true, weeklyMenu: aiResponse.weeklyMenu }
  } catch (error) {
    logger.error('Error in generateMenu', error)
    return { success: false, error }
  }
}

// Acción para generar métricas
export async function generateMetricsData() {
  try {
    logger.info('Starting metrics generation')

    // Obtener datos necesarios
    const familyMembers = await getFamilyMembers()
    const products = await getProducts()
    const leftovers = await getLeftovers()

    logger.debug('Retrieved data for metrics generation', {
      familyMembersCount: familyMembers.length,
      productsCount: products.length,
      leftoversCount: leftovers.length
    })

    // Generar métricas con OpenAI
    const aiResponse = await generateMetrics(familyMembers, products, leftovers)

    // Guardar métricas y recomendaciones
    if (aiResponse.metrics) {
      logger.info('Saving generated metrics')
      await saveMetrics(aiResponse.metrics)
    }

    if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
      logger.info('Saving AI recommendations', { count: aiResponse.recommendations.length })
      await saveRecommendations(aiResponse.recommendations)
    }

    logger.info('Metrics generation completed successfully')
    return {
      success: true,
      metrics: aiResponse.metrics,
      recommendations: aiResponse.recommendations,
    }
  } catch (error) {
    logger.error('Error in generateMetricsData', error)
    return { success: false, error }
  }
}

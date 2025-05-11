import { createServerSupabaseClient } from "@/lib/supabase"

// Logger utility
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? data : '')
  },
  error: (message: string, error: any) => {
    console.error(`[ERROR] ${message}`, error)
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data ? data : '')
    }
  }
}

// Helper para manejar transacciones
async function withTransaction<T>(
  operation: (supabase: ReturnType<typeof createServerSupabaseClient>) => Promise<T>
): Promise<T> {
  const supabase = createServerSupabaseClient()
  try {
    logger.debug('Starting transaction')
    const result = await operation(supabase)
    logger.debug('Transaction completed successfully')
    return result
  } catch (error) {
    logger.error('Transaction failed', error)
    throw error
  }
}

// Servicio para manejar miembros de la familia
export async function saveFamilyMembers(familyMembers: any[]) {
  return withTransaction(async (supabase) => {
    logger.info('Saving family members', { count: familyMembers.length })

    // Primero eliminamos los registros existentes para evitar duplicados
    const { error: deleteError } = await supabase
      .from("family_members")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    if (deleteError) {
      logger.error('Error deleting existing family members', deleteError)
      throw deleteError
    }

    // Luego insertamos los nuevos registros
    const { data, error } = await supabase
      .from("family_members")
      .insert(
        familyMembers.map((member) => ({
          type: member.type,
          count: member.count,
        })),
      )
      .select()

    if (error) {
      logger.error('Error inserting family members', error)
      throw error
    }

    logger.info('Family members saved successfully', { count: data.length })
    return data
  })
}

// Servicio para manejar restricciones alimenticias
export async function saveDietaryRestrictions(restrictions: any[]) {
  return withTransaction(async (supabase) => {
    logger.info('Saving dietary restrictions', { count: restrictions.length })

    // Primero eliminamos los registros existentes
    const { error: deleteError } = await supabase
      .from("dietary_restrictions")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    if (deleteError) {
      logger.error('Error deleting existing restrictions', deleteError)
      throw deleteError
    }

    // Luego insertamos los nuevos registros
    const { data, error } = await supabase
      .from("dietary_restrictions")
      .insert(
        restrictions.map((restriction) => ({
          name: restriction.name,
          is_active: restriction.checked,
        })),
      )
      .select()

    if (error) {
      logger.error('Error inserting restrictions', error)
      throw error
    }

    logger.info('Dietary restrictions saved successfully', { count: data.length })
    return data
  })
}

// Servicio para manejar platos prohibidos
export async function saveProhibitedDishes(dishes: string[]) {
  return withTransaction(async (supabase) => {
    logger.info('Saving prohibited dishes', { count: dishes.length })

    // Primero eliminamos los registros existentes
    const { error: deleteError } = await supabase
      .from("prohibited_dishes")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    if (deleteError) {
      logger.error('Error deleting existing prohibited dishes', deleteError)
      throw deleteError
    }

    // Luego insertamos los nuevos registros
    const { data, error } = await supabase
      .from("prohibited_dishes")
      .insert(
        dishes.map((dish) => ({
          name: dish,
        })),
      )
      .select()

    if (error) {
      logger.error('Error inserting prohibited dishes', error)
      throw error
    }

    logger.info('Prohibited dishes saved successfully', { count: data.length })
    return data
  })
}

// Servicio para manejar productos
export async function saveProducts(products: any[]) {
  return withTransaction(async (supabase) => {
    logger.info('Saving products', { count: products.length })

    const { data, error } = await supabase
      .from("products")
      .insert(
        products.map((product) => ({
          name: product.name,
          quantity_portions: product.quantity_portions || null,
          quantity_units: product.quantity_units || null,
          quantity_kg: product.quantity_kg || null,
          unit_price: product.unit_price || null,
          total_price: product.total_price || null,
          category: product.category || null,
        })),
      )
      .select()

    if (error) {
      logger.error('Error inserting products', error)
      throw error
    }

    logger.info('Products saved successfully', { count: data.length })
    return data
  })
}

// Servicio para manejar sobrantes
export async function saveLeftovers(leftovers: any[]) {
  return withTransaction(async (supabase) => {
    logger.info('Saving leftovers', { count: leftovers.length })

    const { data, error } = await supabase
      .from("leftovers")
      .insert(
        leftovers.map((leftover) => ({
          meal: leftover.meal,
          product: leftover.product,
          quantity: leftover.quantity,
        })),
      )
      .select()

    if (error) {
      logger.error('Error inserting leftovers', error)
      throw error
    }

    logger.info('Leftovers saved successfully', { count: data.length })
    return data
  })
}

// Servicio para manejar menú semanal
export async function saveWeeklyMenu(weeklyMenu: any[]) {
  return withTransaction(async (supabase) => {
    logger.info('Saving weekly menu', { count: weeklyMenu.length })

    // Primero eliminamos los registros existentes
    const { error: deleteError } = await supabase
      .from("weekly_menu")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    if (deleteError) {
      logger.error('Error deleting existing weekly menu', deleteError)
      throw deleteError
    }

    // Luego insertamos los nuevos registros
    const { data, error } = await supabase
      .from("weekly_menu")
      .insert(
        weeklyMenu.map((menu) => ({
          day: menu.day,
          recipe: menu.recipe,
          protein: menu.protein,
          side: menu.side,
        })),
      )
      .select()

    if (error) {
      logger.error('Error inserting weekly menu', error)
      throw error
    }

    logger.info('Weekly menu saved successfully', { count: data.length })
    return data
  })
}

// Servicio para manejar métricas
export async function saveMetrics(metrics: any) {
  return withTransaction(async (supabase) => {
    logger.info('Saving metrics', metrics)

    const { data, error } = await supabase
      .from("metrics")
      .insert({
        waste_percentage: metrics.wastePercentage,
        estimated_savings: metrics.estimatedSavings,
        week_number: new Date().getWeek(),
      })
      .select()

    if (error) {
      logger.error('Error inserting metrics', error)
      throw error
    }

    logger.info('Metrics saved successfully')
    return data
  })
}

// Servicio para manejar recomendaciones
export async function saveRecommendations(recommendations: string[]) {
  return withTransaction(async (supabase) => {
    logger.info('Saving recommendations', { count: recommendations.length })

    // Primero eliminamos los registros existentes
    const { error: deleteError } = await supabase
      .from("recommendations")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    if (deleteError) {
      logger.error('Error deleting existing recommendations', deleteError)
      throw deleteError
    }

    // Luego insertamos los nuevos registros
    const { data, error } = await supabase
      .from("recommendations")
      .insert(
        recommendations.map((recommendation) => ({
          text: recommendation,
        })),
      )
      .select()

    if (error) {
      logger.error('Error inserting recommendations', error)
      throw error
    }

    logger.info('Recommendations saved successfully', { count: data.length })
    return data
  })
}

// Servicios para obtener datos

export async function getFamilyMembers() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("family_members").select("*")
  if (error) throw error
  return data
}

export async function getDietaryRestrictions() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("dietary_restrictions").select("*")
  if (error) throw error
  return data
}

export async function getProhibitedDishes() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("prohibited_dishes").select("*")
  if (error) throw error
  return data
}

export async function getProducts() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("products").select("*")
  if (error) throw error
  return data
}

export async function getLeftovers() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("leftovers").select("*")
  if (error) throw error
  return data
}

export async function getWeeklyMenu() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("weekly_menu").select("*")
  if (error) throw error
  return data
}

export async function getMetrics() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("metrics").select("*").order("created_at", { ascending: false }).limit(5)
  if (error) throw error
  return data
}

export async function getRecommendations() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("recommendations").select("*")
  if (error) throw error
  return data
}

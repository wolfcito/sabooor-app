import { createServerSupabaseClient } from "@/lib/supabase"

// Servicio para manejar miembros de la familia
export async function saveFamilyMembers(familyMembers: any[]) {
  const supabase = createServerSupabaseClient()

  // Primero eliminamos los registros existentes para evitar duplicados
  await supabase.from("family_members").delete().neq("id", "00000000-0000-0000-0000-000000000000")

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

  if (error) throw error
  return data
}

// Servicio para manejar restricciones alimenticias
export async function saveDietaryRestrictions(restrictions: any[]) {
  const supabase = createServerSupabaseClient()

  // Primero eliminamos los registros existentes para evitar duplicados
  await supabase.from("dietary_restrictions").delete().neq("id", "00000000-0000-0000-0000-000000000000")

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

  if (error) throw error
  return data
}

// Servicio para manejar platos prohibidos
export async function saveProhibitedDishes(dishes: string[]) {
  const supabase = createServerSupabaseClient()

  // Primero eliminamos los registros existentes para evitar duplicados
  await supabase.from("prohibited_dishes").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  // Luego insertamos los nuevos registros
  const { data, error } = await supabase
    .from("prohibited_dishes")
    .insert(
      dishes.map((dish) => ({
        name: dish,
      })),
    )
    .select()

  if (error) throw error
  return data
}

// Servicio para manejar productos
export async function saveProducts(products: any[]) {
  const supabase = createServerSupabaseClient()

  // Insertamos los nuevos productos
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

  if (error) throw error
  return data
}

// Servicio para manejar sobrantes
export async function saveLeftovers(leftovers: any[]) {
  const supabase = createServerSupabaseClient()

  // Insertamos los nuevos sobrantes
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

  if (error) throw error
  return data
}

// Servicio para manejar menú semanal
export async function saveWeeklyMenu(weeklyMenu: any[]) {
  const supabase = createServerSupabaseClient()

  // Primero eliminamos los registros existentes para evitar duplicados
  await supabase.from("weekly_menu").delete().neq("id", "00000000-0000-0000-0000-000000000000")

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

  if (error) throw error
  return data
}

// Servicio para manejar métricas
export async function saveMetrics(metrics: any) {
  const supabase = createServerSupabaseClient()

  // Insertamos las nuevas métricas
  const { data, error } = await supabase
    .from("metrics")
    .insert({
      waste_percentage: metrics.wastePercentage,
      estimated_savings: metrics.estimatedSavings,
      week_number: new Date().getWeek(), // Necesitarías implementar esta función
    })
    .select()

  if (error) throw error
  return data
}

// Servicio para manejar recomendaciones
export async function saveRecommendations(recommendations: string[]) {
  const supabase = createServerSupabaseClient()

  // Primero eliminamos los registros existentes para evitar duplicados
  await supabase.from("recommendations").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  // Luego insertamos los nuevos registros
  const { data, error } = await supabase
    .from("recommendations")
    .insert(
      recommendations.map((recommendation) => ({
        text: recommendation,
      })),
    )
    .select()

  if (error) throw error
  return data
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

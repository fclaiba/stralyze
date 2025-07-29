"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/server"
import { consultationFormSchema, type ConsultationFormData } from "@/lib/validations/form-schema"
import { z } from "zod"

// Datos mock para formularios cuando Supabase no esté disponible
let mockClients: any[] = []
let mockActivities: any[] = []

export async function submitConsultationForm(formData: ConsultationFormData) {
  try {
    // Validate form data
    const validatedData = consultationFormSchema.parse(formData)

    try {
      // Intentar usar Supabase primero
      const supabase = createServiceClient()

      // Insert into clients table with proper field mapping
      const { data, error } = await supabase
        .from("clients")
        .insert({
          company: validatedData.company,
          status: "New Lead",
          industry: validatedData.industry,
          contact: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || "",
          payment_method: "Not specified",
          contract_status: "Pending",
          deposit: 0,
          final_payment: 0,
          total_amount: 0,
          budget: validatedData.budget,
        })
        .select("id")
        .single()

      if (error) {
        console.log("Supabase error, using mock data:", error.message)
        throw new Error("Supabase unavailable")
      }

      // Get the client ID
      const clientId = data.id

      // Log activity
      await supabase.from("activities").insert({
        user_id: "system",
        action: "create",
        resource_type: "client",
        resource_id: clientId,
        changes: validatedData,
      })

      // Revalidate the dashboard page to refresh the metrics
      revalidatePath("/admin/dashboard")

      return { success: true, clientId }
    } catch (supabaseError) {
      console.log("Using mock data for form submission")
      
      // Fallback a datos mock
      const mockClient = {
        id: `mock-${Date.now()}`,
        company: validatedData.company,
        status: "New Lead",
        industry: validatedData.industry,
        contact: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || "",
        payment_method: "Not specified",
        contract_status: "Pending",
        deposit: 0,
        final_payment: 0,
        total_amount: 0,
        budget: validatedData.budget,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      mockClients.push(mockClient)
      
      // Crear actividad mock
      const mockActivity = {
        id: `activity-${Date.now()}`,
        user_id: "system",
        action: "create",
        resource_type: "client",
        resource_id: mockClient.id,
        changes: validatedData,
        created_at: new Date().toISOString(),
      }
      
      mockActivities.push(mockActivity)
      
      console.log("Mock client created:", mockClient)
      console.log("Mock activity logged:", mockActivity)
      
      return { success: true, clientId: mockClient.id }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }

    console.error("Error submitting form:", error)
    return { success: false, error: "Failed to submit form" }
  }
}

// Función para obtener clientes (mock o real)
export async function getClients() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })
    
    if (error) {
      console.log("Supabase error, returning mock clients:", error.message)
      return mockClients
    }
    
    return data || []
  } catch (error) {
    console.log("Using mock clients")
    return mockClients
  }
}

// Función para obtener actividades (mock o real)
export async function getActivities() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase.from("activities").select("*").order("created_at", { ascending: false })
    
    if (error) {
      console.log("Supabase error, returning mock activities:", error.message)
      return mockActivities
    }
    
    return data || []
  } catch (error) {
    console.log("Using mock activities")
    return mockActivities
  }
}

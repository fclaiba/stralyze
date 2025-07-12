"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/server"
import { consultationFormSchema, type ConsultationFormData } from "@/lib/validations/form-schema"
import { z } from "zod"

export async function submitConsultationForm(formData: ConsultationFormData) {
  try {
    // Validate form data
    const validatedData = consultationFormSchema.parse(formData)

    // Create Supabase client with service role to bypass RLS
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
      console.error("Error inserting client:", error)
      return { success: false, error: error.message }
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }

    console.error("Error submitting form:", error)
    return { success: false, error: "Failed to submit form" }
  }
}

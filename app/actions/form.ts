"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import { consultationFormSchema, type ConsultationFormData } from "@/lib/validations/form-schema"

export async function submitConsultationForm(formData: ConsultationFormData) {
  try {
    // Validate the form data
    const validatedData = consultationFormSchema.parse(formData)

    // Create a Supabase client
    const supabase = createServerClient()

    // Insert the form data into the clients table
    const { data, error } = await supabase
      .from("clients")
      .insert({
        contact: validatedData.name,
        company: validatedData.company,
        industry: validatedData.industry,
        email: validatedData.email,
        phone: validatedData.phone || null,
        budget: validatedData.budget,
        status: "New Lead",
        payment_method: "Not specified",
        contract_status: "Pending",
        deposit: 0,
        final_payment: 0,
        total_amount: 0,
      })
      .select()

    if (error) {
      throw error
    }

    // Revalidate the dashboard page to show the new client
    revalidatePath("/admin/dashboard")

    return { success: true, data }
  } catch (error) {
    console.error("Error submitting form:", error)
    return { success: false, error: "Failed to submit form" }
  }
}

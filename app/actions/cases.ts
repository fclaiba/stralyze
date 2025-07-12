"use server"

import { 
  getCases, 
  getCase, 
  createCase, 
  updateCase, 
  deleteCase, 
  getCasesByStatus, 
  getCasesByClient 
} from "@/lib/data/cases"
import { revalidatePath } from "next/cache"

export async function fetchCasesAction() {
  try {
    const result = await getCases()
    return result
  } catch (error) {
    console.error("Error in fetchCasesAction:", error)
    return { success: false, error: "Failed to fetch cases" }
  }
}

export async function fetchCaseAction(id: string) {
  try {
    const result = await getCase(id)
    return result
  } catch (error) {
    console.error("Error in fetchCaseAction:", error)
    return { success: false, error: "Failed to fetch case" }
  }
}

export async function createCaseAction(caseData: any) {
  try {
    const result = await createCase(caseData)
    if (result.success) {
      revalidatePath("/admin/dashboard")
      revalidatePath("/admin/cases")
    }
    return result
  } catch (error) {
    console.error("Error in createCaseAction:", error)
    return { success: false, error: "Failed to create case" }
  }
}

export async function updateCaseAction(id: string, caseData: any) {
  try {
    const result = await updateCase(id, caseData)
    if (result.success) {
      revalidatePath("/admin/dashboard")
      revalidatePath("/admin/cases")
    }
    return result
  } catch (error) {
    console.error("Error in updateCaseAction:", error)
    return { success: false, error: "Failed to update case" }
  }
}

export async function deleteCaseAction(id: string) {
  try {
    const result = await deleteCase(id)
    if (result.success) {
      revalidatePath("/admin/dashboard")
      revalidatePath("/admin/cases")
    }
    return result
  } catch (error) {
    console.error("Error in deleteCaseAction:", error)
    return { success: false, error: "Failed to delete case" }
  }
}

export async function fetchCasesByStatusAction(status: string) {
  try {
    const result = await getCasesByStatus(status)
    return result
  } catch (error) {
    console.error("Error in fetchCasesByStatusAction:", error)
    return { success: false, error: "Failed to fetch cases by status" }
  }
}

export async function fetchCasesByClientAction(clientId: string) {
  try {
    const result = await getCasesByClient(clientId)
    return result
  } catch (error) {
    console.error("Error in fetchCasesByClientAction:", error)
    return { success: false, error: "Failed to fetch cases by client" }
  }
} 
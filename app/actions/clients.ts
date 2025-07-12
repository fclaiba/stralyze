"use server"

import { getClients, createClient, updateClient, deleteClient, searchClients } from "@/lib/data/clients"
import { revalidatePath } from "next/cache"

export async function fetchClientsAction() {
  try {
    const result = await getClients()
    return result
  } catch (error) {
    console.error("Error in fetchClientsAction:", error)
    return { success: false, error: "Failed to fetch clients" }
  }
}

export async function createClientAction(clientData: any) {
  try {
    const result = await createClient(clientData)
    if (result.success) {
      revalidatePath("/admin/dashboard")
      revalidatePath("/admin/clients")
    }
    return result
  } catch (error) {
    console.error("Error in createClientAction:", error)
    return { success: false, error: "Failed to create client" }
  }
}

export async function updateClientAction(id: string, clientData: any) {
  try {
    const result = await updateClient(id, clientData)
    if (result.success) {
      revalidatePath("/admin/dashboard")
      revalidatePath("/admin/clients")
    }
    return result
  } catch (error) {
    console.error("Error in updateClientAction:", error)
    return { success: false, error: "Failed to update client" }
  }
}

export async function deleteClientAction(id: string) {
  try {
    const result = await deleteClient(id)
    if (result.success) {
      revalidatePath("/admin/dashboard")
      revalidatePath("/admin/clients")
    }
    return result
  } catch (error) {
    console.error("Error in deleteClientAction:", error)
    return { success: false, error: "Failed to delete client" }
  }
}

export async function searchClientsAction(query: string) {
  try {
    const result = await searchClients(query)
    return result
  } catch (error) {
    console.error("Error in searchClientsAction:", error)
    return { success: false, error: "Failed to search clients" }
  }
}

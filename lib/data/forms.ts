import { promises as fs } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import type { Form } from "@/types"

const formsPath = path.join(process.cwd(), "app/data/forms.json")

export async function getForms(): Promise<Form[]> {
  const data = await fs.readFile(formsPath, "utf8")
  return JSON.parse(data).forms
}

export async function getForm(id: string): Promise<Form | null> {
  const forms = await getForms()
  return forms.find((form) => form.id === id) || null
}

export async function createForm(formData: Omit<Form, "id" | "createdAt" | "updatedAt">): Promise<Form> {
  const forms = await getForms()

  const newForm: Form = {
    ...formData,
    id: `frm_${uuidv4()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  forms.push(newForm)
  await fs.writeFile(formsPath, JSON.stringify({ forms }, null, 2))

  return newForm
}

export async function updateForm(id: string, formData: Partial<Form>): Promise<Form | null> {
  const forms = await getForms()
  const index = forms.findIndex((form) => form.id === id)

  if (index === -1) return null

  forms[index] = {
    ...forms[index],
    ...formData,
    updatedAt: new Date().toISOString(),
  }

  await fs.writeFile(formsPath, JSON.stringify({ forms }, null, 2))

  return forms[index]
}

export async function deleteForm(id: string): Promise<boolean> {
  const forms = await getForms()
  const filteredForms = forms.filter((form) => form.id !== id)

  if (filteredForms.length === forms.length) return false

  await fs.writeFile(formsPath, JSON.stringify({ forms: filteredForms }, null, 2))

  return true
}

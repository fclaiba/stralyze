// User-specific types
export type UserRole = "super-admin" | "admin" | "gestor" | "user"

export type User = {
  id: string
  email: string
  name: string
  role: UserRole
  password: string
  createdAt: string
  updatedAt: string
}

import type { User } from "@/types/user"

type Permission =
  | "viewDashboard"
  | "registerUsers"
  | "editUsers"
  | "deleteUsers"
  | "viewClients"
  | "editClients"
  | "deleteClients"

const permissionsByRole: Record<User["role"], Permission[]> = {
  "super-admin": [
    "viewDashboard",
    "registerUsers",
    "editUsers",
    "deleteUsers",
    "viewClients",
    "editClients",
    "deleteClients",
  ],
  admin: ["viewDashboard", "registerUsers", "editUsers", "viewClients", "editClients"],
  gestor: ["viewDashboard", "viewClients"],
  user: [],
}

export function hasPermission(user: User, permission: Permission): boolean {
  return permissionsByRole[user.role].includes(permission)
}

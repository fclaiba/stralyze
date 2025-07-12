// Activity-specific types
export type Activity = {
  id: string
  userId: string
  action: "create" | "update" | "delete"
  resourceType: "client" | "form" | "user"
  resourceId: string
  changes: any
  createdAt: string
}

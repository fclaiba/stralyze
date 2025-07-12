import { v4 as uuidv4 } from "uuid"
import type { Activity } from "@/types/activity"

// In-memory storage for activities
const activities: Activity[] = []

export async function getActivities(): Promise<Activity[]> {
  return activities
}

export async function createActivity(activityData: Omit<Activity, "id" | "createdAt">): Promise<Activity> {
  const newActivity: Activity = {
    ...activityData,
    id: `act_${uuidv4()}`,
    createdAt: new Date().toISOString(),
  }

  activities.push(newActivity)
  return newActivity
}

export async function getActivityByResource(resourceType: string, resourceId: string): Promise<Activity[]> {
  return activities.filter((activity) => activity.resourceType === resourceType && activity.resourceId === resourceId)
}

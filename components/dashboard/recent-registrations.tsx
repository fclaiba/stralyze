"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserPlus, Clock } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface RecentRegistrationsProps {
  users?: User[]
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    createdAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "User",
    createdAt: "2024-01-19T14:20:00Z",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    role: "Editor",
    createdAt: "2024-01-18T09:15:00Z",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@example.com",
    role: "User",
    createdAt: "2024-01-17T16:45:00Z",
  },
  {
    id: "5",
    name: "Eva Brown",
    email: "eva@example.com",
    role: "Admin",
    createdAt: "2024-01-16T11:30:00Z",
  },
]

export default function RecentRegistrations({ users: propUsers }: RecentRegistrationsProps) {
  const [users, setUsers] = useState<User[]>(propUsers || [])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (propUsers) {
      setUsers(propUsers)
      setLoading(false)
    } else {
      // Simulate loading
      const timer = setTimeout(() => {
        setUsers(mockUsers)
        setLoading(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [propUsers])

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "editor":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "user":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  return (
    <Card className="bg-gray-800/80 border-white/20 backdrop-blur-sm" data-testid="recent-registrations">
      <CardHeader>
        <CardTitle className="text-gray-200 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-green-400" />
          Recent Registrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded mb-1"></div>
                  <div className="h-3 bg-gray-600 rounded w-32"></div>
                </div>
                <div className="h-5 bg-gray-600 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gray-600 text-gray-200 text-sm">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-200 font-medium truncate">{user.name}</div>
                  <div className="text-gray-400 text-sm truncate">{user.email}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(user.createdAt)}
                  </div>
                </div>
              </div>
            ))}
            {users.length === 0 && <div className="text-center py-8 text-gray-400">No recent registrations found.</div>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

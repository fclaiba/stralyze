"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle, 
  Trash2, 
  Plus,
  Filter,
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  getNotifications, 
  getUnreadNotifications, 
  markNotificationAsRead, 
  deleteNotification,
  type Notification 
} from "@/lib/data/notifications"

export default function NotificationsView() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    filterNotifications()
  }, [notifications, filter, searchTerm])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getNotifications()

      if (result.success && result.data) {
        setNotifications(result.data)
      } else {
        setError(result.error || "Failed to load notifications")
        toast({
          title: "Error",
          description: result.error || "Failed to load notifications. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "Failed to load notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterNotifications = () => {
    let filtered = notifications

    // Filtrar por estado (leído/no leído)
    if (filter === "unread") {
      filtered = filtered.filter(notification => !notification.is_read)
    } else if (filter === "read") {
      filtered = filtered.filter(notification => notification.is_read)
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(notification =>
        notification.message.toLowerCase().includes(searchLower) ||
        notification.type.toLowerCase().includes(searchLower) ||
        (notification.user?.name && notification.user.name.toLowerCase().includes(searchLower))
      )
    }

    setFilteredNotifications(filtered)
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const result = await markNotificationAsRead(id)
      if (result.success) {
        toast({
          title: "Notification marked as read",
          description: "The notification has been marked as read.",
        })
        loadNotifications()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to mark notification as read.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNotification = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) {
      return
    }

    try {
      const result = await deleteNotification(id)
      if (result.success) {
        toast({
          title: "Notification deleted",
          description: "The notification has been deleted successfully.",
        })
        loadNotifications()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete the notification.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast({
        title: "Error",
        description: "Failed to delete the notification.",
        variant: "destructive",
      })
    }
  }

  const handleViewNotification = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsDetailDialogOpen(true)
    
    // Marcar como leído si no lo está
    if (!notification.is_read) {
      handleMarkAsRead(notification.id)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge className="bg-green-500 text-white">Success</Badge>
      case "warning":
        return <Badge className="bg-yellow-500 text-black">Warning</Badge>
      case "error":
        return <Badge className="bg-red-500 text-white">Error</Badge>
      default:
        return <Badge className="bg-blue-500 text-white">Info</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Notifications</h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-white text-black hover:bg-gray-200">
            <Plus className="h-4 w-4 mr-2" />
            Create Notification
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="all">All Notifications</SelectItem>
            <SelectItem value="unread">Unread Only</SelectItem>
            <SelectItem value="read">Read Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading notifications...</p>
        </div>
      ) : error ? (
        <Card className="bg-gray-800/80 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <Button onClick={loadNotifications} className="bg-white text-black hover:bg-gray-200">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : filteredNotifications.length === 0 ? (
        <Card className="bg-gray-800/80 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400">No notifications found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`bg-gray-800/80 border-gray-700 cursor-pointer transition-colors hover:bg-gray-700/80 ${
                !notification.is_read ? 'border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => handleViewNotification(notification)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getNotificationBadge(notification.type)}
                        {!notification.is_read && (
                          <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-white font-medium mb-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{notification.user?.name || 'System'}</span>
                        <span>{formatDate(notification.sent_at)}</span>
                        {notification.event && (
                          <span>Event: {notification.event.title}</span>
                        )}
                        {notification.case && (
                          <span>Case: {notification.case.title}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    {!notification.is_read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(notification.id)
                        }}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteNotification(notification.id)
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de detalles */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              {selectedNotification && getNotificationIcon(selectedNotification.type)}
              Notification Details
            </DialogTitle>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getNotificationBadge(selectedNotification.type)}
                {!selectedNotification.is_read && (
                  <Badge className="bg-blue-500 text-white">New</Badge>
                )}
              </div>
              <p className="text-white text-lg">{selectedNotification.message}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">From:</span>
                  <p className="text-white">{selectedNotification.user?.name || 'System'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Date:</span>
                  <p className="text-white">{formatDate(selectedNotification.sent_at)}</p>
                </div>
                {selectedNotification.event && (
                  <div>
                    <span className="text-gray-400">Related Event:</span>
                    <p className="text-white">{selectedNotification.event.title}</p>
                  </div>
                )}
                {selectedNotification.case && (
                  <div>
                    <span className="text-gray-400">Related Case:</span>
                    <p className="text-white">{selectedNotification.case.title}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de crear notificación (placeholder) */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Create Notification</DialogTitle>
          </DialogHeader>
          <p className="text-gray-300">Notification creation form will be implemented here.</p>
        </DialogContent>
      </Dialog>
    </>
  )
} 
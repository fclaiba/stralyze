"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar as CalendarIcon, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Clock, MapPin, Users, Loader2, AlertCircle, CheckCircle, Calendar, Bell, Star, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: number
  type: "meeting" | "deadline" | "reminder" | "task" | "appointment"
  priority: "low" | "medium" | "high" | "urgent"
  location?: string
  attendees: User[]
  isAllDay: boolean
  color: string
  recurring?: "none" | "daily" | "weekly" | "monthly" | "yearly"
  notifications: {
    oneDayBefore: boolean
    sameDayMorning: boolean
    oneHourBefore: boolean
    fiveMinutesBefore: boolean
  }
}

// Mock users for assignment
const mockUsers: User[] = [
  { id: "1", name: "John Smith", email: "john@example.com", role: "Manager" },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com", role: "Developer" },
  { id: "3", name: "Mike Davis", email: "mike@example.com", role: "Designer" },
  { id: "4", name: "Lisa Wilson", email: "lisa@example.com", role: "Analyst" },
  { id: "5", name: "David Brown", email: "david@example.com", role: "Consultant" }
]

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Client Meeting - TechCorp",
    description: "Quarterly review meeting with TechCorp team",
    date: "2024-02-15",
    time: "10:00",
    duration: 60,
    type: "meeting",
    priority: "high",
    location: "Conference Room A",
    attendees: [mockUsers[0], mockUsers[1]],
    isAllDay: false,
    color: "blue",
    notifications: {
      oneDayBefore: true,
      sameDayMorning: true,
      oneHourBefore: true,
      fiveMinutesBefore: false
    }
  },
  {
    id: "2",
    title: "Project Deadline - Website Redesign",
    description: "Final delivery for TechCorp website redesign",
    date: "2024-02-20",
    time: "17:00",
    duration: 0,
    type: "deadline",
    priority: "high",
    attendees: [mockUsers[1], mockUsers[2]],
    isAllDay: true,
    color: "red",
    notifications: {
      oneDayBefore: true,
      sameDayMorning: true,
      oneHourBefore: false,
      fiveMinutesBefore: false
    }
  },
  {
    id: "3",
    title: "Team Standup",
    description: "Daily team synchronization meeting",
    date: "2024-02-16",
    time: "09:00",
    duration: 30,
    type: "meeting",
    priority: "medium",
    attendees: mockUsers,
    isAllDay: false,
    color: "green",
    recurring: "daily",
    notifications: {
      oneDayBefore: false,
      sameDayMorning: true,
      oneHourBefore: true,
      fiveMinutesBefore: false
    }
  }
]

export default function CalendarView() {
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 60,
    type: "meeting" as Event["type"],
    priority: "medium" as Event["priority"],
    location: "",
    attendees: [] as string[],
    isAllDay: false,
    color: "blue",
    recurring: "none" as Event["recurring"],
    notifications: {
      oneDayBefore: true,
      sameDayMorning: true,
      oneHourBefore: true,
      fiveMinutesBefore: false
    }
  })

  // Calendar generation functions
  function generateMonthDays() {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const endDate = new Date(lastDay)
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d))
    }
    
    return days
  }

  function generateWeekDays() {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    
    return days
  }

  function generateDayHours() {
    const hours = []
    for (let i = 0; i < 24; i++) {
      hours.push(i)
    }
    return hours
  }

  function getEventsForDate(date: Date) {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateStr)
  }

  function getEventsForDateAndHour(date: Date, hour: number) {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => {
      if (event.date !== dateStr) return false
      if (event.isAllDay) return true
      const eventHour = parseInt(event.time.split(':')[0])
      return eventHour === hour
    })
  }

  // Event handlers
  function handleCreateEvent() {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      const selectedUsers = mockUsers.filter(user => formData.attendees.includes(user.id))
      
      const newEvent: Event = {
        id: Date.now().toString(),
        title: formData.title || "New Event",
        description: formData.description || "Event description",
        date: formData.date || new Date().toISOString().split('T')[0],
        time: formData.time || "09:00",
        duration: formData.duration,
        type: formData.type,
        priority: formData.priority,
        location: formData.location,
        attendees: selectedUsers,
        isAllDay: formData.isAllDay,
        color: formData.color,
        recurring: formData.recurring,
        notifications: formData.notifications
      }
      
      setEvents([...events, newEvent])
      setIsCreateDialogOpen(false)
      resetForm()
      setIsSubmitting(false)
      
      // Send notifications
      sendEventNotifications(newEvent)
      
      toast({
        title: "Event created",
        description: "New event has been created successfully.",
      })
    }, 1000)
  }

  function handleEditEvent(event: Event) {
    setSelectedEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      duration: event.duration,
      type: event.type,
      priority: event.priority,
      location: event.location || "",
      attendees: event.attendees.map(u => u.id),
      isAllDay: event.isAllDay,
      color: event.color,
      recurring: event.recurring || "none",
      notifications: event.notifications
    })
    setIsEditDialogOpen(true)
  }

  function handleUpdateEvent() {
    if (!selectedEvent) return
    
    setIsSubmitting(true)
    
    setTimeout(() => {
      const selectedUsers = mockUsers.filter(user => formData.attendees.includes(user.id))
      
      const updatedEvent: Event = {
        ...selectedEvent,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        type: formData.type,
        priority: formData.priority,
        location: formData.location,
        attendees: selectedUsers,
        isAllDay: formData.isAllDay,
        color: formData.color,
        recurring: formData.recurring,
        notifications: formData.notifications
      }
      
      setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e))
      setIsEditDialogOpen(false)
      resetForm()
      setIsSubmitting(false)
      
      toast({
        title: "Event updated",
        description: "Event has been updated successfully.",
      })
    }, 1000)
  }

  function handleDeleteEvent(event: Event) {
    setEventToDelete(event)
    setIsDeleteDialogOpen(true)
  }

  function confirmDeleteEvent() {
    if (!eventToDelete) return
    
    setLoading(true)
    
    setTimeout(() => {
      setEvents(events.filter(e => e.id !== eventToDelete.id))
      setIsDeleteDialogOpen(false)
      setEventToDelete(null)
      setLoading(false)
      
      toast({
        title: "Event deleted",
        description: "Event has been deleted successfully.",
      })
    }, 1000)
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: 60,
      type: "meeting",
      priority: "medium",
      location: "",
      attendees: [],
      isAllDay: false,
      color: "blue",
      recurring: "none",
      notifications: {
        oneDayBefore: true,
        sameDayMorning: true,
        oneHourBefore: true,
        fiveMinutesBefore: false
      }
    })
    setSelectedEvent(null)
  }

  function sendEventNotifications(event: Event) {
    // Simulate sending email notifications
    event.attendees.forEach(attendee => {
      console.log(`Sending notification to ${attendee.email} for event: ${event.title}`)
      
      if (event.notifications.oneDayBefore) {
        console.log(`Scheduling 1-day notification for ${attendee.email}`)
      }
      if (event.notifications.sameDayMorning) {
        console.log(`Scheduling same-day morning notification for ${attendee.email}`)
      }
      if (event.notifications.oneHourBefore) {
        console.log(`Scheduling 1-hour notification for ${attendee.email}`)
      }
      if (event.notifications.fiveMinutesBefore) {
        console.log(`Scheduling 5-minute notification for ${attendee.email}`)
      }
    })
  }

  // Utility functions
  function getEventTypeIcon(type: string) {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4 text-blue-400" />
      case "deadline":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case "reminder":
        return <Bell className="h-4 w-4 text-yellow-400" />
      case "task":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "appointment":
        return <Calendar className="h-4 w-4 text-purple-400" />
      default:
        return <CalendarIcon className="h-4 w-4 text-gray-400" />
    }
  }

  function getPriorityBadge(priority: string) {
    const variants = {
      low: "bg-green-500 text-white",
      medium: "bg-blue-500 text-white",
      high: "bg-orange-500 text-white",
      urgent: "bg-red-500 text-white"
    }
    
    return (
      <Badge className={variants[priority as keyof typeof variants]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  function getColorClass(color: string) {
    const colors = {
      blue: "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20",
      red: "border-l-red-500 bg-red-50 dark:bg-red-900/20",
      green: "border-l-green-500 bg-green-50 dark:bg-green-900/20",
      purple: "border-l-purple-500 bg-purple-50 dark:bg-purple-900/20",
      orange: "border-l-orange-500 bg-orange-50 dark:bg-orange-900/20",
      yellow: "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
    }
    
    return colors[color as keyof typeof colors] || colors.blue
  }

  function formatTime(time: string) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  function isToday(date: Date) {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  function isSelected(date: Date) {
    return selectedDate?.toDateString() === date.toDateString()
  }

  function navigateMonth(direction: 'prev' | 'next') {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  function navigateWeek(direction: 'prev' | 'next') {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  function navigateDay(direction: 'prev' | 'next') {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const weekRange = generateWeekDays()
  const weekStart = weekRange[0]
  const weekEnd = weekRange[6]
  const weekRangeText = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`
  const dayText = formatDate(currentDate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (viewMode === "month") navigateMonth('prev')
              else if (viewMode === "week") navigateWeek('prev')
              else navigateDay('prev')
            }}
            className="text-black-200 border-gray-600 hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-xl font-semibold text-gray-200">
            {viewMode === "month" ? monthName : viewMode === "week" ? weekRangeText : dayText}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (viewMode === "month") navigateMonth('next')
              else if (viewMode === "week") navigateWeek('next')
              else navigateDay('next')
            }}
            className="text-black-200 border-gray-600 hover:bg-gray-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode("month")}
            className={viewMode === "month" ? "bg-white text-black-200" : "text-gray-200 border-gray-600 hover:bg-gray-700"}
          >
            Month
          </Button>
          <Button
            onClick={() => setViewMode("week")}
            className={viewMode === "week" ? "bg-white text-black-200" : "text-gray-200 border-gray-600 hover:bg-gray-700"}
          >
            Week
          </Button>
          <Button
            onClick={() => setViewMode("day")}
            className={viewMode === "day" ? "bg-white text-black-200" : "text-gray-200 border-gray-600 hover:bg-gray-700"}
          >
            Day
          </Button>
        </div>
      </div>

      {/* Calendar Views */}
      {viewMode === "month" && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-200">Monthly View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                  {day}
                </div>
              ))}
              {generateMonthDays().map((date, index) => {
                const dayEvents = getEventsForDate(date)
                const isCurrentMonth = date.getMonth() === currentDate.getMonth()
                
                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border border-gray-700 ${
                      isCurrentMonth ? 'bg-gray-800' : 'bg-gray-900'
                    } ${isToday(date) ? 'ring-2 ring-blue-500' : ''} ${
                      isSelected(date) ? 'bg-blue-900/20' : ''
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className={`text-sm font-medium ${
                      isCurrentMonth ? 'text-gray-200' : 'text-gray-600'
                    } ${isToday(date) ? 'text-blue-400' : ''}`}>
                      {date.getDate()}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded cursor-pointer ${getColorClass(event.color)}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditEvent(event)
                          }}
                        >
                          <div className="font-medium text-gray-800 dark:text-gray-200">
                            {event.title}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {event.isAllDay ? "All Day" : formatTime(event.time)}
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "week" && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-200">Weekly View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-1">
              <div className="p-2"></div>
              {generateWeekDays().map((date, index) => (
                <div key={index} className="p-2 text-center">
                  <div className="text-sm font-medium text-gray-400">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-bold ${
                    isToday(date) ? 'text-blue-400' : 'text-gray-200'
                  }`}>
                    {date.getDate()}
                  </div>
                </div>
              ))}
              {generateDayHours().map(hour => (
                <div key={hour} className="contents">
                  <div className="p-2 text-right text-sm text-gray-400 border-t border-gray-700">
                    {formatTime(`${hour.toString().padStart(2, '0')}:00`)}
                  </div>
                  {generateWeekDays().map((date, dayIndex) => {
                    const hourEvents = getEventsForDateAndHour(date, hour)
                    
                    return (
                      <div
                        key={`${hour}-${dayIndex}`}
                        className="min-h-[60px] p-1 border-t border-gray-700 relative"
                      >
                        {hourEvents.map(event => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded cursor-pointer ${getColorClass(event.color)} mb-1`}
                            onClick={() => handleEditEvent(event)}
                          >
                            <div className="font-medium text-gray-800 dark:text-gray-200">
                              {event.title}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                              {formatTime(event.time)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "day" && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-200">Daily View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {generateDayHours().map(hour => {
                const hourEvents = getEventsForDateAndHour(currentDate, hour)
                
                return (
                  <div key={hour} className="flex">
                    <div className="w-20 p-2 text-sm text-gray-400 border-r border-gray-700">
                      {formatTime(`${hour.toString().padStart(2, '0')}:00`)}
                    </div>
                    <div className="flex-1 p-2 min-h-[60px] border-b border-gray-700">
                      {hourEvents.map(event => (
                        <div
                          key={event.id}
                          className={`p-2 rounded cursor-pointer ${getColorClass(event.color)} mb-2`}
                          onClick={() => handleEditEvent(event)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {getEventTypeIcon(event.type)}
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {event.title}
                            </span>
                            {getPriorityBadge(event.priority)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {event.description}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          )}
                          {event.attendees.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Users className="h-3 w-3" />
                              {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Event Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-white text-black-200 hover:bg-gray-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Create/Edit Event Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false)
          setIsEditDialogOpen(false)
          resetForm()
        }
      }}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isCreateDialogOpen ? "Create New Event" : "Edit Event"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200">Event Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Event Type</label>
                <Select value={formData.type} onValueChange={(value: Event["type"]) => setFormData({...formData, type: value})}>
                  <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Time</label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                  disabled={formData.isAllDay}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Duration (minutes)</label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                  disabled={formData.isAllDay}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200">Priority</label>
                <Select value={formData.priority} onValueChange={(value: Event["priority"]) => setFormData({...formData, priority: value})}>
                  <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Color</label>
                <Select value={formData.color} onValueChange={(value) => setFormData({...formData, color: value})}>
                  <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Recurring</label>
                <Select value={formData.recurring} onValueChange={(value) => setFormData({...formData, recurring: value as Event["recurring"]})}>
                  <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-200">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="mt-1 bg-gray-700 border-gray-600 text-white"
                placeholder="Enter location (optional)"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-200">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1 bg-gray-700 border-gray-600 text-white"
                rows={3}
                placeholder="Enter event description"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-200 mb-2 block">Assign Attendees</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {mockUsers.map(user => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={user.id}
                      checked={formData.attendees.includes(user.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            attendees: [...formData.attendees, user.id]
                          })
                        } else {
                          setFormData({
                            ...formData,
                            attendees: formData.attendees.filter(id => id !== user.id)
                          })
                        }
                      }}
                    />
                    <label htmlFor={user.id} className="text-sm text-gray-200">
                      {user.name} ({user.email}) - {user.role}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-200 mb-2 block">Email Notifications</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="oneDayBefore"
                    checked={formData.notifications.oneDayBefore}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      notifications: { ...formData.notifications, oneDayBefore: !!checked }
                    })}
                  />
                  <label htmlFor="oneDayBefore" className="text-sm text-gray-200">
                    1 day before the event
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameDayMorning"
                    checked={formData.notifications.sameDayMorning}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      notifications: { ...formData.notifications, sameDayMorning: !!checked }
                    })}
                  />
                  <label htmlFor="sameDayMorning" className="text-sm text-gray-200">
                    Same day morning (8:00 AM)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="oneHourBefore"
                    checked={formData.notifications.oneHourBefore}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      notifications: { ...formData.notifications, oneHourBefore: !!checked }
                    })}
                  />
                  <label htmlFor="oneHourBefore" className="text-sm text-gray-200">
                    1 hour before the event
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fiveMinutesBefore"
                    checked={formData.notifications.fiveMinutesBefore}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      notifications: { ...formData.notifications, fiveMinutesBefore: !!checked }
                    })}
                  />
                  <label htmlFor="fiveMinutesBefore" className="text-sm text-gray-200">
                    5 minutes before the event
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAllDay"
                checked={formData.isAllDay}
                onChange={(e) => setFormData({...formData, isAllDay: e.target.checked})}
                className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="isAllDay" className="text-sm font-medium text-gray-200">
                All Day Event
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  setIsEditDialogOpen(false)
                  resetForm()
                }}
                className="text-black-200 border-gray-600 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={isCreateDialogOpen ? handleCreateEvent : handleUpdateEvent}
                disabled={isSubmitting}
                className="bg-white text-black-200 hover:bg-gray-200"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {isCreateDialogOpen ? "Create Event" : "Update Event"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Event</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-black-200 border-gray-600 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteEvent}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
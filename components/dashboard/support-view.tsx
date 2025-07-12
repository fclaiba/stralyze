"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { 
  MessageSquare, 
  Plus, 
  Filter, 
  Search, 
  Edit, 
  Trash2, 
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  getSupportTickets, 
  getSupportTicket,
  createSupportTicket,
  updateSupportTicket,
  deleteSupportTicket,
  getSupportTicketsByStatus,
  getSupportTicketsByPriority,
  assignSupportTicket,
  updateTicketStatus,
  type SupportTicket 
} from "@/lib/data/support"

export default function SupportView() {
  const { toast } = useToast()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "in_progress" | "resolved" | "closed">("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high" | "urgent">("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadTickets()
  }, [])

  useEffect(() => {
    filterTickets()
  }, [tickets, statusFilter, priorityFilter, searchTerm])

  const loadTickets = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getSupportTickets()

      if (result.success && result.data) {
        setTickets(result.data)
      } else {
        setError(result.error || "Failed to load support tickets")
        toast({
          title: "Error",
          description: result.error || "Failed to load support tickets. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading support tickets:", error)
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "Failed to load support tickets. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterTickets = () => {
    let filtered = tickets

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter)
    }

    // Filtrar por prioridad
    if (priorityFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter)
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchLower) ||
        ticket.message.toLowerCase().includes(searchLower) ||
        ticket.category.toLowerCase().includes(searchLower) ||
        (ticket.user?.name && ticket.user.name.toLowerCase().includes(searchLower))
      )
    }

    setFilteredTickets(filtered)
  }

  const handleDeleteTicket = async (id: string) => {
    if (!confirm("Are you sure you want to delete this support ticket?")) {
      return
    }

    try {
      const result = await deleteSupportTicket(id)
      if (result.success) {
        toast({
          title: "Ticket deleted",
          description: "The support ticket has been deleted successfully.",
        })
        loadTickets()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete the ticket.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting ticket:", error)
      toast({
        title: "Error",
        description: "Failed to delete the ticket.",
        variant: "destructive",
      })
    }
  }

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setIsDetailDialogOpen(true)
  }

  const handleEditTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setIsEditDialogOpen(true)
  }

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const result = await updateTicketStatus(ticketId, newStatus)
      if (result.success) {
        toast({
          title: "Status updated",
          description: "The ticket status has been updated successfully.",
        })
        loadTickets()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update ticket status.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating ticket status:", error)
      toast({
        title: "Error",
        description: "Failed to update ticket status.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500 text-white">Open</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-500 text-black">In Progress</Badge>
      case "resolved":
        return <Badge className="bg-green-500 text-white">Resolved</Badge>
      case "closed":
        return <Badge className="bg-gray-500 text-white">Closed</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge className="bg-green-500 text-white">Low</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 text-black">Medium</Badge>
      case "high":
        return <Badge className="bg-orange-500 text-white">High</Badge>
      case "urgent":
        return <Badge className="bg-red-500 text-white">Urgent</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">{priority}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "technical":
        return <Badge className="bg-purple-500 text-white">Technical</Badge>
      case "billing":
        return <Badge className="bg-blue-500 text-white">Billing</Badge>
      case "feature_request":
        return <Badge className="bg-green-500 text-white">Feature Request</Badge>
      case "bug_report":
        return <Badge className="bg-red-500 text-white">Bug Report</Badge>
      case "general":
        return <Badge className="bg-gray-500 text-white">General</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">{category}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "closed":
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
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
        <h2 className="text-2xl font-bold text-white">Support Tickets</h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-white text-black hover:bg-gray-200">
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
          <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading support tickets...</p>
        </div>
      ) : error ? (
        <Card className="bg-gray-800/80 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <Button onClick={loadTickets} className="bg-white text-black hover:bg-gray-200">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : filteredTickets.length === 0 ? (
        <Card className="bg-gray-800/80 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400">No support tickets found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card 
              key={ticket.id} 
              className="bg-gray-800/80 border-gray-700 hover:bg-gray-700/80 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(ticket.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-medium text-lg">{ticket.subject}</h3>
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                        {getCategoryBadge(ticket.category)}
                      </div>
                      <p className="text-gray-300 mb-3 line-clamp-2">
                        {ticket.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{ticket.user?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(ticket.created_at)}</span>
                        </div>
                        {ticket.assigned_user && (
                          <div className="flex items-center gap-1">
                            <span>Assigned to:</span>
                            <span className="text-white">{ticket.assigned_user.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewTicket(ticket)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditTicket(ticket)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTicket(ticket.id)}
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
              {selectedTicket && getStatusIcon(selectedTicket.status)}
              Ticket Details
            </DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-white text-lg font-medium">{selectedTicket.subject}</h3>
                {getStatusBadge(selectedTicket.status)}
                {getPriorityBadge(selectedTicket.priority)}
                {getCategoryBadge(selectedTicket.category)}
              </div>
              <p className="text-gray-300">{selectedTicket.message}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Created by:</span>
                  <p className="text-white">{selectedTicket.user?.name || 'Unknown'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Created:</span>
                  <p className="text-white">{formatDate(selectedTicket.created_at)}</p>
                </div>
                {selectedTicket.assigned_user && (
                  <div>
                    <span className="text-gray-400">Assigned to:</span>
                    <p className="text-white">{selectedTicket.assigned_user.name}</p>
                  </div>
                )}
                {selectedTicket.updated_at && (
                  <div>
                    <span className="text-gray-400">Last updated:</span>
                    <p className="text-white">{formatDate(selectedTicket.updated_at)}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedTicket.status}
                  onValueChange={(value) => handleStatusChange(selectedTicket.id, value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de crear ticket (placeholder) */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Create Support Ticket</DialogTitle>
          </DialogHeader>
          <p className="text-gray-300">Support ticket creation form will be implemented here.</p>
        </DialogContent>
      </Dialog>

      {/* Dialog de editar ticket (placeholder) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Support Ticket</DialogTitle>
          </DialogHeader>
          <p className="text-gray-300">Support ticket edit form will be implemented here.</p>
        </DialogContent>
      </Dialog>
    </>
  )
} 
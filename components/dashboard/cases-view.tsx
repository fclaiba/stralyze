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
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Eye, Search, Filter, Calendar, User, DollarSign, Target, Loader2, AlertCircle, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Case {
  id: string
  title: string
  client: string
  status: "open" | "in_progress" | "completed" | "on_hold"
  priority: "low" | "medium" | "high" | "urgent"
  assignedTo: string
  budget: number
  startDate: string
  dueDate: string
  description: string
  progress: number
  tags?: string[]
  notes?: string[]
}

const mockCases: Case[] = [
  {
    id: "1",
    title: "Website Redesign - TechCorp",
    client: "TechCorp Solutions",
    status: "in_progress",
    priority: "high",
    assignedTo: "John Smith",
    budget: 25000,
    startDate: "2024-01-15",
    dueDate: "2024-03-15",
    description: "Complete redesign of corporate website with modern UI/UX",
    progress: 65,
    tags: ["Web Design", "UI/UX", "Corporate"],
    notes: ["Client approved initial mockups", "Development phase started"]
  },
  {
    id: "2",
    title: "Marketing Campaign - StartupXYZ",
    client: "StartupXYZ",
    status: "open",
    priority: "medium",
    assignedTo: "Sarah Johnson",
    budget: 15000,
    startDate: "2024-02-01",
    dueDate: "2024-04-01",
    description: "Digital marketing campaign for product launch",
    progress: 0,
    tags: ["Marketing", "Digital", "Launch"],
    notes: ["Campaign strategy approved"]
  },
  {
    id: "3",
    title: "Brand Identity - LocalBiz",
    client: "Local Business Inc",
    status: "completed",
    priority: "low",
    assignedTo: "Mike Davis",
    budget: 8000,
    startDate: "2023-12-01",
    dueDate: "2024-01-15",
    description: "Complete brand identity package including logo and guidelines",
    progress: 100,
    tags: ["Branding", "Logo", "Identity"],
    notes: ["Project completed successfully", "Client very satisfied"]
  },
  {
    id: "4",
    title: "SEO Optimization - EcommerceStore",
    client: "EcommerceStore",
    status: "on_hold",
    priority: "urgent",
    assignedTo: "Lisa Wilson",
    budget: 12000,
    startDate: "2024-01-20",
    dueDate: "2024-02-20",
    description: "Search engine optimization for online store",
    progress: 30,
    tags: ["SEO", "E-commerce", "Optimization"],
    notes: ["Waiting for client feedback", "Technical audit completed"]
  }
]

export default function CasesView() {
  const { toast } = useToast()
  const [cases, setCases] = useState<Case[]>(mockCases)
  const [filteredCases, setFilteredCases] = useState<Case[]>(mockCases)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [caseToDelete, setCaseToDelete] = useState<Case | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    status: "open" as Case["status"],
    priority: "medium" as Case["priority"],
    assignedTo: "",
    budget: 0,
    startDate: "",
    dueDate: "",
    description: "",
    tags: [] as string[],
    notes: [] as string[]
  })

  useEffect(() => {
    filterCases()
  }, [searchTerm, statusFilter, priorityFilter, cases])

  function filterCases() {
    let filtered = cases

    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(c => c.priority === priorityFilter)
    }

    setFilteredCases(filtered)
  }

  function handleCreateCase() {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      const newCase: Case = {
        id: Date.now().toString(),
        title: formData.title || "New Case",
        client: formData.client || "New Client",
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo || "Unassigned",
        budget: formData.budget,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        dueDate: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: formData.description || "Case description",
        progress: 0,
        tags: formData.tags,
        notes: formData.notes
      }
      
      setCases([...cases, newCase])
      setIsCreateDialogOpen(false)
      resetForm()
      setIsSubmitting(false)
      
      toast({
        title: "Case created",
        description: "New case has been created successfully.",
      })
    }, 1000)
  }

  function handleEditCase(caseItem: Case) {
    setSelectedCase(caseItem)
    setFormData({
      title: caseItem.title,
      client: caseItem.client,
      status: caseItem.status,
      priority: caseItem.priority,
      assignedTo: caseItem.assignedTo,
      budget: caseItem.budget,
      startDate: caseItem.startDate,
      dueDate: caseItem.dueDate,
      description: caseItem.description,
      tags: caseItem.tags || [],
      notes: caseItem.notes || []
    })
    setIsEditDialogOpen(true)
  }

  function handleUpdateCase() {
    if (!selectedCase) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      const updatedCases = cases.map(c => 
        c.id === selectedCase.id 
          ? { ...c, ...formData }
          : c
      )
      
      setCases(updatedCases)
      setIsEditDialogOpen(false)
      setSelectedCase(null)
      resetForm()
      setIsSubmitting(false)
      
      toast({
        title: "Case updated",
        description: "The case has been updated successfully.",
      })
    }, 1000)
  }

  function handleViewCase(caseItem: Case) {
    setSelectedCase(caseItem)
    setIsViewDialogOpen(true)
  }

  function handleDeleteCase(caseItem: Case) {
    setCaseToDelete(caseItem)
    setIsDeleteDialogOpen(true)
  }

  function confirmDeleteCase() {
    if (!caseToDelete) return
    
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setCases(cases.filter(c => c.id !== caseToDelete.id))
      setIsDeleteDialogOpen(false)
      setCaseToDelete(null)
      setLoading(false)
      
      toast({
        title: "Case deleted",
        description: "The case has been deleted successfully.",
      })
    }, 1000)
  }

  function resetForm() {
    setFormData({
      title: "",
      client: "",
      status: "open",
      priority: "medium",
      assignedTo: "",
      budget: 0,
      startDate: "",
      dueDate: "",
      description: "",
      tags: [],
      notes: []
    })
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500 text-white">Open</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-500 text-black">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>
      case "on_hold":
        return <Badge className="bg-red-500 text-white">On Hold</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>
    }
  }

  function getPriorityBadge(priority: string) {
    switch (priority) {
      case "low":
        return <Badge className="bg-gray-500 text-white">Low</Badge>
      case "medium":
        return <Badge className="bg-blue-500 text-white">Medium</Badge>
      case "high":
        return <Badge className="bg-orange-500 text-white">High</Badge>
      case "urgent":
        return <Badge className="bg-red-500 text-white">Urgent</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">{priority}</Badge>
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  function getDaysUntilDue(dueDate: string) {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const stats = {
    total: cases.length,
    open: cases.filter(c => c.status === "open").length,
    inProgress: cases.filter(c => c.status === "in_progress").length,
    completed: cases.filter(c => c.status === "completed").length,
    onHold: cases.filter(c => c.status === "on_hold").length,
    totalBudget: cases.reduce((sum, c) => sum + c.budget, 0),
    averageProgress: cases.reduce((sum, c) => sum + c.progress, 0) / cases.length,
    urgent: cases.filter(c => c.priority === "urgent").length
  }

  const getFilteredCasesByTab = () => {
    switch (activeTab) {
      case "open":
        return filteredCases.filter(c => c.status === "open")
      case "in_progress":
        return filteredCases.filter(c => c.status === "in_progress")
      case "completed":
        return filteredCases.filter(c => c.status === "completed")
      case "on_hold":
        return filteredCases.filter(c => c.status === "on_hold")
      default:
        return filteredCases
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with improved UX */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-200">Cases Management</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage client cases, track progress, and monitor deadlines
          </p>
        </div>
        <Button 
          onClick={() => {
            resetForm()
            setIsCreateDialogOpen(true)
          }} 
          className="bg-white text-black-200 hover:bg-gray-200 transition-colors"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Create Case
        </Button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Cases</p>
                <p className="text-2xl font-bold text-gray-200">{stats.total}</p>
              </div>
              <Target className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Open</p>
                <p className="text-2xl font-bold text-blue-400">{stats.open}</p>
              </div>
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{stats.open}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black text-sm font-bold">{stats.inProgress}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">On Hold</p>
                <p className="text-2xl font-bold text-red-400">{stats.onHold}</p>
              </div>
              <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Budget</p>
                <p className="text-2xl font-bold text-gray-200">{formatCurrency(stats.totalBudget)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-200">{stats.averageProgress.toFixed(0)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Search */}
      <Card className="bg-gray-800/80 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search cases by title, client, or assignee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-200">
            All Cases
            <Badge className="ml-2 bg-gray-600 text-white text-xs">{filteredCases.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="open" className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-200">
            Open
            <Badge className="ml-2 bg-blue-600 text-white text-xs">{stats.open}</Badge>
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-200">
            In Progress
            <Badge className="ml-2 bg-yellow-600 text-black text-xs">{stats.inProgress}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-200">
            Completed
            <Badge className="ml-2 bg-green-600 text-white text-xs">{stats.completed}</Badge>
          </TabsTrigger>
          <TabsTrigger value="on_hold" className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-200">
            On Hold
            <Badge className="ml-2 bg-red-600 text-white text-xs">{stats.onHold}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {getFilteredCasesByTab().length === 0 ? (
            <Card className="bg-gray-800/80 border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-gray-200 font-medium mb-2">No cases found</h3>
                <p className="text-gray-400 mb-4 text-center">
                  {activeTab === "all" 
                    ? "No cases match your current filters" 
                    : `No ${activeTab.replace('_', ' ')} cases found`
                  }
                </p>
                <Button onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setPriorityFilter("all")
                }} className="bg-white text-black-200 hover:bg-gray-200">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {getFilteredCasesByTab().map((caseItem) => (
                <Card key={caseItem.id} className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-all duration-200 group">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-gray-200 group-hover:text-white transition-colors">
                        {caseItem.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(caseItem.status)}
                        {getPriorityBadge(caseItem.priority)}
                        <span className="text-sm text-gray-400">Client: {caseItem.client}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCase(caseItem)}
                        className="text-black-200 border-gray-600 hover:bg-gray-700 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCase(caseItem)}
                        className="text-black-200 border-gray-600 hover:bg-gray-700 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-2 text-black-200" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCase(caseItem)}
                        className="text-gray-400 hover:text-red-500 hover:bg-gray-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-400">Assigned To</p>
                        <p className="text-gray-200 font-medium">{caseItem.assignedTo}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Budget</p>
                        <p className="text-gray-200 font-medium">{formatCurrency(caseItem.budget)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Due Date</p>
                        <p className="text-gray-200 font-medium">{formatDate(caseItem.dueDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Days Left</p>
                        <p className={`font-medium ${getDaysUntilDue(caseItem.dueDate) < 0 ? 'text-red-400' : getDaysUntilDue(caseItem.dueDate) < 7 ? 'text-yellow-400' : 'text-gray-200'}`}>
                          {getDaysUntilDue(caseItem.dueDate) < 0 ? 'Overdue' : `${getDaysUntilDue(caseItem.dueDate)} days`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-400 mb-2">Progress</p>
                      <div className="flex items-center gap-2">
                        <Progress value={caseItem.progress} className="flex-1 h-2 bg-gray-700 [&>div]:bg-blue-500" />
                        <span className="text-sm text-gray-200">{caseItem.progress}%</span>
                      </div>
                    </div>

                    {caseItem.tags && caseItem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {caseItem.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-gray-700 border-gray-600 text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Case Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false)
          setIsEditDialogOpen(false)
          resetForm()
        }
      }}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isCreateDialogOpen ? "Create New Case" : "Edit Case"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200">Case Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter case title"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Client</label>
                <Input
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter client name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200">Status</label>
                <Select value={formData.status} onValueChange={(value: Case["status"]) => setFormData({...formData, status: value})}>
                  <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Priority</label>
                <Select value={formData.priority} onValueChange={(value: Case["priority"]) => setFormData({...formData, priority: value})}>
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
                <label className="text-sm font-medium text-gray-200">Assigned To</label>
                <Input
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter assignee"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-200">Budget</label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter budget"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Due Date</label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-200">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1 bg-gray-700 border-gray-600 text-white"
                rows={4}
                placeholder="Enter case description"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  setIsEditDialogOpen(false)
                  resetForm()
                }}
                className="text-gray-200 border-gray-600 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={isCreateDialogOpen ? handleCreateCase : handleUpdateCase}
                disabled={isSubmitting}
                className="bg-white text-black-200 hover:bg-gray-200"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {isCreateDialogOpen ? "Create Case" : "Update Case"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Case Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">Case Details: {selectedCase?.title}</DialogTitle>
          </DialogHeader>
          {selectedCase && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">Case Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Title</p>
                      <p className="text-gray-200 font-medium">{selectedCase.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Client</p>
                      <p className="text-gray-200 font-medium">{selectedCase.client}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedCase.status)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Priority</p>
                      <div className="mt-1">{getPriorityBadge(selectedCase.priority)}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">Assignment & Budget</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Assigned To</p>
                      <p className="text-gray-200 font-medium">{selectedCase.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Budget</p>
                      <p className="text-gray-200 font-medium">{formatCurrency(selectedCase.budget)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Start Date</p>
                      <p className="text-gray-200 font-medium">{formatDate(selectedCase.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Due Date</p>
                      <p className="text-gray-200 font-medium">{formatDate(selectedCase.dueDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Progress</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={selectedCase.progress} className="flex-1 h-3 bg-gray-700 [&>div]:bg-blue-500" />
                  <span className="text-sm text-gray-200 font-medium">{selectedCase.progress}%</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Description</h3>
                <p className="text-gray-300">{selectedCase.description}</p>
              </div>

              {selectedCase.tags && selectedCase.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCase.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-700 border-gray-600 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedCase.notes && selectedCase.notes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">Notes</h3>
                  <div className="space-y-2">
                    {selectedCase.notes.map((note, index) => (
                      <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                        <p className="text-gray-300">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Case</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete "{caseToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-gray-200 border-gray-600 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCase}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Delete Case
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 
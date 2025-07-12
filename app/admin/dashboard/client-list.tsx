"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Eye, Edit, Trash2, Download, X, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Client } from "@/types/client"

// Mock data for development
const mockClients: Client[] = [
  {
    id: "cli_001",
    company: "Tech Solutions Inc.",
    status: "New Lead",
    industry: "Technology",
    contact: "John Doe",
    email: "john@techsolutions.com",
    phone: "123-456-7890",
    paymentMethod: "Credit Card",
    contractStatus: "Pending",
    deposit: 5000,
    finalPayment: 15000,
    totalAmount: 20000,
    budget: "25000",
    createdAt: "2024-02-16T12:00:00Z",
    updatedAt: "2024-02-16T12:00:00Z",
  },
  {
    id: "cli_002",
    company: "Global Marketing Group",
    status: "In Process",
    industry: "Marketing",
    contact: "Sarah Johnson",
    email: "sarah@globalmarketing.com",
    phone: "234-567-8901",
    paymentMethod: "Bank Transfer",
    contractStatus: "Under Review",
    deposit: 8000,
    finalPayment: 22000,
    totalAmount: 30000,
    budget: "35000",
    createdAt: "2024-02-15T10:30:00Z",
    updatedAt: "2024-02-16T09:15:00Z",
  },
  {
    id: "cli_003",
    company: "Healthcare Innovations",
    status: "Closed Deal",
    industry: "Healthcare",
    contact: "Dr. Michael Chen",
    email: "mchen@healthcareinnovations.com",
    phone: "345-678-9012",
    paymentMethod: "Credit Card",
    contractStatus: "Completed",
    deposit: 12000,
    finalPayment: 28000,
    totalAmount: 40000,
    budget: "45000",
    createdAt: "2024-02-14T14:20:00Z",
    updatedAt: "2024-02-15T16:45:00Z",
  },
  {
    id: "cli_004",
    company: "Financial Services Corp",
    status: "Abandoned",
    industry: "Finance",
    contact: "Lisa Rodriguez",
    email: "lisa@financialservices.com",
    phone: "456-789-0123",
    paymentMethod: "Bank Transfer",
    contractStatus: "Cancelled",
    deposit: 0,
    finalPayment: 0,
    totalAmount: 15000,
    budget: "20000",
    createdAt: "2024-02-13T11:45:00Z",
    updatedAt: "2024-02-14T13:30:00Z",
  },
  {
    id: "cli_005",
    company: "Retail Solutions Ltd",
    status: "New Lead",
    industry: "Retail",
    contact: "David Wilson",
    email: "david@retailsolutions.com",
    phone: "567-890-1234",
    paymentMethod: "Credit Card",
    contractStatus: "Pending",
    deposit: 3000,
    finalPayment: 9000,
    totalAmount: 12000,
    budget: "15000",
    createdAt: "2024-02-12T16:15:00Z",
    updatedAt: "2024-02-12T16:15:00Z",
  },
  {
    id: "cli_006",
    company: "Manufacturing Excellence",
    status: "In Process",
    industry: "Manufacturing",
    contact: "Robert Brown",
    email: "robert@manufacturingexcellence.com",
    phone: "678-901-2345",
    paymentMethod: "Bank Transfer",
    contractStatus: "Under Review",
    deposit: 10000,
    finalPayment: 25000,
    totalAmount: 35000,
    budget: "40000",
    createdAt: "2024-02-11T09:30:00Z",
    updatedAt: "2024-02-12T14:20:00Z",
  },
  {
    id: "cli_007",
    company: "Educational Technologies",
    status: "Closed Deal",
    industry: "Education",
    contact: "Emily Davis",
    email: "emily@edutech.com",
    phone: "789-012-3456",
    paymentMethod: "Credit Card",
    contractStatus: "Completed",
    deposit: 6000,
    finalPayment: 14000,
    totalAmount: 20000,
    budget: "25000",
    createdAt: "2024-02-10T13:45:00Z",
    updatedAt: "2024-02-11T10:15:00Z",
  },
  {
    id: "cli_008",
    company: "Real Estate Partners",
    status: "New Lead",
    industry: "Real Estate",
    contact: "James Miller",
    email: "james@realestatepartners.com",
    phone: "890-123-4567",
    paymentMethod: "Bank Transfer",
    contractStatus: "Pending",
    deposit: 4000,
    finalPayment: 11000,
    totalAmount: 15000,
    budget: "18000",
    createdAt: "2024-02-09T15:20:00Z",
    updatedAt: "2024-02-09T15:20:00Z",
  },
  {
    id: "cli_009",
    company: "Consulting Associates",
    status: "In Process",
    industry: "Consulting",
    contact: "Jennifer Taylor",
    email: "jennifer@consultingassociates.com",
    phone: "901-234-5678",
    paymentMethod: "Credit Card",
    contractStatus: "Under Review",
    deposit: 7000,
    finalPayment: 18000,
    totalAmount: 25000,
    budget: "30000",
    createdAt: "2024-02-08T12:10:00Z",
    updatedAt: "2024-02-09T11:30:00Z",
  },
  {
    id: "cli_010",
    company: "Transportation Solutions",
    status: "Abandoned",
    industry: "Transportation",
    contact: "Thomas Anderson",
    email: "thomas@transportationsolutions.com",
    phone: "012-345-6789",
    paymentMethod: "Bank Transfer",
    contractStatus: "Cancelled",
    deposit: 0,
    finalPayment: 0,
    totalAmount: 12000,
    budget: "15000",
    createdAt: "2024-02-07T10:45:00Z",
    updatedAt: "2024-02-08T14:20:00Z",
  },
]

interface ClientListProps {
  onStatusChange?: () => void
  clients?: Client[]
}

interface FilterState {
  searchTerm: string
  status: string
  industry: string
  paymentMethod: string
  contractStatus: string
  minAmount: string
  maxAmount: string
  dateFrom: string
  dateTo: string
}

export default function ClientList({ onStatusChange, clients: propClients }: ClientListProps) {
  const [clients, setClients] = useState<Client[]>(propClients || [])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)
  
  // Filtros avanzados
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    status: "all",
    industry: "all",
    paymentMethod: "all",
    contractStatus: "all",
    minAmount: "",
    maxAmount: "",
    dateFrom: "",
    dateTo: "",
  })

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [clientsPerPage, setClientsPerPage] = useState(10)

  useEffect(() => {
    if (propClients) {
      setClients(propClients)
      setFilteredClients(propClients)
      setLoading(false)
    } else {
      fetchClients()
    }
  }, [propClients])

  useEffect(() => {
    filterClients()
  }, [clients, filters])

  const fetchClients = async () => {
    try {
      setLoading(true)
      // Use mock data instead of Supabase
      setClients(mockClients)
      setFilteredClients(mockClients)
    } catch (error) {
      console.error("Error fetching clients:", error)
      // Use mock data as fallback
      setClients(mockClients)
      setFilteredClients(mockClients)
    } finally {
      setLoading(false)
    }
  }

  const filterClients = () => {
    let filtered = clients

    // Búsqueda general
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (client) =>
          client.company.toLowerCase().includes(searchLower) ||
          client.contact.toLowerCase().includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower) ||
          client.phone.includes(filters.searchTerm) ||
          client.industry.toLowerCase().includes(searchLower)
      )
    }

    // Filtros específicos
    if (filters.status !== "all") {
      filtered = filtered.filter((client) => client.status === filters.status)
    }

    if (filters.industry !== "all") {
      filtered = filtered.filter((client) => client.industry === filters.industry)
    }

    if (filters.paymentMethod !== "all") {
      filtered = filtered.filter((client) => client.paymentMethod === filters.paymentMethod)
    }

    if (filters.contractStatus !== "all") {
      filtered = filtered.filter((client) => client.contractStatus === filters.contractStatus)
    }

    // Filtro por rango de monto
    if (filters.minAmount) {
      const minAmount = parseFloat(filters.minAmount)
      filtered = filtered.filter((client) => client.totalAmount >= minAmount)
    }

    if (filters.maxAmount) {
      const maxAmount = parseFloat(filters.maxAmount)
      filtered = filtered.filter((client) => client.totalAmount <= maxAmount)
    }

    // Filtro por rango de fechas
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom)
      filtered = filtered.filter((client) => new Date(client.createdAt) >= dateFrom)
    }

    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo)
      filtered = filtered.filter((client) => new Date(client.createdAt) <= dateTo)
    }

    setFilteredClients(filtered)
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      status: "all",
      industry: "all",
      paymentMethod: "all",
      contractStatus: "all",
      minAmount: "",
      maxAmount: "",
      dateFrom: "",
      dateTo: "",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New Lead":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "In Process":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "Closed Deal":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "Abandoned":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Obtener valores únicos para los filtros
  const getUniqueValues = (field: keyof Client) => {
    return Array.from(new Set(clients.map(client => client[field]))).filter(Boolean)
  }

  const activeFiltersCount = Object.values(filters).filter(value => value !== "" && value !== "all").length

  // Calcular los clientes a mostrar
  const totalClients = filteredClients.length
  const totalPages = Math.ceil(totalClients / clientsPerPage)
  const paginatedClients = filteredClients.slice((currentPage - 1) * clientsPerPage, currentPage * clientsPerPage)

  // Cambiar de página
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  // Cambiar cantidad por página
  const handleClientsPerPage = (value: string) => {
    setClientsPerPage(Number(value))
    setCurrentPage(1)
  }

  return (
    <Card className="bg-gray-800/80 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-gray-200">Recent Clients</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
                className="bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600/50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-blue-500 text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
                {isAdvancedFiltersOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600/50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Búsqueda principal */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by company, contact, email, phone, or industry..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="pl-10 bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400"
            />
          </div>

          {/* Filtros avanzados */}
          <Collapsible open={isAdvancedFiltersOpen} onOpenChange={setIsAdvancedFiltersOpen}>
            <CollapsibleContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Status</SelectItem>
                    {getUniqueValues('status').map(status => (
                      <SelectItem key={String(status)} value={String(status)}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.industry} onValueChange={(value) => setFilters(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Industries</SelectItem>
                    {getUniqueValues('industry').map(industry => (
                      <SelectItem key={String(industry)} value={String(industry)}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.paymentMethod} onValueChange={(value) => setFilters(prev => ({ ...prev, paymentMethod: value }))}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200">
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Payment Methods</SelectItem>
                    {getUniqueValues('paymentMethod').map(method => (
                      <SelectItem key={String(method)} value={String(method)}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.contractStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, contractStatus: value }))}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200">
                    <SelectValue placeholder="Contract Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Contract Status</SelectItem>
                    {getUniqueValues('contractStatus').map(status => (
                      <SelectItem key={String(status)} value={String(status)}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Min Amount"
                  value={filters.minAmount}
                  onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                  className="bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400"
                />
                <Input
                  placeholder="Max Amount"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                  className="bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400"
                />
                <Input
                  type="date"
                  placeholder="From Date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="bg-gray-700/50 border-gray-600 text-gray-200"
                />
                <Input
                  type="date"
                  placeholder="To Date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="bg-gray-700/50 border-gray-600 text-gray-200"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Company</TableHead>
                  <TableHead className="text-gray-300">Contact</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Industry</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClients.map((client) => (
                  <TableRow key={client.id} className="border-gray-700 hover:bg-white/10 group">
                    <TableCell className="text-gray-200 font-medium">{client.company}</TableCell>
                    <TableCell>
                      <div className="text-gray-200">{client.contact}</div>
                      <div className="text-gray-400 text-sm">{client.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{client.industry}</TableCell>
                    <TableCell className="text-gray-200 font-medium">{formatCurrency(client.totalAmount)}</TableCell>
                    <TableCell className="text-gray-300">{formatDate(client.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 group-hover:text-black-200 text-gray-400 transition-colors">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 group-hover:text-black-200 text-gray-400 transition-colors">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredClients.length > 0 && (
              <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm text-gray-400">
                <div>
                  Showing {(currentPage - 1) * clientsPerPage + 1} - {Math.min(currentPage * clientsPerPage, totalClients)} of {totalClients} clients
                </div>
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <Select value={String(clientsPerPage)} onValueChange={handleClientsPerPage}>
                    <SelectTrigger className="w-20 bg-gray-700/50 border-gray-600 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent rounded">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => goToPage(i + 1)}
                        className={`px-3 py-1 rounded transition-colors ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {filteredClients.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-400">
                No clients found matching your criteria.
                {activeFiltersCount > 0 && (
                  <Button variant="link" onClick={clearFilters} className="text-blue-400 hover:text-blue-300">
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  UserPlus,
  UserCheck,
  UserMinus,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Mail,
  Menu,
  Briefcase,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ClientList from "./client-list"
import LeadGrowthChart from "@/components/dashboard/lead-growth-chart"
import AcquisitionMetrics from "@/components/dashboard/acquisition-metrics"
import { toast } from "@/components/ui/use-toast"
import RecentRegistrations from "@/components/dashboard/recent-registrations"
import EmailMarketingView from "@/components/dashboard/email-marketing-view"
import CasesView from "@/components/dashboard/cases-view"
import CalendarView from "@/components/dashboard/calendar-view"
import SettingsView from "@/components/dashboard/settings-view"
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect"
import { useAuth } from "@/components/providers/auth-provider"

import Link from "next/link"

// Navigation items
const navigation = [
  { name: "Dashboard", icon: ChevronRight, href: "/admin/dashboard", isLocal: true },
  { name: "Email Marketing", icon: Mail, href: "/admin/email-marketing/campaigns", isLocal: true },
  { name: "Cases", icon: Briefcase, href: "#", isLocal: true },
  { name: "Calendar", icon: Calendar, href: "#", isLocal: true },
  { name: "Notifications", icon: Bell, href: "#", isLocal: true },
  { name: "Settings", icon: Settings, href: "#", isLocal: true },
  { name: "Support", icon: HelpCircle, href: "#", isLocal: true },
]

export default function AdminDashboard() {
  const router = useRouter()
  const { logout, user, loading } = useAuth()
  const [selectedMenu, setSelectedMenu] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [metrics, setMetrics] = useState([
    { title: "Total Leads", value: 1250, icon: Users },
    { title: "New Clients", value: 320, icon: UserPlus },
    { title: "In Process", value: 450, icon: UserCheck },
    { title: "Closed Deals", value: 280, icon: UserCheck },
    { title: "Abandoned", value: 200, icon: UserMinus },
  ])
  const [loadingState, setLoadingState] = useState(false)

  // Verificar autenticación
  useEffect(() => {
    if (!loading && !user) {
      console.log("Usuario no autenticado, redirigiendo a login")
      router.push('/admin/login')
    } else if (user) {
      console.log("Usuario autenticado:", user)
    }
  }, [user, loading, router])

  // Simulate fetchMetrics for ClientList to call
  const fetchMetrics = useCallback(async () => {
    console.log("Simulating metric refresh (no actual data fetch)")
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      })
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out",
        variant: "destructive",
      })
    }
  }

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario autenticado, no mostrar nada (se redirigirá)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black/80 text-gray-200 relative overflow-hidden">
      <CanvasRevealEffect
        animationSpeed={2}
        containerClassName="absolute inset-0"
        colors={[
          [50, 50, 50], // Dark gray
          [100, 100, 100], // Medium gray
          [200, 200, 200], // Light gray
        ]}
        dotSize={3}
        opacities={[0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1]}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50 bg-black/20 backdrop-blur-sm border border-gray-700"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/90 backdrop-blur-sm border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">Stralyze Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedMenu === item.name.toLowerCase()
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setSelectedMenu(item.name.toLowerCase())}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.firstName}!</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-sm border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">{metric.title}</p>
                      <p className="text-2xl font-bold text-white">{metric.value}</p>
                    </div>
                    <metric.icon className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lead Growth Chart */}
            <div className="lg:col-span-2">
              <Card className="bg-black/40 backdrop-blur-sm border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Lead Growth</h3>
                  <LeadGrowthChart />
                </CardContent>
              </Card>
            </div>

            {/* Recent Registrations */}
            <div>
              <Card className="bg-black/40 backdrop-blur-sm border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Registrations</h3>
                  <RecentRegistrations />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="bg-black/40 backdrop-blur-sm border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Acquisition Metrics</h3>
                <AcquisitionMetrics />
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Client List</h3>
                <ClientList onStatusChange={fetchMetrics} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

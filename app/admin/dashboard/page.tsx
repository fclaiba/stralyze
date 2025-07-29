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
import { AuthGuard } from "@/components/auth-guard"
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
  const { logout, user } = useAuth()
  const [selectedMenu, setSelectedMenu] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [metrics, setMetrics] = useState([
    { title: "Total Leads", value: 1250, icon: Users },
    { title: "New Clients", value: 320, icon: UserPlus },
    { title: "In Process", value: 450, icon: UserCheck },
    { title: "Closed Deals", value: 280, icon: UserCheck },
    { title: "Abandoned", value: 200, icon: UserMinus },
  ])
  const [loading, setLoading] = useState(false)

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

  return (
    <AuthGuard requiredRole="admin">
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
          size="icon"
          className="fixed top-4 left-4 z-[60] md:hidden text-gray-200 hover:bg-gray-700/80"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Sidebar */}
        <div
          className={`fixed left-0 top-0 bottom-0 w-64 bg-black/50 backdrop-blur-sm border-r border-white/10 z-50
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
        >
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-8">Stralyze B2B</h1>
            <nav className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name.toLowerCase()}
                  className={`flex items-center space-x-2 w-full p-3 rounded-lg transition-colors ${
                    selectedMenu === item.name.toLowerCase().replace(/\s/g, "")
                      ? "bg-white text-black"
                      : "text-gray-200 hover:bg-white hover:text-black"
                  }`}
                  onClick={() => {
                    setSelectedMenu(item.name.toLowerCase().replace(/\s/g, ""))
                    setIsSidebarOpen(false) // Close sidebar on navigation click
                  }}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <Button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full bg-white text-black hover:bg-gray-200"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        {/* Main Content */}
        <div
          className={`p-4 md:p-8 relative z-10 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "ml-64" : "ml-0"
          } md:ml-64`}
        >
          <AnimatePresence mode="wait">
            {selectedMenu === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="bg-gray-800/80 border-white/20 backdrop-blur-sm hover:bg-gray-700/80 transition-colors">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs md:text-sm text-gray-200/80 font-medium">{metric.title}</p>
                              <h3 className="text-xl md:text-2xl font-bold mt-1 text-gray-200">
                                {loading ? "..." : metric.value}
                              </h3>
                            </div>
                            <metric.icon className="h-6 w-6 md:h-8 md:w-8 text-gray-200 opacity-75" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Lead Growth Chart - Full Width */}
                <div className="mb-6 md:mb-8">
                  <LeadGrowthChart />
                </div>

                {/* Bottom Section - Client List and Recent Registrations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  <ClientList onStatusChange={fetchMetrics} />
                  <RecentRegistrations />
                </div>
              </motion.div>
            )}

            {selectedMenu === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AcquisitionMetrics className="mb-8" />
                <RecentRegistrations />
              </motion.div>
            )}

            {selectedMenu === "emailmarketing" && (
              <motion.div
                key="emailmarketing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <EmailMarketingView />
              </motion.div>
            )}

            {selectedMenu === "cases" && (
              <motion.div
                key="cases"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CasesView />
              </motion.div>
            )}

            {selectedMenu === "calendar" && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CalendarView />
              </motion.div>
            )}

            {selectedMenu === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SettingsView />
              </motion.div>
            )}

            {selectedMenu === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gray-800/80 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-200 mb-4">Settings</h2>
                    <p className="text-gray-200/80">Adjust your account settings here.</p>
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div>
                          <h3 className="text-gray-200 font-medium">Notifications</h3>
                          <p className="text-gray-400 text-sm">Manage your notification preferences</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div>
                          <h3 className="text-gray-200 font-medium">Security</h3>
                          <p className="text-gray-400 text-sm">Update your password and security settings</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div>
                          <h3 className="text-gray-200 font-medium">API Keys</h3>
                          <p className="text-gray-400 text-sm">Manage your API keys and integrations</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {selectedMenu === "support" && (
              <motion.div
                key="support"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gray-800/80 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-200 mb-4">Support</h2>
                    <p className="text-gray-200/80">Get help and support for your account.</p>
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div>
                          <h3 className="text-gray-200 font-medium">Documentation</h3>
                          <p className="text-gray-400 text-sm">Read our comprehensive documentation</p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Docs
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div>
                          <h3 className="text-gray-200 font-medium">Contact Support</h3>
                          <p className="text-gray-400 text-sm">Get in touch with our support team</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Contact
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div>
                          <h3 className="text-gray-200 font-medium">FAQ</h3>
                          <p className="text-gray-400 text-sm">Find answers to common questions</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Browse FAQ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthGuard>
  )
}

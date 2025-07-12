"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, User, Shield, Bell, Palette, Database, Globe, Key, Save, Loader2, AlertCircle, CheckCircle, Eye, EyeOff, Trash2, Upload, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface UserSettings {
  profile: {
    firstName: string
    lastName: string
  email: string
    phone: string
    avatar: string
    bio: string
    timezone: string
    language: string
  }
  security: {
    twoFactorEnabled: boolean
  emailNotifications: boolean
  sessionTimeout: number
    passwordExpiryDays: number
  loginAttempts: number
  }
  notifications: {
    email: {
      marketing: boolean
      updates: boolean
      security: boolean
      weekly: boolean
    }
    push: {
      newClients: boolean
      deadlines: boolean
      meetings: boolean
      system: boolean
    }
    sms: {
      urgent: boolean
      reminders: boolean
    }
  }
  appearance: {
  theme: "light" | "dark" | "system"
    accentColor: string
    fontSize: "small" | "medium" | "large"
    compactMode: boolean
    animations: boolean
  }
  integrations: {
    googleCalendar: boolean
    slack: boolean
    zapier: boolean
    webhooks: boolean
  }
}

const defaultSettings: UserSettings = {
  profile: {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    avatar: "",
    bio: "Senior Marketing Manager with 8+ years of experience in digital marketing and client management.",
    timezone: "America/New_York",
    language: "en"
  },
  security: {
    twoFactorEnabled: true,
    emailNotifications: true,
    sessionTimeout: 30,
    passwordExpiryDays: 90,
    loginAttempts: 5
  },
  notifications: {
    email: {
      marketing: true,
      updates: true,
      security: true,
      weekly: false
    },
    push: {
      newClients: true,
      deadlines: true,
      meetings: true,
      system: false
    },
    sms: {
      urgent: true,
      reminders: false
    }
  },
  appearance: {
    theme: "dark",
    accentColor: "blue",
    fontSize: "medium",
    compactMode: false,
    animations: true
  },
  integrations: {
    googleCalendar: true,
    slack: false,
    zapier: false,
    webhooks: false
  }
}

export default function SettingsView() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  function handleSaveSettings() {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      })
    }, 1500)
  }

  function handleResetSettings() {
    setSettings(defaultSettings)
    toast({
      title: "Settings reset",
      description: "Settings have been reset to default values.",
    })
  }

  function handleDeleteAccount() {
    setIsDeleting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      })
    }, 2000)
  }

  function updateProfile(field: keyof UserSettings['profile'], value: string) {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }))
  }

  function updateSecurity(field: keyof UserSettings['security'], value: boolean | number) {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [field]: value
      }
    }))
  }

  function updateNotification(type: 'email' | 'push' | 'sms', category: string, value: boolean) {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: {
          ...prev.notifications[type],
          [category]: value
        }
      }
    }))
  }

  function updateAppearance(field: keyof UserSettings['appearance'], value: any) {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [field]: value
      }
    }))
  }

  function updateIntegration(integration: keyof UserSettings['integrations'], value: boolean) {
    setSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [integration]: value
      }
    }))
  }

  function getInitials(firstName: string, lastName: string) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  function formatPhone(phone: string) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }

  const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Australia/Sydney", label: "Sydney (AEDT)" }
  ]

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "it", label: "Italiano" },
    { value: "pt", label: "Português" }
  ]

  const accentColors = [
    { value: "blue", label: "Blue", color: "bg-blue-500" },
    { value: "green", label: "Green", color: "bg-green-500" },
    { value: "purple", label: "Purple", color: "bg-purple-500" },
    { value: "orange", label: "Orange", color: "bg-orange-500" },
    { value: "red", label: "Red", color: "bg-red-500" },
    { value: "pink", label: "Pink", color: "bg-pink-500" }
  ]

  return (
      <div className="space-y-6">
        {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-200">Settings</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleResetSettings}
            className="text-gray-200 border-gray-600 hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={isSubmitting}
            className="bg-white text-black-200 hover:bg-gray-200"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
        </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-200">
              <User className="h-4 w-4 mr-2" />
            Profile
            </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-200">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-200">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-200">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-200">
            <Globe className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="danger" className="data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-200">
            <AlertCircle className="h-4 w-4 mr-2" />
            Danger Zone
          </TabsTrigger>
          </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-gray-800/80 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-200 flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={settings.profile.avatar} />
                  <AvatarFallback className="bg-gray-700 text-gray-200 text-lg">
                    {getInitials(settings.profile.firstName, settings.profile.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="text-gray-200 border-gray-600 hover:bg-gray-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
              </Button>
                  <p className="text-sm text-gray-400">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
            </div>

              <Separator className="bg-gray-600" />

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-200">First Name</label>
                      <Input
                    value={settings.profile.firstName}
                    onChange={(e) => updateProfile('firstName', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                <div>
                  <label className="text-sm font-medium text-gray-200">Last Name</label>
                  <Input
                    value={settings.profile.lastName}
                    onChange={(e) => updateProfile('lastName', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                  />
                  </div>
                <div>
                  <label className="text-sm font-medium text-gray-200">Email Address</label>
                  <Input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => updateProfile('email', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-200">Phone Number</label>
                  <Input
                    value={settings.profile.phone}
                    onChange={(e) => updateProfile('phone', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-200">Bio</label>
                <Textarea
                  value={settings.profile.bio}
                  onChange={(e) => updateProfile('bio', e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-200">Timezone</label>
                  <Select value={settings.profile.timezone} onValueChange={(value) => updateProfile('timezone', value)}>
                    <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {timezones.map(tz => (
                        <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-200">Language</label>
                  <Select value={settings.profile.language} onValueChange={(value) => updateProfile('language', value)}>
                    <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-gray-800/80 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-200 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-200">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                        </div>
                <Switch
                  checked={settings.security.twoFactorEnabled}
                  onCheckedChange={(checked) => updateSecurity('twoFactorEnabled', checked)}
                />
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                        <div>
                  <h4 className="font-medium text-gray-200">Email Security Notifications</h4>
                  <p className="text-sm text-gray-400">Receive alerts about suspicious login attempts</p>
                          </div>
                <Switch
                  checked={settings.security.emailNotifications}
                  onCheckedChange={(checked) => updateSecurity('emailNotifications', checked)}
                />
                        </div>

              <Separator className="bg-gray-600" />

              {/* Session Settings */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-200">Session Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-200">Session Timeout (minutes)</label>
                    <Input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSecurity('sessionTimeout', Number(e.target.value))}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                    />
                      </div>
                  <div>
                    <label className="text-sm font-medium text-gray-200">Password Expiry (days)</label>
                    <Input
                      type="number"
                      value={settings.security.passwordExpiryDays}
                      onChange={(e) => updateSecurity('passwordExpiryDays', Number(e.target.value))}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                    />
                      </div>
                  <div>
                    <label className="text-sm font-medium text-gray-200">Max Login Attempts</label>
                    <Input
                      type="number"
                      value={settings.security.loginAttempts}
                      onChange={(e) => updateSecurity('loginAttempts', Number(e.target.value))}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                    />
                    </div>
                </div>
            </div>

              <Separator className="bg-gray-600" />

              {/* Password Change */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-200">Change Password</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-200">Current Password</label>
                    <div className="relative mt-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="pr-10 bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter current password"
                      />
                  <Button 
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-200">New Password</label>
                    <Input
                      type="password"
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-200">Confirm New Password</label>
                    <Input
                      type="password"
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
                </CardContent>
              </Card>
          </TabsContent>

        {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-200 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
              {/* Email Notifications */}
                <div className="space-y-4">
                <h4 className="font-medium text-gray-200">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-200">Marketing Emails</h5>
                      <p className="text-sm text-gray-400">Receive updates about new features and promotions</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email.marketing}
                      onCheckedChange={(checked) => updateNotification('email', 'marketing', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-200">System Updates</h5>
                      <p className="text-sm text-gray-400">Get notified about important system changes</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email.updates}
                      onCheckedChange={(checked) => updateNotification('email', 'updates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-200">Security Alerts</h5>
                      <p className="text-sm text-gray-400">Receive security-related notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email.security}
                      onCheckedChange={(checked) => updateNotification('email', 'security', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-200">Weekly Reports</h5>
                      <p className="text-sm text-gray-400">Get weekly summary reports</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email.weekly}
                      onCheckedChange={(checked) => updateNotification('email', 'weekly', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-600" />

              {/* Push Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-200">Push Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-200">New Clients</h5>
                      <p className="text-sm text-gray-400">Notify when new clients are added</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push.newClients}
                      onCheckedChange={(checked) => updateNotification('push', 'newClients', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-200">Deadlines</h5>
                      <p className="text-sm text-gray-400">Remind about upcoming deadlines</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push.deadlines}
                      onCheckedChange={(checked) => updateNotification('push', 'deadlines', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-200">Meetings</h5>
                      <p className="text-sm text-gray-400">Notify about upcoming meetings</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push.meetings}
                      onCheckedChange={(checked) => updateNotification('push', 'meetings', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-200">System Messages</h5>
                      <p className="text-sm text-gray-400">Receive system maintenance notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push.system}
                      onCheckedChange={(checked) => updateNotification('push', 'system', checked)}
                      />
                    </div>
                </div>
              </div>

              <Separator className="bg-gray-600" />

              {/* SMS Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-200">SMS Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-200">Urgent Alerts</h5>
                      <p className="text-sm text-gray-400">Receive urgent notifications via SMS</p>
                    </div>
                    <Switch
                      checked={settings.notifications.sms.urgent}
                      onCheckedChange={(checked) => updateNotification('sms', 'urgent', checked)}
                      />
                    </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div>
                      <h5 className="font-medium text-gray-200">Reminders</h5>
                      <p className="text-sm text-gray-400">Get SMS reminders for important events</p>
                    </div>
                    <Switch
                      checked={settings.notifications.sms.reminders}
                      onCheckedChange={(checked) => updateNotification('sms', 'reminders', checked)}
                    />
                  </div>
                </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-200 flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
              {/* Theme Selection */}
                <div className="space-y-4">
                <h4 className="font-medium text-gray-200">Theme</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "Light", icon: "☀️" },
                    { value: "dark", label: "Dark", icon: "🌙" },
                    { value: "system", label: "System", icon: "⚙️" }
                  ].map(theme => (
                    <div
                      key={theme.value}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        settings.appearance.theme === theme.value
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                      }`}
                      onClick={() => updateAppearance('theme', theme.value)}
                    >
                      <div className="text-2xl mb-2">{theme.icon}</div>
                      <div className="text-sm font-medium text-gray-200">{theme.label}</div>
                  </div>
                  ))}
                    </div>
              </div>

              <Separator className="bg-gray-600" />

              {/* Accent Color */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-200">Accent Color</h4>
                <div className="grid grid-cols-3 gap-3">
                  {accentColors.map(color => (
                    <div
                      key={color.value}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        settings.appearance.accentColor === color.value
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                      }`}
                      onClick={() => updateAppearance('accentColor', color.value)}
                    >
                      <div className={`w-6 h-6 rounded-full ${color.color} mx-auto mb-2`}></div>
                      <div className="text-sm font-medium text-gray-200">{color.label}</div>
                    </div>
                  ))}
                  </div>
                    </div>

              <Separator className="bg-gray-600" />

              {/* Other Settings */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-200">Display Options</h4>
                <div className="space-y-4">
                    <div>
                    <label className="text-sm font-medium text-gray-200">Font Size</label>
                    <Select value={settings.appearance.fontSize} onValueChange={(value) => updateAppearance('fontSize', value)}>
                      <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div>
                      <h5 className="font-medium text-gray-200">Compact Mode</h5>
                      <p className="text-sm text-gray-400">Reduce spacing for more content</p>
              </div>
                    <Switch
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) => updateAppearance('compactMode', checked)}
                />
              </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div>
                      <h5 className="font-medium text-gray-200">Animations</h5>
                      <p className="text-sm text-gray-400">Enable smooth transitions and animations</p>
              </div>
                    <Switch
                      checked={settings.appearance.animations}
                      onCheckedChange={(checked) => updateAppearance('animations', checked)}
                />
              </div>
            </div>
            </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-gray-800/80 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-200 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Third-Party Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">G</span>
                </div>
                <div>
                      <h4 className="font-medium text-gray-200">Google Calendar</h4>
                      <p className="text-sm text-gray-400">Sync your calendar events</p>
                </div>
              </div>
                  <Switch
                    checked={settings.integrations.googleCalendar}
                    onCheckedChange={(checked) => updateIntegration('googleCalendar', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">S</span>
              </div>
              <div>
                      <h4 className="font-medium text-gray-200">Slack</h4>
                      <p className="text-sm text-gray-400">Send notifications to Slack channels</p>
              </div>
              </div>
                  <Switch
                    checked={settings.integrations.slack}
                    onCheckedChange={(checked) => updateIntegration('slack', checked)}
                  />
            </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">Z</span>
                </div>
                <div>
                      <h4 className="font-medium text-gray-200">Zapier</h4>
                      <p className="text-sm text-gray-400">Connect with 5000+ apps</p>
                  </div>
                </div>
                  <Switch
                    checked={settings.integrations.zapier}
                    onCheckedChange={(checked) => updateIntegration('zapier', checked)}
                  />
              </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Key className="h-5 w-5 text-white" />
                </div>
                <div>
                      <h4 className="font-medium text-gray-200">Webhooks</h4>
                      <p className="text-sm text-gray-400">Send data to external services</p>
                </div>
                </div>
                  <Switch
                    checked={settings.integrations.webhooks}
                    onCheckedChange={(checked) => updateIntegration('webhooks', checked)}
                  />
                  </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone */}
        <TabsContent value="danger" className="space-y-6">
          <Card className="bg-gray-800/80 border-red-500/50">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <h4 className="font-medium text-red-400 mb-2">Delete Account</h4>
                <p className="text-sm text-gray-300 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h4 className="font-medium text-yellow-400 mb-2">Export Data</h4>
                <p className="text-sm text-gray-300 mb-4">
                  Download all your data in JSON format.
                </p>
                <Button 
                  variant="outline"
                  className="text-yellow-400 border-yellow-500 hover:bg-yellow-500/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Account Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Delete Account</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-gray-200 border-gray-600 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 
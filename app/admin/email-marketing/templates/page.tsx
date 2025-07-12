"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import TemplateForm from "@/components/email-marketing/template-form"
import { fetchEmailTemplates, deleteEmailTemplateAction } from "@/app/actions/email-template-actions"
import type { EmailTemplate } from "@/types/email-marketing"

export default function TemplatesPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    try {
      setLoading(true)
      setError(null)

      // Use the server action instead of direct data access
      const result = await fetchEmailTemplates()

      if (result.success && result.data) {
        setTemplates(result.data)
      } else {
        setError(result.error || "Failed to load templates")
        toast({
          title: "Error",
          description: result.error || "Failed to load email templates. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading templates:", error)
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "Failed to load email templates. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteTemplate(id: string) {
    if (!confirm("Are you sure you want to delete this template?")) {
      return
    }

    try {
      setIsDeleting(true)
      // Use the server action instead of direct data access
      const result = await deleteEmailTemplateAction(id)

      if (result.success) {
        toast({
          title: "Template deleted",
          description: "The email template has been deleted successfully.",
        })
        loadTemplates()
      } else {
        // Check if the error message contains information about campaigns using the template
        if (result.error && result.error.includes("being used by the following campaigns")) {
          setErrorMessage(result.error)
          setIsErrorDialogOpen(true)
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete the template. Please try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error deleting template:", error)
      toast({
        title: "Error",
        description: "Failed to delete the template. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  function handleEditTemplate(template: EmailTemplate) {
    setSelectedTemplate(template)
    setIsEditDialogOpen(true)
  }

  function getSegmentLabel(segment: string) {
    switch (segment) {
      case "new_lead":
        return "New Leads"
      case "in_process":
        return "In Process"
      case "closed_deal":
        return "Closed Deals"
      case "abandoned":
        return "Abandoned"
      default:
        return segment
    }
  }

  function navigateToCampaigns() {
    router.push("/admin/email-marketing/campaigns")
    setIsErrorDialogOpen(false)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Email Templates</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-white text-black hover:bg-gray-200">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading templates...</p>
        </div>
      ) : error ? (
        <Card className="bg-gray-800/80 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <Button onClick={loadTemplates} className="bg-white text-black hover:bg-gray-200">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : templates.length === 0 ? (
        <Card className="bg-gray-800/80 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-400 mb-4">No email templates found</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-white text-black hover:bg-gray-200">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-white">{template.name}</CardTitle>
                  <p className="text-sm text-gray-400 mt-1">Segment: {getSegmentLabel(template.segment)}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditTemplate(template)}
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                    disabled={isDeleting}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-gray-700"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 font-medium mb-2">Subject: {template.subject}</p>
                <div className="text-sm text-gray-400 line-clamp-3">
                  <div dangerouslySetInnerHTML={{ __html: template.content }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">Create Email Template</DialogTitle>
          </DialogHeader>
          <TemplateForm
            onSuccess={() => {
              setIsCreateDialogOpen(false)
              loadTemplates()
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Email Template</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <TemplateForm
              template={selectedTemplate}
              onSuccess={() => {
                setIsEditDialogOpen(false)
                loadTemplates()
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Error Dialog for Template Dependencies */}
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              Cannot Delete Template
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">{errorMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setIsErrorDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Close
            </Button>
            <Button onClick={navigateToCampaigns} className="bg-white text-black hover:bg-gray-200">
              Go to Campaigns
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

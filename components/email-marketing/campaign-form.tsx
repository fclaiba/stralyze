"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createCampaign, updateCampaign } from "@/app/actions/email-actions"
import { fetchEmailTemplatesBySegment } from "@/app/actions/email-template-actions"
import type { EmailCampaign, EmailTemplate } from "@/types/email-marketing"

const campaignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  template_id: z.string().min(1, "Template is required"),
  segment: z.enum(["new_lead", "in_process", "closed_deal", "abandoned"]),
  status: z.enum(["draft", "scheduled"]),
  scheduled_at: z.string().nullable().optional(),
})

type CampaignFormValues = z.infer<typeof campaignSchema>

interface CampaignFormProps {
  campaign?: EmailCampaign
  onSuccess?: () => void
}

export default function CampaignForm({ campaign, onSuccess }: CampaignFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedSegment, setSelectedSegment] = useState(campaign?.segment || "new_lead")
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: campaign?.name || "",
      template_id: campaign?.template_id || "",
      segment: campaign?.segment || "new_lead",
      status: campaign?.status === "sent" ? "draft" : campaign?.status || "draft",
      scheduled_at: campaign?.scheduled_at || null,
    },
  })

  const watchSegment = form.watch("segment")
  const watchStatus = form.watch("status")

  useEffect(() => {
    if (watchSegment !== selectedSegment) {
      setSelectedSegment(watchSegment)
      form.setValue("template_id", "")
    }
  }, [watchSegment, selectedSegment, form])

  useEffect(() => {
    // If status is not scheduled, clear the scheduled_at field
    if (watchStatus !== "scheduled") {
      form.setValue("scheduled_at", null)
    }
  }, [watchStatus, form])

  useEffect(() => {
    async function loadTemplates() {
      try {
        setLoadingTemplates(true)
        setError(null)

        // Use the server action instead of direct data access
        const result = await fetchEmailTemplatesBySegment(selectedSegment)

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
        setLoadingTemplates(false)
      }
    }

    loadTemplates()
  }, [selectedSegment, toast])

  async function onSubmit(values: CampaignFormValues) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("template_id", values.template_id)
      formData.append("segment", values.segment)
      formData.append("status", values.status)

      // Only append scheduled_at if status is "scheduled" and it has a value
      if (values.status === "scheduled" && values.scheduled_at) {
        formData.append("scheduled_at", values.scheduled_at)
      } else {
        // Explicitly set to null to avoid empty string issues
        formData.append("scheduled_at", "")
      }

      const result = campaign ? await updateCampaign(campaign.id, formData) : await createCampaign(formData)

      if (result.success) {
        toast({
          title: campaign ? "Campaign updated" : "Campaign created",
          description: campaign
            ? "Your campaign has been updated successfully."
            : "Your campaign has been created successfully.",
        })
        if (onSuccess) onSuccess()
      } else {
        toast({
          title: "Error",
          description: result.error || "There was an error saving the campaign. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving campaign:", error)
      toast({
        title: "Error",
        description: "There was an error saving the campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Campaign Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="E.g., July Newsletter, Welcome Series, etc."
                  className="bg-[#1a1e2a] border-gray-700 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="segment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Target Segment</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-[#1a1e2a] border-gray-700 text-white">
                    <SelectValue placeholder="Select a segment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="new_lead" className="text-white hover:bg-gray-700">
                    New Leads
                  </SelectItem>
                  <SelectItem value="in_process" className="text-white hover:bg-gray-700">
                    In Process
                  </SelectItem>
                  <SelectItem value="closed_deal" className="text-white hover:bg-gray-700">
                    Closed Deals
                  </SelectItem>
                  <SelectItem value="abandoned" className="text-white hover:bg-gray-700">
                    Abandoned
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="template_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email Template</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-[#1a1e2a] border-gray-700 text-white">
                    <SelectValue placeholder={loadingTemplates ? "Loading templates..." : "Select a template"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {loadingTemplates ? (
                    <SelectItem value="loading" disabled className="text-gray-400">
                      Loading templates...
                    </SelectItem>
                  ) : error ? (
                    <SelectItem value="error" disabled className="text-red-400">
                      Error: {error}
                    </SelectItem>
                  ) : templates.length > 0 ? (
                    templates.map((template) => (
                      <SelectItem key={template.id} value={template.id} className="text-white hover:bg-gray-700">
                        {template.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-templates" disabled className="text-gray-400">
                      No templates available for this segment
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Campaign Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-[#1a1e2a] border-gray-700 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="draft" className="text-white hover:bg-gray-700">
                    Draft
                  </SelectItem>
                  <SelectItem value="scheduled" className="text-white hover:bg-gray-700">
                    Scheduled
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchStatus === "scheduled" && (
          <FormField
            control={form.control}
            name="scheduled_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Schedule Date & Time</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="datetime-local"
                    value={field.value || ""}
                    className="bg-[#1a1e2a] border-gray-700 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-white text-black-200 hover:bg-gray-200">
            {isSubmitting ? "Saving..." : campaign ? "Update Campaign" : "Create Campaign"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

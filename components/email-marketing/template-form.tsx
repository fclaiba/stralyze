"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import RichTextEditor from "./rich-text-editor"
import { createTemplate, updateTemplate } from "@/app/actions/email-actions"
import type { EmailTemplate } from "@/types/email-marketing"

const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  segment: z.enum(["new_lead", "in_process", "closed_deal", "abandoned"]),
})

type TemplateFormValues = z.infer<typeof templateSchema>

interface TemplateFormProps {
  template?: EmailTemplate
  onSuccess?: () => void
}

export default function TemplateForm({ template, onSuccess }: TemplateFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: template?.name || "",
      subject: template?.subject || "",
      content: template?.content || "",
      segment: template?.segment || "new_lead",
    },
  })

  async function onSubmit(values: TemplateFormValues) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("subject", values.subject)
      formData.append("content", values.content)
      formData.append("segment", values.segment)

      const result = template ? await updateTemplate(template.id, formData) : await createTemplate(formData)

      if (result.success) {
        toast({
          title: template ? "Template updated" : "Template created",
          description: template
            ? "Your template has been updated successfully."
            : "Your template has been created successfully.",
        })
        if (onSuccess) onSuccess()
      } else {
        toast({
          title: "Error",
          description: "There was an error saving the template. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving template:", error)
      toast({
        title: "Error",
        description: "There was an error saving the template. Please try again.",
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
              <FormLabel className="text-white">Template Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="E.g., Welcome Email, Follow-up, etc."
                  className="bg-[#1a1e2a] border-gray-700 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email Subject</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Subject line for the email"
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
          name="content"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-white">Email Content</FormLabel>
              <FormControl>
                <div className="w-full max-w-full">
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write your email content here..."
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-white text-black-200 hover:bg-gray-200">
            {isSubmitting ? "Saving..." : template ? "Update Template" : "Create Template"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { consultationFormSchema, type ConsultationFormData } from "@/lib/validations/form-schema"
import { submitConsultationForm } from "@/app/actions/form-actions"

const politicalServices = [
  { id: "campaign-strategy", label: "Campaign Strategy" },
  { id: "voter-outreach", label: "Voter Outreach" },
  { id: "crisis-management", label: "Crisis Management" },
  { id: "message-development", label: "Message Development" },
]

const budgetRanges = [
  { value: "0-10000", label: "$0 - $10,000" },
  { value: "10001-25000", label: "$10,001 - $25,000" },
  { value: "25001-50000", label: "$25,001 - $50,000" },
  { value: "50001-100000", label: "$50,001 - $100,000" },
  { value: "100001+", label: "$100,001+" },
]

export default function PoliticalCTASection() {
  const { toast } = useToast()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      name: "",
      company: "",
      industry: "Politics",
      services: [],
      email: "",
      phone: "",
      budget: "",
    },
  })

  const { formState } = form

  async function onSubmit(data: ConsultationFormData) {
    try {
      setSubmissionError(null)
      const result = await submitConsultationForm(data)

      if (result.success) {
        setShowConfirmation(true)
        toast({
          title: "Success!",
          description: "Your political consultation request has been submitted.",
        })
      } else {
        const errorMessage =
          typeof result.error === "string"
            ? result.error
            : "There was a problem submitting your request. Please try again."

        setSubmissionError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setSubmissionError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  return (
    <section id="cta" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Political Campaign?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Let's schedule a consultation and discuss how we can elevate your political communication strategy.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-black/5 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {!showConfirmation ? (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {submissionError && (
                        <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded-md mb-6 flex items-start">
                          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Form submission error</p>
                            <p className="text-sm">{submissionError}</p>
                          </div>
                        </div>
                      )}

                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white">Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Your Name"
                                        className="bg-[#1a1e2a] border-gray-700 text-white placeholder-gray-400"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="company"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white">Campaign/Organization</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Campaign or Organization Name"
                                        className="bg-[#1a1e2a] border-gray-700 text-white placeholder-gray-400"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="industry"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white">Political Level</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Local, State, Federal, etc."
                                        className="bg-[#1a1e2a] border-gray-700 text-white placeholder-gray-400"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="services"
                                render={() => (
                                  <FormItem>
                                    <FormLabel className="text-white">Services Interested In</FormLabel>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                      {politicalServices.map((service) => (
                                        <FormField
                                          key={service.id}
                                          control={form.control}
                                          name="services"
                                          render={({ field }) => {
                                            return (
                                              <FormItem
                                                key={service.id}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                              >
                                                <FormControl>
                                                  <Checkbox
                                                    checked={field.value?.includes(service.id)}
                                                    onCheckedChange={(checked) => {
                                                      return checked
                                                        ? field.onChange([...field.value, service.id])
                                                        : field.onChange(
                                                            field.value?.filter((value) => value !== service.id),
                                                          )
                                                    }}
                                                    className="border-gray-500 data-[state=checked]:bg-white data-[state=checked]:text-black"
                                                  />
                                                </FormControl>
                                                <FormLabel className="text-white font-normal cursor-pointer">
                                                  {service.label}
                                                </FormLabel>
                                              </FormItem>
                                            )
                                          }}
                                        />
                                      ))}
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white">Email</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="email"
                                        placeholder="Your Email"
                                        className="bg-[#1a1e2a] border-gray-700 text-white placeholder-gray-400"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white">Phone</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="tel"
                                        placeholder="Your Phone Number"
                                        className="bg-[#1a1e2a] border-gray-700 text-white placeholder-gray-400"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white">Campaign Budget Range</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-[#1a1e2a] border-gray-700 text-white">
                                          <SelectValue placeholder="Select budget range" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-[#1a1e2a] text-white border-gray-700">
                                        {budgetRanges.map((range) => (
                                          <SelectItem
                                            key={range.value}
                                            value={range.value}
                                            className="hover:bg-gray-700"
                                          >
                                            {range.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="pt-4">
                                <Button
                                  type="submit"
                                  className="w-full bg-white text-black-200 hover:bg-gray-200"
                                  disabled={formState.isSubmitting}
                                >
                                  {formState.isSubmitting ? "Submitting..." : "Submit"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </Form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex flex-col items-center justify-center h-full py-12"
                    >
                      <CheckCircle className="text-green-500 w-24 h-24 mb-4" />
                      <p className="text-white text-xl text-center">
                        Thank you! Your political consultation request has been submitted.
                      </p>
                      <p className="text-gray-300 mt-2 text-center">We'll be in touch with you shortly.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

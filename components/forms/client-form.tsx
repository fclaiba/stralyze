"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientSchema, type ClientFormData } from "@/lib/validations/client-schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { createClient, updateClient } from "@/lib/data/clients"
import type { Client } from "@/types/client"

interface ClientFormProps {
  client?: Client
  onSuccess: () => void
  onCancel: () => void
}

export default function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client ? {
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      company: client.company || ""
    } : {
      name: "",
      email: "",
      phone: "",
      company: ""
    }
  })

  const onSubmit = async (data: ClientFormData) => {
    try {
      setIsLoading(true)

      if (client) {
        // Actualizar cliente existente
        const result = await updateClient(client.id, data)
        if (result.success) {
          toast({
            title: "Cliente actualizado",
            description: "El cliente ha sido actualizado exitosamente.",
          })
          onSuccess()
        } else {
          toast({
            title: "Error",
            description: result.error || "Error al actualizar el cliente.",
            variant: "destructive",
          })
        }
      } else {
        // Crear nuevo cliente
        const result = await createClient(data)
        if (result.success) {
          toast({
            title: "Cliente creado",
            description: "El cliente ha sido creado exitosamente.",
          })
          reset()
          onSuccess()
        } else {
          toast({
            title: "Error",
            description: result.error || "Error al crear el cliente.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {client ? "Editar Cliente" : "Nuevo Cliente"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Nombre del cliente"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="email@ejemplo.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Empresa *</Label>
            <Input
              id="company"
              {...register("company")}
              placeholder="Nombre de la empresa"
              className={errors.company ? "border-red-500" : ""}
            />
            {errors.company && (
              <p className="text-sm text-red-500">{errors.company.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : client ? "Actualizar" : "Crear"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 
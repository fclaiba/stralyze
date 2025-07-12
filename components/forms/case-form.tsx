"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { caseSchema, type CaseFormData } from "@/lib/validations/case-schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { createCase, updateCase } from "@/lib/data/cases"
import { getClients } from "@/lib/data/clients"
import { getUsers } from "@/lib/data/users"
import type { Case } from "@/types/case"
import type { Client } from "@/types/client"

interface CaseFormProps {
  caseData?: Case
  onSuccess: () => void
  onCancel: () => void
}

export default function CaseForm({ caseData, onSuccess, onCancel }: CaseFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [users, setUsers] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
    defaultValues: caseData ? {
      title: caseData.title,
      client_id: caseData.client_id,
      status: caseData.status,
      priority: caseData.priority,
      assigned_to: caseData.assigned_to || "",
      budget: caseData.budget || undefined,
      start_date: caseData.start_date ? new Date(caseData.start_date).toISOString().split('T')[0] : undefined,
      due_date: caseData.due_date ? new Date(caseData.due_date).toISOString().split('T')[0] : undefined,
      description: caseData.description,
      progress: caseData.progress
    } : {
      title: "",
      client_id: "",
      status: "open",
      priority: "medium",
      assigned_to: "",
      budget: undefined,
      start_date: undefined,
      due_date: undefined,
      description: "",
      progress: 0
    }
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar clientes
        const clientsResult = await getClients()
        if (clientsResult.success) {
          setClients(clientsResult.data || [])
        }

        // Cargar usuarios
        const usersResult = await getUsers()
        if (usersResult.success) {
          setUsers(usersResult.data || [])
        }
      } catch (error) {
        console.error("Error loading form data:", error)
      }
    }

    loadData()
  }, [])

  const onSubmit = async (data: CaseFormData) => {
    try {
      setIsLoading(true)

      // Convertir fechas
      const formData = {
        ...data,
        start_date: data.start_date ? new Date(data.start_date).toISOString() : undefined,
        due_date: data.due_date ? new Date(data.due_date).toISOString() : undefined,
        assigned_to: data.assigned_to || null
      }

      if (caseData) {
        // Actualizar caso existente
        const result = await updateCase(caseData.id, formData)
        if (result.success) {
          toast({
            title: "Caso actualizado",
            description: "El caso ha sido actualizado exitosamente.",
          })
          onSuccess()
        } else {
          toast({
            title: "Error",
            description: result.error || "Error al actualizar el caso.",
            variant: "destructive",
          })
        }
      } else {
        // Crear nuevo caso
        const result = await createCase(formData)
        if (result.success) {
          toast({
            title: "Caso creado",
            description: "El caso ha sido creado exitosamente.",
          })
          reset()
          onSuccess()
        } else {
          toast({
            title: "Error",
            description: result.error || "Error al crear el caso.",
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {caseData ? "Editar Caso" : "Nuevo Caso"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Título del caso"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_id">Cliente *</Label>
              <Select
                value={watch("client_id")}
                onValueChange={(value) => setValue("client_id", value)}
              >
                <SelectTrigger className={errors.client_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.client_id && (
                <p className="text-sm text-red-500">{errors.client_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigned_to">Asignado a</Label>
              <Select
                value={watch("assigned_to")}
                onValueChange={(value) => setValue("assigned_to", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar usuario" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Abierto</SelectItem>
                  <SelectItem value="in_progress">En Progreso</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad *</Label>
              <Select
                value={watch("priority")}
                onValueChange={(value) => setValue("priority", value as any)}
              >
                <SelectTrigger className={errors.priority ? "border-red-500" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500">{errors.priority.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Presupuesto</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                {...register("budget", { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Fecha de inicio</Label>
              <Input
                id="start_date"
                type="date"
                {...register("start_date")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Fecha de vencimiento</Label>
              <Input
                id="due_date"
                type="date"
                {...register("due_date")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descripción detallada del caso"
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress">Progreso (%)</Label>
            <Input
              id="progress"
              type="number"
              min="0"
              max="100"
              {...register("progress", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : caseData ? "Actualizar" : "Crear"}
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
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/new-input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LockIcon } from "lucide-react"

interface PasswordProtectionProps {
  requiredPassword: string
  routePath: string
  children: React.ReactNode
}

export default function PasswordProtection({ requiredPassword, routePath, children }: PasswordProtectionProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if already authenticated for this route
  useEffect(() => {
    const storedAuth = localStorage.getItem(`auth_${routePath}`)
    if (storedAuth === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [routePath])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === requiredPassword) {
      // Store authentication in localStorage
      localStorage.setItem(`auth_${routePath}`, "true")
      setIsAuthenticated(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <LockIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Área Protegida</CardTitle>
            <CardDescription className="text-center">
              Ingrese la contraseña para acceder a la sección de Comunicación Política
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={error ? "border-destructive" : ""}
                  />
                  {error && <p className="text-sm text-destructive">Contraseña incorrecta. Intente nuevamente.</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Acceder
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

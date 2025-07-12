"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect"
import { createUser } from "@/lib/data/users"

export default function RegisterUser() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("gestor")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createUser({ name, email, password, role: role as "super-admin" | "admin" | "gestor" | "user" })
      router.push("/admin/dashboard")
    } catch (error) {
      setError("Failed to create user")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <CanvasRevealEffect
        animationSpeed={2}
        containerClassName="absolute inset-0"
        colors={[
          [50, 50, 50],
          [100, 100, 100],
          [200, 200, 200],
        ]}
        dotSize={3}
        opacities={[0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1]}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">Register New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder-gray-400"
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder-gray-400"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder-gray-400"
              />
              <Select onValueChange={setRole} defaultValue={role}>
                <SelectTrigger className="w-full bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border border-white/30">
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                </SelectContent>
              </Select>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-white text-black hover:bg-gray-300">
                Register User
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

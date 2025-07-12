import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Comunicación Política | Stralyze",
  description: "Estrategias de comunicación política efectivas para campañas exitosas",
}

export default function PoliticalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

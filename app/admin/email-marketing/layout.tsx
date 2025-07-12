import type React from "react"
import type { Metadata } from "next"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import AdminBackground from "@/components/admin-background"

export const metadata: Metadata = {
  title: "Email Marketing - Stralyze",
  description: "Email marketing campaign management",
}

export default function EmailMarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      {/* Add the admin background component */}
      <AdminBackground />

      <div className="ml-64 p-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Email Marketing</h1>
          <p className="text-gray-400 mb-6">Create and manage email campaigns for your leads and clients</p>

          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="bg-gray-800/80 border-gray-700 mb-6">
              <Link href="/admin/email-marketing/campaigns" passHref>
                <TabsTrigger value="campaigns" className="data-[state=active]:bg-white data-[state=active]:text-black">
                  Campaigns
                </TabsTrigger>
              </Link>
              <Link href="/admin/email-marketing/templates" passHref>
                <TabsTrigger value="templates" className="data-[state=active]:bg-white data-[state=active]:text-black">
                  Templates
                </TabsTrigger>
              </Link>
              <Link href="/admin/email-marketing/analytics" passHref>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-black">
                  Analytics
                </TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
        </div>

        {children}
      </div>
    </div>
  )
}

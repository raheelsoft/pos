import type React from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { authService } from "@/lib/services/auth-service"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    data: { user },
  } = await authService.getUser()

  if (!user) {
    console.log("[v0] No user session found, redirecting to login")
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen w-full bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <DashboardSidebar />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

"use client"

import { PeripheralFormTemplate } from "@/components/templates/PeripheralFormTemplate"
import { DashboardHeader } from "@/components/atomic-design/organisms/dashboard-header"
import { DashboardNav } from "@/components/atomic-design/molecules/dashboard-nav"

export default function PeripheralsPage() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <DashboardHeader />
      <DashboardNav currentPath="/peripherals" />
      <PeripheralFormTemplate />
    </div>
  )
}

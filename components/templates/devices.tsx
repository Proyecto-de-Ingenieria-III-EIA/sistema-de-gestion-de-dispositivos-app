import { DashboardNav } from "@/components/atomic-design/molecules/dashboard-nav"
import { DevicesTable } from "@/components/atomic-design/organisms/devices-table"
import { DashboardHeader } from "../atomic-design/organisms"
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "../atomic-design/molecules/card"
import { Suspense } from "react"

export function Devices() {
  return (
  <div className="flex min-h-screen flex-col">
  <DashboardHeader />
  <div className="flex flex-1">
    <DashboardNav currentPath="/devices" />
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardContent>
          <Suspense fallback={<div>Loading devices...</div>}>
          <DevicesTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
  )
} 
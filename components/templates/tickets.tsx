import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, DashboardNav } from "@/components/atomic-design/molecules"
import { DashboardHeader } from "@/components/atomic-design/organisms"
import { TicketsTable } from "../atomic-design/organisms/tickets-table"

export default function Tickets() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav currentPath="/tickets" />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Card>
            <CardContent>
              <Suspense fallback={<div>Loading tickets...</div>}>
                <TicketsTable />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
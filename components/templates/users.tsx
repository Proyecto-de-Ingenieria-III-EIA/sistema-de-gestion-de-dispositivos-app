import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, DashboardNav } from "@/components/atomic-design/molecules"
import { DashboardHeader } from "@/components/atomic-design/organisms"
import { UsersTable } from "@/components/atomic-design/organisms/users-table"

export default function Users() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav currentPath="/users" />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage system users and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading users...</div>}>
                <UsersTable />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 

import { DashboardSkeleton } from "@/components/atomic-design/molecules"
import { ErrorBoundary } from "@/components/atomic-design/organisms"
import { Dashboard } from "@/components/templates"
import { Suspense } from "react"

export default function DashboardPage() {
  return (
    <main className="flex-1">
      <ErrorBoundary fallback={<div className="p-4">Something went wrong with the dashboard</div>}>
        <Suspense fallback={<DashboardSkeleton />}>
          <Dashboard />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}


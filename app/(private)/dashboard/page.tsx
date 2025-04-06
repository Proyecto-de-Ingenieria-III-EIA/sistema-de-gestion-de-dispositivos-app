import Dashboard from "@/components/dashboard/dashboard"
import { ErrorBoundary } from "@/components/dashboard/error-boundary"
import { DashboardSkeleton } from "@/components/dashboard/skeletons"
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


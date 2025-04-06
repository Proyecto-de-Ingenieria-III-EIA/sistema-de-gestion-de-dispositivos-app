import { ErrorBoundary } from "@/components/dashboard/error-boundary"
import Loans from "@/components/dashboard/loans"
import { DashboardSkeleton } from "@/components/dashboard/skeletons"
import { Suspense } from "react"

export default function LoansPage() {
  return (
    <main className="flex-1">
      <ErrorBoundary fallback={<div className="p-4">Something went wrong with the dashboard</div>}>
        <Suspense fallback={<DashboardSkeleton />}>
          <Loans />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}


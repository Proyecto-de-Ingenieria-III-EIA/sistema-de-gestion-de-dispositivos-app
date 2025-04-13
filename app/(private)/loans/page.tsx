import { ErrorBoundary } from "@/components/atomic-design/organisms"
import { DashboardSkeleton } from "@/components/atomic-design/molecules"
import { Loans } from "@/components/atomic-design/organisms"
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


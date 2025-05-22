import { ErrorBoundary } from "@/components/atomic-design/organisms"
import { DashboardSkeleton } from "@/components/atomic-design/molecules"
import MapChart from "@/components/templates/MapChart"
import { Suspense } from "react"

export default function MapPage() {
  return (
    <main className="flex-1">
      <ErrorBoundary fallback={<div className="p-4">Something went wrong with the map visualization</div>}>
        <Suspense fallback={<DashboardSkeleton />}>
          <MapChart />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}

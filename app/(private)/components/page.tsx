import ComponentFormTemplate from "@/components/templates/ComponentFormTemplate"
import { DashboardHeader } from "@/components/atomic-design/organisms/dashboard-header"
import { DashboardNav } from "@/components/atomic-design/molecules/dashboard-nav"

export default function ComponentFormPage() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <DashboardHeader />
      <DashboardNav currentPath="/components" />
      <ComponentFormTemplate />
    </div>
  )
}

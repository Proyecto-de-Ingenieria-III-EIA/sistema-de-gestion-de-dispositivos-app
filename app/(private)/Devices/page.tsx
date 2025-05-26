import DeviceComponentsTemplate from "@/components/templates/DeviceComponentsTemplate"
import { DashboardHeader } from "@/components/atomic-design/organisms/dashboard-header"
import { DashboardNav } from "@/components/atomic-design/molecules/dashboard-nav"

export default function DeviceComponentsPage() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <DashboardHeader />
      <DashboardNav currentPath="/Devices" />
      <DeviceComponentsTemplate />
    </div>
  )
}

"use client"

import { useState } from "react"
import { ComponentSearchCombobox, type Component } from "@/components/atomic-design/molecules/ComponentSearchCombobox"
import { ComponentPreview } from "@/components/atomic-design/molecules/ComponentPreview"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ComponentSearchSectionProps {
  components: Component[]
  onEditComponent: (component: Component) => void
  className?: string
}

export function ComponentSearchSection({ components, onEditComponent, className }: ComponentSearchSectionProps) {
  const [selectedComponentId, setSelectedComponentId] = useState<string>("")

  const selectedComponent = components.find((component) => component.id === selectedComponentId)

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponentId(componentId)
  }

  const handleClearSelection = () => {
    setSelectedComponentId("")
  }

  const handleEditComponent = () => {
    if (selectedComponent) {
      onEditComponent(selectedComponent)
      setSelectedComponentId("")
    }
  }

  const handleViewComponent = () => {
    // Could open a modal or navigate to component details page
    console.log("View component:", selectedComponent)
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        <ComponentSearchCombobox
          components={components}
          selectedComponentId={selectedComponentId}
          onComponentSelect={handleComponentSelect}
        />

        {selectedComponent && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Selected Component</h3>
              <Button size="sm" variant="ghost" onClick={handleClearSelection} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ComponentPreview component={selectedComponent} onEdit={handleEditComponent} onView={handleViewComponent} />
          </div>
        )}

        {components.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No components registered yet.</p>
            <p className="text-sm">Register your first component using the form below.</p>
          </div>
        )}
      </div>
    </div>
  )
}

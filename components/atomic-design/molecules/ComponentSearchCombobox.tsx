"use client"

import { SearchCombobox, type SearchItem } from "@/components/atomic-design/atoms/SearchCombobox"

export interface Component {
  id: string
  brand: string
  model: string
  componentType: string
  description: string
  createdAt: Date
}

interface ComponentSearchComboboxProps {
  components: Component[]
  selectedComponentId?: string
  onComponentSelect: (componentId: string) => void
  className?: string
}

export function ComponentSearchCombobox({
  components,
  selectedComponentId,
  onComponentSelect,
  className,
}: ComponentSearchComboboxProps) {
  const searchItems: SearchItem[] = components.map((component) => ({
    value: component.id,
    label: `${component.brand} ${component.model}`,
    description: `${component.componentType} • ${component.description.slice(0, 50)}${component.description.length > 50 ? "..." : ""}`,
  }))

  return (
    <SearchCombobox
      items={searchItems}
      value={selectedComponentId}
      onSelect={onComponentSelect}
      placeholder="Search for a component..."
      searchPlaceholder="Search by brand, model, or type..."
      emptyMessage="No components found. Register a component first."
      label="Search Existing Components"
      className={className}
    />
  )
}

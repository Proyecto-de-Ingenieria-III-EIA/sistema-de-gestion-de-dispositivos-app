"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export interface Component {
  id: string
  name: string
}

interface ComponentsComboboxProps {
  components: Component[]
  selectedComponents: string[]
  onSelect: (componentId: string) => void
  onRemove: (componentId: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
}

export function ComponentsCombobox({
  components,
  selectedComponents,
  onSelect,
  onRemove,
  placeholder = "Select components...",
  emptyMessage = "No components found.",
  className,
}: ComponentsComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const handleSelect = (componentId: string) => {
    if (selectedComponents.includes(componentId)) {
      onRemove(componentId)
    } else {
      onSelect(componentId)
    }
  }

  const selectedComponentsData = components.filter((component) => selectedComponents.includes(component.id))

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            <span className="truncate">
              {selectedComponents.length > 0
                ? `${selectedComponents.length} component${selectedComponents.length > 1 ? "s" : ""} selected`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search components..." value={searchValue} onValueChange={setSearchValue} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {components.map((component) => (
                  <CommandItem key={component.id} value={component.id} onSelect={handleSelect}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedComponents.includes(component.id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {component.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedComponents.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedComponentsData.map((component) => (
            <Badge key={component.id} variant="secondary" className="flex items-center gap-1">
              {component.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                onClick={() => onRemove(component.id)}
              >
                <Plus className="h-3 w-3 rotate-45" />
                <span className="sr-only">Remove {component.name}</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

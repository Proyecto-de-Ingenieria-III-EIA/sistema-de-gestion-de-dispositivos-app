"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface Category {
  id: string
  name: string
}

interface CategorySelectProps {
  id: string
  label?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  categories: Category[]
  error?: string
  className?: string
}

export function CategorySelect({
  id,
  label,
  placeholder,
  value,
  onChange,
  categories,
  error,
  className,
}: CategorySelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className={cn("w-full", error && "border-destructive focus-visible:ring-destructive")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

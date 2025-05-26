"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormInputProps {
  id: string
  label?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
  className?: string
  type?: string
}

export function FormInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  className,
  type = "text",
}: FormInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("w-full", error && "border-destructive focus-visible:ring-destructive")}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

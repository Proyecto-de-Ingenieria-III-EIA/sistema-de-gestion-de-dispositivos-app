"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComponentFormFields } from "@/components/atomic-design/molecules/ComponentFormFields"
import { useToast } from "@/hooks/use-toast"

interface ComponentFormData {
  brand: string
  model: string
  componentType: string
  description: string
}

interface FormErrors {
  brand?: string
  model?: string
  componentType?: string
  description?: string
}

export interface Component {
  id: string
  brand: string
  model: string
  componentType: string
  description: string
  createdAt: Date
}

interface ComponentFormProps {
  editingComponent?: Component | null
  onComponentRegistered: (component: Component) => void
  onCancelEdit?: () => void
}

export function ComponentForm({ editingComponent, onComponentRegistered, onCancelEdit }: ComponentFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<ComponentFormData>({
    brand: editingComponent?.brand || "",
    model: editingComponent?.model || "",
    componentType: editingComponent?.componentType || "",
    description: editingComponent?.description || "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFieldChange = (field: keyof ComponentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required"
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model is required"
    }

    if (!formData.componentType) {
      newErrors.componentType = "Component type is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Component registered successfully!",
        description: `${formData.brand} ${formData.model} has been added to your inventory.`,
      })

      // Reset form
      setFormData({
        brand: "",
        model: "",
        componentType: "",
        description: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register component. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      brand: "",
      model: "",
      componentType: "",
      description: "",
    })
    setErrors({})
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Component Registration</CardTitle>
        <CardDescription>Add a new component to your inventory by filling out the form below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ComponentFormFields formData={formData} onChange={handleFieldChange} errors={errors} />

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register Component"}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} disabled={isSubmitting}>
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

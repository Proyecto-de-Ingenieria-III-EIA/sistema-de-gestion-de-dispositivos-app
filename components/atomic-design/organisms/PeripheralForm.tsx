"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { PeripheralFormFields } from "@/components/atomic-design/molecules/PeripheralFormFields"

interface PeripheralFormData {
  serialNumber: string
  model: string
  type: string
  brand: string
  price: string
  extraInfo: string
}

const initialFormData: PeripheralFormData = {
  serialNumber: "",
  model: "",
  type: "",
  brand: "",
  price: "",
  extraInfo: "",
}

export function PeripheralForm() {
  const [formData, setFormData] = useState<PeripheralFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<PeripheralFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const validateForm = (): boolean => {
    const newErrors: Partial<PeripheralFormData> = {}

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = "Serial number is required"
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model is required"
    }

    if (!formData.type) {
      newErrors.type = "Type is required"
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number"
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
        title: "Success!",
        description: "Peripheral has been added successfully.",
      })

      // Reset form
      setFormData(initialFormData)
      setErrors({})
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add peripheral. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof PeripheralFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PeripheralFormFields formData={formData} errors={errors} onChange={handleInputChange} />

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Adding..." : "Add Peripheral"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData(initialFormData)
            setErrors({})
          }}
          disabled={isSubmitting}
        >
          Clear
        </Button>
      </div>
    </form>
  )
}

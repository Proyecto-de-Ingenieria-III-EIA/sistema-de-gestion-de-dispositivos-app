"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DeviceComponentForm, type DeviceFormData } from "@/components/atomic-design/molecules/DeviceComponentForm"
import { useToast } from "@/hooks/use-toast"
import type { Component } from "@/components/atomic-design/atoms/ComponentsCombobox"
import type { Category } from "@/components/atomic-design/atoms/CategorySelect"

interface FormErrors {
  serialNumber?: string
  brand?: string
  model?: string
  components?: string
  extraInfo?: string
  price?: string
  category?: string
}

export interface Device extends DeviceFormData {
  id: string
  createdAt: Date
}

interface DeviceComponentsFormProps {
  components: Component[]
  categories: Category[]
  onDeviceAdded: (device: Device) => void
  className?: string
}

export function DeviceComponentsForm({ components, categories, onDeviceAdded, className }: DeviceComponentsFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<DeviceFormData>({
    serialNumber: "",
    brand: "",
    model: "",
    components: [],
    extraInfo: "",
    price: "",
    category: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFieldChange = (field: keyof DeviceFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = "Serial number is required"
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required"
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model is required"
    }

    if (formData.components.length === 0) {
      newErrors.components = "At least one component is required"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
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

      const device: Device = {
        id: `device-${Date.now()}`,
        ...formData,
        createdAt: new Date(),
      }

      onDeviceAdded(device)

      toast({
        title: "Device added successfully!",
        description: `${formData.brand} ${formData.model} has been added to your inventory.`,
      })

      // Reset form
      setFormData({
        serialNumber: "",
        brand: "",
        model: "",
        components: [],
        extraInfo: "",
        price: "",
        category: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add device. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      serialNumber: "",
      brand: "",
      model: "",
      components: [],
      extraInfo: "",
      price: "",
      category: "",
    })
    setErrors({})
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Add New Device</CardTitle>
        <CardDescription>Fill in the details below to add a new device to your inventory</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <DeviceComponentForm
            formData={formData}
            onChange={handleFieldChange}
            components={components}
            categories={categories}
            errors={errors}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleReset} disabled={isSubmitting}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Device"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

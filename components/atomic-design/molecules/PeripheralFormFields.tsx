"use client"

import { FormInput } from "@/components/atomic-design/atoms/FormInput"
import { FormTextarea } from "@/components/atomic-design/atoms/FormTextarea"
import { PeripheralTypeSelect } from "@/components/atomic-design/atoms/PeripheralTypeSelect"

interface PeripheralFormData {
  serialNumber: string
  model: string
  type: string
  brand: string
  price: string
  extraInfo: string
}

interface PeripheralFormFieldsProps {
  formData: PeripheralFormData
  errors: Partial<PeripheralFormData>
  onChange: (field: keyof PeripheralFormData, value: string) => void
}

export function PeripheralFormFields({ formData, errors, onChange }: PeripheralFormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormInput
        id="serialNumber"
        label="Serial Number"
        placeholder="type the serial number"
        value={formData.serialNumber}
        onChange={(value) => onChange("serialNumber", value)}
        error={errors.serialNumber}
      />

      <FormInput
        id="model"
        label="Model"
        placeholder="type the model"
        value={formData.model}
        onChange={(value) => onChange("model", value)}
        error={errors.model}
      />

      <PeripheralTypeSelect
        id="type"
        label="Type"
        placeholder="select the type"
        value={formData.type}
        onChange={(value) => onChange("type", value)}
        error={errors.type}
      />

      <FormInput
        id="brand"
        label="Brand"
        placeholder="type the Brand"
        value={formData.brand}
        onChange={(value) => onChange("brand", value)}
        error={errors.brand}
      />

      <FormInput
        id="price"
        label="Price"
        placeholder="type the price"
        value={formData.price}
        onChange={(value) => onChange("price", value)}
        error={errors.price}
        type="number"
      />

      <FormTextarea
        id="extraInfo"
        label="Extra Information"
        placeholder="type the extra info"
        value={formData.extraInfo}
        onChange={(value) => onChange("extraInfo", value)}
        error={errors.extraInfo}
        rows={4}
      />
    </div>
  )
}

"use client"

import { FormInput } from "@/components/atomic-design/atoms/FormInput"
import { FormSelect } from "@/components/atomic-design/atoms/FormSelect"
import { FormTextarea } from "@/components/atomic-design/atoms/FormTextarea"

interface ComponentFormData {
  brand: string
  model: string
  componentType: string
  description: string
}

interface ComponentFormFieldsProps {
  formData: ComponentFormData
  onChange: (field: keyof ComponentFormData, value: string) => void
  errors?: Partial<Record<keyof ComponentFormData, string>>
}

const componentTypeOptions = [
  { value: "ram", label: "RAM" },
  { value: "processor", label: "Processor" },
  { value: "gpu", label: "GPU" },
  { value: "board", label: "Board" },
  { value: "storage", label: "Storage" },
  { value: "other", label: "Other" },
]

export function ComponentFormFields({ formData, onChange, errors }: ComponentFormFieldsProps) {
  return (
    <div className="space-y-6">
      <FormInput
        id="brand"
        label="Brand"
        placeholder="type the brand"
        value={formData.brand}
        onChange={(value) => onChange("brand", value)}
        error={errors?.brand}
      />

      <FormInput
        id="model"
        label="Model"
        placeholder="type the model"
        value={formData.model}
        onChange={(value) => onChange("model", value)}
        error={errors?.model}
      />

      <FormSelect
        id="componentType"
        label="Component Type"
        placeholder="select the type of the component"
        value={formData.componentType}
        onChange={(value) => onChange("componentType", value)}
        options={componentTypeOptions}
        error={errors?.componentType}
      />

      <FormTextarea
        id="description"
        label="Description"
        placeholder="type the description"
        value={formData.description}
        onChange={(value) => onChange("description", value)}
        error={errors?.description}
        rows={4}
      />
    </div>
  )
}

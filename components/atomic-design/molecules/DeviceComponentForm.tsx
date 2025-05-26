"use client"
import { FormInput } from "@/components/atomic-design/atoms/FormInput"
import { ComponentsCombobox, type Component } from "@/components/atomic-design/atoms/ComponentsCombobox"
import { CategorySelect, type Category } from "@/components/atomic-design/atoms/CategorySelect"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface DeviceFormData {
  serialNumber: string
  brand: string
  model: string
  components: string[]
  extraInfo: string
  price: string
  category: string
}

interface DeviceComponentFormProps {
  formData: DeviceFormData
  onChange: (field: keyof DeviceFormData, value: any) => void
  components: Component[]
  categories: Category[]
  errors?: Partial<Record<keyof DeviceFormData, string>>
  className?: string
}

export function DeviceComponentForm({
  formData,
  onChange,
  components,
  categories,
  errors = {},
  className,
}: DeviceComponentFormProps) {
  const handleComponentSelect = (componentId: string) => {
    const updatedComponents = [...formData.components, componentId]
    onChange("components", updatedComponents)
  }

  const handleComponentRemove = (componentId: string) => {
    const updatedComponents = formData.components.filter((id) => id !== componentId)
    onChange("components", updatedComponents)
  }

  return (
    <div className={cn("space-y-6", className)}>
      <FormInput
        id="serialNumber"
        placeholder="type the serial number"
        value={formData.serialNumber}
        onChange={(value) => onChange("serialNumber", value)}
        error={errors.serialNumber}
      />

      <FormInput
        id="brand"
        placeholder="type the brand"
        value={formData.brand}
        onChange={(value) => onChange("brand", value)}
        error={errors.brand}
      />

      <FormInput
        id="model"
        placeholder="type the model"
        value={formData.model}
        onChange={(value) => onChange("model", value)}
        error={errors.model}
      />

      <div className="space-y-2">
        <Label htmlFor="components" className="text-sm font-medium text-foreground">
          Components
        </Label>
        <ComponentsCombobox
          components={components}
          selectedComponents={formData.components}
          onSelect={handleComponentSelect}
          onRemove={handleComponentRemove}
          placeholder="select the components"
          emptyMessage="No components found"
        />
        {errors.components && <p className="text-sm text-destructive">{errors.components}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="extraInfo" className="text-sm font-medium text-foreground">
          Extra Info
        </Label>
        <Textarea
          id="extraInfo"
          placeholder="type the extra info"
          value={formData.extraInfo}
          onChange={(e) => onChange("extraInfo", e.target.value)}
          className={cn(errors.extraInfo && "border-destructive focus-visible:ring-destructive")}
        />
        {errors.extraInfo && <p className="text-sm text-destructive">{errors.extraInfo}</p>}
      </div>

      <FormInput
        id="price"
        placeholder="type the price"
        value={formData.price}
        onChange={(value) => onChange("price", value)}
        error={errors.price}
        type="number"
      />

      <CategorySelect
        id="category"
        placeholder="select the category of the device"
        value={formData.category}
        onChange={(value) => onChange("category", value)}
        categories={categories}
        error={errors.category}
      />
    </div>
  )
}

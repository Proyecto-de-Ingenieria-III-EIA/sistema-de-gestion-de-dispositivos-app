"use client"

import { FormSelect } from "@/components/atomic-design/atoms/FormSelect"

interface PeripheralTypeSelectProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
  className?: string
}

const peripheralTypes = [
  { value: "mouse", label: "Mouse" },
  { value: "keyboard", label: "Keyboard" },
  { value: "monitor", label: "Monitor" },
  { value: "printer", label: "Printer" },
  { value: "scanner", label: "Scanner" },
  { value: "webcam", label: "Webcam" },
  { value: "speakers", label: "Speakers" },
  { value: "headphones", label: "Headphones" },
  { value: "microphone", label: "Microphone" },
  { value: "external-drive", label: "External Drive" },
  { value: "usb-hub", label: "USB Hub" },
  { value: "docking-station", label: "Docking Station" },
  { value: "graphics-tablet", label: "Graphics Tablet" },
  { value: "gamepad", label: "Gamepad" },
  { value: "other", label: "Other" },
]

export function PeripheralTypeSelect({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  className,
}: PeripheralTypeSelectProps) {
  return (
    <FormSelect
      id={id}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      options={peripheralTypes}
      error={error}
      className={className}
    />
  )
}

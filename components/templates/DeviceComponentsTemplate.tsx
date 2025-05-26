"use client"

import { useState } from "react"
import { DeviceComponentsForm, type Device } from "@/components/atomic-design/organisms/DeviceComponentsForm"
import { DeviceComponentsList } from "@/components/atomic-design/organisms/DeviceComponentsList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Component } from "@/components/atomic-design/atoms/ComponentsCombobox"
import type { Category } from "@/components/atomic-design/atoms/CategorySelect"

// Sample data for components
const sampleComponents: Component[] = [
  { id: "comp-1", name: "CPU" },
  { id: "comp-2", name: "RAM" },
  { id: "comp-3", name: "GPU" },
  { id: "comp-4", name: "SSD" },
  { id: "comp-5", name: "HDD" },
  { id: "comp-6", name: "Motherboard" },
  { id: "comp-7", name: "Power Supply" },
  { id: "comp-8", name: "Cooling Fan" },
  { id: "comp-9", name: "Case" },
  { id: "comp-10", name: "Monitor" },
  { id: "comp-11", name: "Keyboard" },
  { id: "comp-12", name: "Mouse" },
  { id: "comp-13", name: "Speakers" },
  { id: "comp-14", name: "Webcam" },
  { id: "comp-15", name: "Microphone" },
]

// Sample data for categories
const sampleCategories: Category[] = [
  { id: "cat-1", name: "Desktop" },
  { id: "cat-2", name: "Laptop" },
  { id: "cat-3", name: "Tablet" },
  { id: "cat-4", name: "Smartphone" },
  { id: "cat-5", name: "Server" },
  { id: "cat-6", name: "Networking" },
  { id: "cat-7", name: "Peripheral" },
  { id: "cat-8", name: "Audio" },
  { id: "cat-9", name: "Video" },
  { id: "cat-10", name: "Gaming" },
]

export default function DeviceComponentsTemplate() {
  const { toast } = useToast()
  const [devices, setDevices] = useState<Device[]>([])
  const [activeTab, setActiveTab] = useState("inventory")

  const handleDeviceAdded = (device: Device) => {
    setDevices((prev) => [...prev, device])
    setActiveTab("inventory") // Switch to inventory tab after adding
  }

  const handleDeleteDevice = (deviceId: string) => {
    // Confirm before deleting
    if (window.confirm("Are you sure you want to delete this device?")) {
      setDevices((prev) => prev.filter((device) => device.id !== deviceId))
      toast({
        title: "Device deleted",
        description: "The device has been removed from your inventory.",
      })
    }
  }

  const handleEditDevice = (device: Device) => {
    // In a real application, you would implement editing functionality
    // For this example, we'll just show a toast
    toast({
      title: "Edit device",
      description: `Editing ${device.brand} ${device.model} (${device.serialNumber})`,
    })
    console.log("Edit device:", device)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Device Components Management</h1>
            <p className="text-muted-foreground">Add and manage devices with their components</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inventory">Device Inventory</TabsTrigger>
              <TabsTrigger value="add">Add New Device</TabsTrigger>
            </TabsList>

            <TabsContent value="inventory" className="space-y-4">
              <DeviceComponentsList
                devices={devices}
                components={sampleComponents}
                categories={sampleCategories}
                onDeleteDevice={handleDeleteDevice}
                onEditDevice={handleEditDevice}
              />
            </TabsContent>

            <TabsContent value="add">
              <DeviceComponentsForm
                components={sampleComponents}
                categories={sampleCategories}
                onDeviceAdded={handleDeviceAdded}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

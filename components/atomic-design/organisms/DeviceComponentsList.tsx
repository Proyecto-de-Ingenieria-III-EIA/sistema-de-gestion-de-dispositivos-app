"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Edit, Trash2 } from "lucide-react"
import type { Device } from "@/components/atomic-design/organisms/DeviceComponentsForm"
import type { Component } from "@/components/atomic-design/atoms/ComponentsCombobox"
import type { Category } from "@/components/atomic-design/atoms/CategorySelect"

interface DeviceComponentsListProps {
  devices: Device[]
  components: Component[]
  categories: Category[]
  onDeleteDevice: (deviceId: string) => void
  onEditDevice: (device: Device) => void
  className?: string
}

export function DeviceComponentsList({
  devices,
  components,
  categories,
  onDeleteDevice,
  onEditDevice,
  className,
}: DeviceComponentsListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDevices = devices.filter((device) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      device.serialNumber.toLowerCase().includes(searchLower) ||
      device.brand.toLowerCase().includes(searchLower) ||
      device.model.toLowerCase().includes(searchLower) ||
      // Search in components
      device.components.some((componentId) => {
        const component = components.find((c) => c.id === componentId)
        return component?.name.toLowerCase().includes(searchLower)
      })
    )
  })

  const getComponentName = (componentId: string) => {
    return components.find((c) => c.id === componentId)?.name || "Unknown"
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown"
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(price))
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Device Inventory</CardTitle>
        <CardDescription>View and manage your registered devices</CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search devices by serial, brand, model or component..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredDevices.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Components</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.serialNumber}</TableCell>
                    <TableCell>{device.brand}</TableCell>
                    <TableCell>{device.model}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {device.components.map((componentId) => (
                          <Badge key={componentId} variant="outline">
                            {getComponentName(componentId)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(device.price)}</TableCell>
                    <TableCell>{getCategoryName(device.category)}</TableCell>
                    <TableCell>{formatDate(device.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEditDevice(device)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteDevice(device.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No devices found</p>
            {devices.length > 0 && <p className="text-sm text-muted-foreground mt-1">Try adjusting your search term</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

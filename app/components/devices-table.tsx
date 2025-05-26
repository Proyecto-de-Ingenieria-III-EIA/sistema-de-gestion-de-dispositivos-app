"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atomic-design/molecules"
import { Button } from "@/components/atomic-design/atoms"
import { Badge } from "@/components/atomic-design/atoms/badge"
import { Enum_Category } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atomic-design/molecules"

interface Device {
  id: string;
  serialNumber: string;
  brand: string;
  model: string;
  extraInfo: string;
  price: number;
  category: Enum_Category;
  loans?: {
    arrivalCity?: {
      name: string;
    };
  }[];
}

const GET_DEVICES = `
  query GetDevices {
    getDevices {
      id
      serialNumber
      brand
      model
      extraInfo
      price
      category
      loans {
        arrivalCity {
          name
        }
      }
    }
  }
`

export function DevicesTable() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])

  const getDeviceLocation = (device: Device) => {
    if (!device.loans || device.loans.length === 0) {
      return 'Available'
    }
    // Since we only get arrivalCity in the query, we'll consider any loan with an arrival city as active
    const activeLoan = device.loans.find(loanDevice => loanDevice.arrivalCity?.name)
    return activeLoan?.arrivalCity?.name || 'Available'
  }

  const handleEdit = (device: Device) => {
    // TODO: Implement edit functionality
    console.log('Edit device:', device)
  }

  const handleDelete = (deviceId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete device:', deviceId)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Devices</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          {/* ... existing dialog code ... */}
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serial Number</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Extra Info</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDevices.map((device) => (
            <TableRow key={device.id}>
              <TableCell>{device.serialNumber}</TableCell>
              <TableCell>{device.brand}</TableCell>
              <TableCell>{device.model}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {device.category}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getDeviceLocation(device) === 'Available' ? 'default' : 'secondary'}>
                  {getDeviceLocation(device)}
                </Badge>
              </TableCell>
              <TableCell>${device.price.toFixed(2)}</TableCell>
              <TableCell>{device.extraInfo}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(device)}>
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(device.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ... existing dialogs ... */}
    </div>
  )
} 
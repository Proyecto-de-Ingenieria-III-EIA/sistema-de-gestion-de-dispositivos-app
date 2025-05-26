"use client"

import { useState, useEffect } from "react"
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
import { useSession } from "next-auth/react"
import { graphqlRequest } from "@/lib/graphql-client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atomic-design/molecules"
import { Input } from "@/components/atomic-design/atoms"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atomic-design/molecules"

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
      createdAt
      updatedAt
      loans {
        status
        arrivalCity {
          name
        }
      }
    }
  }
`

const CREATE_DEVICE = `
  mutation CreateDevice($input: CreateDeviceInput!) {
    createDevice(input: $input) {
      id
      serialNumber
      brand
      model
      extraInfo
      price
      category
      createdAt
      updatedAt
    }
  }
`

const UPDATE_DEVICE = `
  mutation UpdateDevice($input: UpdateDeviceInput!) {
    updateDevice(input: $input) {
      id
      serialNumber
      brand
      model
      extraInfo
      price
      category
      createdAt
      updatedAt
    }
  }
`

const DELETE_DEVICE = `
  mutation DeleteDevice($id: ID!) {
    deleteDevice(id: $id) {
      message
    }
  }
`

interface Device {
  id: string;
  serialNumber: string;
  brand: string;
  model: string;
  extraInfo: string;
  price: number;
  category: Enum_Category;
  loans?: {
    status: string;
    arrivalCity: {
      name: string;
    };
  }[];
}

interface DeviceFormData {
  serialNumber: string;
  brand: string;
  model: string;
  extraInfo: string;
  price: number;
  category: Enum_Category;
}

export function DevicesTable() {
  const { data: session, status } = useSession()
  const [devices, setDevices] = useState<Device[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [filters, setFilters] = useState({
    category: 'ALL',
    location: 'ALL',
    search: '',
  })
  const [formData, setFormData] = useState<DeviceFormData>({
    serialNumber: '',
    brand: '',
    model: '',
    extraInfo: '',
    price: 0,
    category: Enum_Category.LAPTOP,
  })

  useEffect(() => {
    const fetchDevices = async () => {
      if (status === 'loading') {
        return
      }

      if (status === 'unauthenticated') {
        setError('You must be logged in to view devices')
        setIsLoading(false)
        return
      }

      if (!session?.user) {
        setError('Session not found')
        setIsLoading(false)
        return
      }

      try {
        const response = await graphqlRequest<{ getDevices: Device[] }>({
          query: GET_DEVICES,
          headers: {
            'session-token': session.user.email || ''
          }
        })

        if (response.errors) {
          const errorMessage = response.errors[0]?.message
          if (errorMessage?.includes('No autorizado') || errorMessage?.includes('permission error')) {
            setError('You do not have permission to view devices')
          } else {
            throw new Error(errorMessage || 'Failed to fetch devices')
          }
          return
        }

        setDevices(response.data?.getDevices || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDevices()
  }, [session, status])

  const handleCreate = async () => {
    try {
      const response = await graphqlRequest<{ createDevice: Device }>({
        query: CREATE_DEVICE,
        variables: {
          input: formData,
        },
        headers: {
          'session-token': session?.user?.email || ''
        }
      })

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'Failed to create device')
      }

      if (!response.data?.createDevice) {
        throw new Error('No device data returned from server')
      }

      setDevices([...devices, response.data.createDevice])
      setIsCreateDialogOpen(false)
      setFormData({
        serialNumber: '',
        brand: '',
        model: '',
        extraInfo: '',
        price: 0,
        category: Enum_Category.LAPTOP,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create device')
    }
  }

  const handleUpdate = async () => {
    if (!selectedDevice) return
    if (!session?.user?.email) {
      setError('You must be logged in to update devices')
      return
    }

    try {
      const response = await graphqlRequest<{ updateDevice: Device }>({
        query: UPDATE_DEVICE,
        variables: {
          input: {
            deviceId: selectedDevice.id,
            ...formData,
          },
        },
        headers: {
          'session-token': session.user.email
        }
      })

      if (response.errors) {
        const errorMessage = response.errors[0]?.message
        if (errorMessage?.includes('No autorizado')) {
          setError('You do not have permission to update devices')
        } else {
          throw new Error(errorMessage || 'Failed to update device')
        }
        return
      }

      if (!response.data?.updateDevice) {
        throw new Error('No device data returned from server')
      }

      setDevices(devices.map(device => 
        device.id === selectedDevice.id ? response.data!.updateDevice : device
      ))
      setIsEditDialogOpen(false)
      setSelectedDevice(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update device')
    }
  }

  const handleDelete = async (deviceId: string) => {
    try {
      const response = await graphqlRequest<{ deleteDevice: { message: string } }>({
        query: DELETE_DEVICE,
        variables: {
          id: deviceId,
        },
        headers: {
          'session-token': session?.user?.email || ''
        }
      })

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'Failed to delete device')
      }

      setDevices(devices.filter(device => device.id !== deviceId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete device')
    }
  }

  const handleEdit = (device: Device) => {
    setSelectedDevice(device)
    setFormData({
      serialNumber: device.serialNumber,
      brand: device.brand,
      model: device.model,
      extraInfo: device.extraInfo,
      price: device.price,
      category: device.category,
    })
    setIsEditDialogOpen(true)
  }

  const getDeviceLocation = (device: Device) => {
    if (!device.loans || device.loans.length === 0) {
      return 'Available'
    }
    const activeLoan = device.loans.find(loan => 
      ['PENDING', 'APPROVED', 'EXTENDED'].includes(loan.status)
    )
    return activeLoan?.arrivalCity?.name || 'Available'
  }

  const filteredDevices = devices.filter(device => {
    const matchesCategory = filters.category === 'ALL' || device.category === filters.category
    const matchesLocation = filters.location === 'ALL' || getDeviceLocation(device) === filters.location
    const searchTerm = filters.search.toLowerCase()
    const matchesSearch = !searchTerm || 
      device.brand.toLowerCase().includes(searchTerm) ||
      device.model.toLowerCase().includes(searchTerm) ||
      device.serialNumber.toLowerCase().includes(searchTerm)

    return matchesCategory && matchesLocation && matchesSearch
  })

  const locations = Array.from(new Set(devices.map(device => getDeviceLocation(device))))

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Devices</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Device</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label>Serial Number</label>
                <Input
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label>Brand</label>
                <Input
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label>Model</label>
                <Input
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label>Extra Info</label>
                <Input
                  value={formData.extraInfo}
                  onChange={(e) => setFormData({ ...formData, extraInfo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label>Price</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label>Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value: Enum_Category) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Enum_Category.LAPTOP}>Laptop</SelectItem>
                    <SelectItem value={Enum_Category.PC}>PC</SelectItem>
                    <SelectItem value={Enum_Category.MOBILE}>Mobile</SelectItem>
                    <SelectItem value={Enum_Category.TABLET}>Tablet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate}>Create Device</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-4">
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value={Enum_Category.LAPTOP}>Laptop</SelectItem>
            <SelectItem value={Enum_Category.PC}>PC</SelectItem>
            <SelectItem value={Enum_Category.MOBILE}>Mobile</SelectItem>
            <SelectItem value={Enum_Category.TABLET}>Tablet</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.location}
          onValueChange={(value) => setFilters({ ...filters, location: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by brand, model, or serial number"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-[300px]"
        />
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label>Serial Number</label>
              <Input
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label>Brand</label>
              <Input
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label>Model</label>
              <Input
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label>Extra Info</label>
              <Input
                value={formData.extraInfo}
                onChange={(e) => setFormData({ ...formData, extraInfo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label>Price</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label>Category</label>
              <Select
                value={formData.category}
                onValueChange={(value: Enum_Category) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Enum_Category.LAPTOP}>Laptop</SelectItem>
                  <SelectItem value={Enum_Category.PC}>PC</SelectItem>
                  <SelectItem value={Enum_Category.MOBILE}>Mobile</SelectItem>
                  <SelectItem value={Enum_Category.TABLET}>Tablet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdate}>Update Device</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
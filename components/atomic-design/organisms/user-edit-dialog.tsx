"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atomic-design/molecules"
import { Button } from "@/components/atomic-design/atoms"
import { Input } from "@/components/atomic-design/atoms"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atomic-design/molecules"
import { Enum_RoleName } from "@prisma/client"

interface User {
  id: string
  name: string | null
  email: string
  role: {
    name: Enum_RoleName
  }
}

interface UserEditDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateRole: (userId: string, newRole: Enum_RoleName) => Promise<void>
}

export function UserEditDialog({ user, open, onOpenChange, onUpdateRole }: UserEditDialogProps) {
  const [formData, setFormData] = useState<User | null>(null)

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData(user)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData) {
      await onUpdateRole(formData.id, formData.role.name)
      onOpenChange(false)
    }
  }

  if (!formData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user's information here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData((prev) => prev && { ...prev, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="role">Role</label>
              <Select
                value={formData.role.name}
                onValueChange={(value: Enum_RoleName) =>
                  setFormData((prev) => prev && {
                    ...prev,
                    role: { ...prev.role, name: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Enum_RoleName.ADMIN}>Admin</SelectItem>
                  <SelectItem value={Enum_RoleName.CLIENT}>Client</SelectItem>
                  <SelectItem value={Enum_RoleName.TECHNICAL}>Technical</SelectItem>
                  <SelectItem value={Enum_RoleName.COORDINATOR}>Coordinator</SelectItem>
                  <SelectItem value={Enum_RoleName.EMPLOYEE}>Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
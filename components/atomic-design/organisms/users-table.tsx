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
import { Edit } from "lucide-react"
import { UserEditDialog } from "@/components/atomic-design/organisms/user-edit-dialog"
import { useSession } from "next-auth/react"
import { graphqlRequest } from "@/lib/graphql-client"
import { Enum_RoleName } from "@prisma/client"

interface User {
  id: string
  name: string | null
  email: string
  role: {
    name: Enum_RoleName
  }
}

interface GetUsersResponse {
  getUsers: User[]
}

interface UpdateUserRoleResponse {
  updateUserRole: User
}

const GET_USERS = `
  query GetUsers {
    getUsers {
      id
      name
      email
      role {
        name
      }
    }
  }
`

const UPDATE_USER_ROLE = `
  mutation UpdateUserRole($id: String!, $roleName: String!) {
    updateUserRole(id: $id, roleName: $roleName) {
      id
      name
      email
      role {
        name
      }
    }
  }
`

export function UsersTable() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await graphqlRequest<GetUsersResponse>({
          query: GET_USERS,
          headers: {
            'session-token': session?.user?.email || ''
          }
        })
        console.log('GraphQL Response:', response)
        if (response.errors) {
          console.error('GraphQL Errors:', response.errors)
          setError(response.errors[0]?.message || 'Failed to fetch users')
          return
        }
        if (response.data?.getUsers) {
          console.log('Users data:', response.data.getUsers)
          setUsers(response.data.getUsers)
        } else {
          console.log('No users data in response')
        }
      } catch (err) {
        console.error('Error fetching users:', err)
        setError(err instanceof Error ? err.message : "Failed to fetch users")
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user?.email) {
      fetchUsers()
    }
  }, [session])

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleUpdateRole = async (userId: string, newRole: Enum_RoleName) => {
    try {
      const response = await graphqlRequest<UpdateUserRoleResponse>({
        query: UPDATE_USER_ROLE,
        variables: {
          id: userId,
          roleName: newRole,
        },
        headers: {
          'session-token': session?.user?.email || ''
        }
      })
      
      if (response.errors) {
        console.error('GraphQL Errors:', response.errors)
        setError(response.errors[0]?.message || 'Failed to update user role')
        return
      }

      const updatedUser = response.data?.updateUserRole
      if (updatedUser) {
        setUsers(users.map(user => 
          user.id === userId ? updatedUser : user
        ))
      }
    } catch (err) {
      console.error('Error updating user role:', err)
      setError(err instanceof Error ? err.message : "Failed to update user role")
    }
  }

  if (isLoading) {
    return <div>Loading users...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name || "N/A"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserEditDialog
        user={selectedUser}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateRole={handleUpdateRole}
      />
    </>
  )
} 
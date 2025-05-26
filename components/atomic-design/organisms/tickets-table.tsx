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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atomic-design/molecules"
import { Button } from "@/components/atomic-design/atoms"
import { useSession } from "next-auth/react"
import { graphqlRequest } from "@/lib/graphql-client"
import { Badge } from '@/components/atomic-design/atoms/badge'
import { Enum_RoleName } from '@prisma/client'

const GET_TICKETS = `
  query GetTickets {
    getTickets {
      id
      subject
      description
      state
      createdAt
      updatedAt
      technician {
        id
        name
        email
      }
      device {
        id
        brand
        model
        serialNumber
      }
      loan {
        user {
          id
          email
        }
      }
    }
  }
`

const GET_TECHNICAL_USERS = `
  query GetTechnicalUsers {
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

const UPDATE_TICKET_STATE = `
  mutation UpdateTicketState($ticketId: ID!, $state: Enum_TicketState!) {
    updateTicketState(ticketId: $ticketId, state: $state) {
      id
      state
    }
  }
`

const ASSIGN_TICKET = `
  mutation AssignTicketToTechnician($ticketId: ID!, $technicianId: ID!) {
    assignTicketToTechnician(ticketId: $ticketId, technicianId: $technicianId) {
      id
      technician {
        id
        name
        email
      }
    }
  }
`

interface Ticket {
  id: string;
  subject: string;
  description: string;
  state: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  technician: {
    id: string;
    name: string;
    email: string;
  } | null;
  device: {
    id: string;
    brand: string;
    model: string;
    serialNumber: string;
  };
  loan: {
    user: {
      id: string;
      email: string;
    };
  };
}

interface TechnicalUser {
  id: string;
  name: string;
  email: string;
  role: {
    name: string;
  };
}

export function TicketsTable() {
  const { data: session } = useSession()
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [technicalUsers, setTechnicalUsers] = useState<TechnicalUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsResponse, usersResponse] = await Promise.all([
          graphqlRequest<{ getTickets: Ticket[] }>({
            query: GET_TICKETS,
            headers: {
              'session-token': session?.user?.email || ''
            }
          }),
          graphqlRequest<{ getUsers: TechnicalUser[] }>({
            query: GET_TECHNICAL_USERS,
            headers: {
              'session-token': session?.user?.email || ''
            }
          })
        ])

        if (ticketsResponse.errors) {
          throw new Error(ticketsResponse.errors[0]?.message || 'Failed to fetch tickets')
        }

        if (usersResponse.errors) {
          throw new Error(usersResponse.errors[0]?.message || 'Failed to fetch users')
        }

        setTickets(ticketsResponse.data?.getTickets || [])
        setTechnicalUsers(usersResponse.data?.getUsers.filter(user => user.role.name === Enum_RoleName.TECHNICAL) || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user?.email) {
      fetchData()
    }
  }, [session])

  const userRole = session?.user?.role as Enum_RoleName
  const canReassign = userRole === Enum_RoleName.COORDINATOR || userRole === Enum_RoleName.ADMIN
  const canUpdateState = userRole === Enum_RoleName.COORDINATOR || 
                        userRole === Enum_RoleName.TECHNICAL || 
                        userRole === Enum_RoleName.ADMIN

  const filteredTickets = selectedStatus === "all"
    ? tickets
    : tickets.filter(ticket => ticket.state === selectedStatus)

  const handleStatusChange = async (ticketId: string, newState: 'OPEN' | 'IN_PROGRESS' | 'CLOSED') => {
    try {
      const response = await graphqlRequest<{ updateTicketState: Ticket }>({
        query: UPDATE_TICKET_STATE,
        variables: {
          ticketId,
          state: newState,
        },
        headers: {
          'session-token': session?.user?.email || ''
        }
      })

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'Failed to update ticket status')
      }

      setTickets(tickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, state: newState }
          : ticket
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket status')
    }
  }

  const handleReassign = async (ticketId: string, technicianId: string) => {
    try {
      const response = await graphqlRequest<{ assignTicketToTechnician: Ticket }>({
        query: ASSIGN_TICKET,
        variables: {
          ticketId,
          technicianId,
        },
        headers: {
          'session-token': session?.user?.email || ''
        }
      })

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'Failed to reassign ticket')
      }

      // Find the assigned technician from technicalUsers
      const assignedTechnician = technicalUsers.find(user => user.id === technicianId)

      // Update the tickets state with the new technician
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              technician: assignedTechnician ? {
                id: assignedTechnician.id,
                name: assignedTechnician.name,
                email: assignedTechnician.email
              } : null
            }
          : ticket
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reassign ticket')
    }
  }

  const getTicketRelationship = (ticket: Ticket) => {
    if (!session?.user?.email) return '-'
    if (ticket.technician?.email === session.user.email) return 'Assigned to me'
    if (ticket.loan.user.email === session.user.email) return 'Created by me'
    return '-'
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tickets</h2>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Technician</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Relationship</TableHead>
            <TableHead>Change Status</TableHead>
            <TableHead>Assign Technician</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>{ticket.device.brand} {ticket.device.model}</TableCell>
              <TableCell>
                <Badge variant={
                  ticket.state === 'OPEN' ? 'destructive' :
                  ticket.state === 'IN_PROGRESS' ? 'default' :
                  'secondary'
                }>
                  {ticket.state}
                </Badge>
              </TableCell>
              <TableCell>
                {ticket.technician ? ticket.technician.name : 'Unassigned'}
              </TableCell>
              <TableCell>
                {new Date(ticket.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getTicketRelationship(ticket)}
                </Badge>
              </TableCell>
              <TableCell>
                {canUpdateState && (
                  <Select
                    value={ticket.state}
                    onValueChange={(value: 'OPEN' | 'IN_PROGRESS' | 'CLOSED') => 
                      handleStatusChange(ticket.id, value)
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
              <TableCell>
                {canReassign && (
                  <Select
                    value={ticket.technician?.id || ''}
                    onValueChange={(value) => handleReassign(ticket.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={ticket.technician ? ticket.technician.name : "Assign technician"} />
                    </SelectTrigger>
                    <SelectContent>
                      {technicalUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 
import { Resolver } from '@/types';
import { GraphQLError } from 'graphql';
import { Enum_RoleName, PrismaClient, Role, User } from '@prisma/client';

interface CreateTicketInput {
  technicianId: any;
  subject: string;
  description: string;
  loanId: string;
  deviceId: string;
}

interface getUserAssignedTicketsInput {
  state?: 'OPEN' | 'CLOSED' | 'IN_PROGRESS';
}

interface CloseTicketInput {
  ticketId: string;
}

const ticketResolvers: Resolver = {
  Query: {
    getTickets: async (parent, args, { db, authData }) => {
      // Only allow ADMIN, COORDINATOR, and TECHNICAL roles to view tickets
      if (!['ADMIN', 'COORDINATOR', 'TECHNICAL'].includes(authData.role)) {
        throw new GraphQLError('Not authorized to view tickets');
      }

      // Get the current user
      const user = await db.user.findUnique({
        where: { email: authData.email }
      });

      if (!user) {
        throw new GraphQLError('User not found');
      }

      // If user is ADMIN, return all tickets
      if (authData.role === 'ADMIN') {
        return await db.ticket.findMany({
          include: {
            device: true,
            technician: true
          }
        });
      }

      // For TECHNICAL and COORDINATOR, only return their assigned tickets
      return await db.ticket.findMany({
        where: {
          technicianId: user.id
        },
        include: {
          device: true,
          technician: true
        }
      });
    },
    getTicketById: async (parent, { id }: { id: string }, { db }) => {
      const ticket = await db.ticket.findUnique({ where: { id } });
      if (!ticket) {
        throw new GraphQLError('Ticket not found.');
      }
      return ticket;
    },
    getTicketsByLoanId: async (parent, { loanId }: { loanId: string }, { db }) => {
      const tickets = await db.ticket.findMany({ where: { loanId } });
      if (!tickets) {
        throw new GraphQLError('No tickets found for this loan.');
      }
      return tickets;
    },
    getActiveTickets: async (parent, args, { db, authData }) => {
      if (authData.role !== Enum_RoleName.COORDINATOR && authData.role !== Enum_RoleName.ADMIN) {
        throw new GraphQLError('Not authorized to view active tickets.');
      }
      const tickets = await db.ticket.findMany({ where: { state: 'OPEN' } });
      if (!tickets) {
        throw new GraphQLError('No active tickets found.');
      }
      return tickets;
    },
    getAssignedTicketsByUserId: async (parent, { userId }: { userId: string }, { db, authData }) => {
      if (authData.role !== Enum_RoleName.COORDINATOR && authData.role !== Enum_RoleName.ADMIN) {
        throw new GraphQLError('Not authorized to view assigned tickets.');
      }
      const tickets = await db.ticket.findMany({ where: { technicianId: userId } });
      if (!tickets) {
        throw new GraphQLError('No assigned tickets found.');
      }
      return tickets;
    },
    getUserAssignedTickets: async (parent, {input}: {input:getUserAssignedTicketsInput}, { db, authData }) => {
      if (authData.role !== Enum_RoleName.TECHNICAL) {
        throw new GraphQLError('Only technical users have assigned tickets');
      }
      const user = await db.user.findUnique({ where: { email: authData.email } });
      if (!user) {
        throw new GraphQLError('User not found.');
      }
      let tickets;
      if (input.state) {
        tickets = await db.ticket.findMany({ where: { technicianId: user.id, state: input.state } });
      } else {
        tickets = await db.ticket.findMany({ where: { technicianId: user.id } });
      }
      if (!tickets) {
        throw new GraphQLError('No assigned tickets found.');
      }
      return tickets
    },
  },

  Mutation: {
    createTicket: async (parent, { input }: { input: CreateTicketInput }, { db, authData }) => {
      const newTicket = await db.ticket.create({
        data: {
          subject: input.subject,
          description: input.description,
          loan: { connect: { id: input.loanId } },
          device: { connect: { id: input.deviceId } },
          state: 'OPEN',
          ...(input.technicianId && { technician: { connect: { id: input.technicianId } } }),
        },
      });
      return newTicket;
    },
    closeTicket: async (parent, { input }: { input: CloseTicketInput }, { db, authData }) => {
      if (authData.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized to close tickets.');
      }
      const ticket = await db.ticket.findUnique({ where: { id: input.ticketId } });
      if (!ticket) {
        throw new GraphQLError('Ticket not found.');
      }
      const closedTicket = await db.ticket.update({
        where: { id: input.ticketId },
        data: {
          state: 'CLOSED',
        },
      });
      return closedTicket;
    },
    assignTicketToTechnician: async (parent, { ticketId, technicianId }: { ticketId: string, technicianId: string }, { db, authData }) => {
      if (authData.role !== 'ADMIN' && authData.role !== 'COORDINATOR') {
        throw new GraphQLError('Not authorized to assign technicians to tickets.');
      }
      const ticket = await db.ticket.findUnique({ where: { id: ticketId } });
      if (!ticket) {
        throw new GraphQLError('Ticket not found.');
      }
      const technician = await db.user.findUnique({ where: { id: technicianId } });
      if (!technician) {
        throw new GraphQLError('Technician not found.');
      }
      const assignedTicket = await db.ticket.update({
        where: { id: ticketId },
        data: {
          technician: { connect: { id: technicianId } },
        },
      });
      return assignedTicket;
    },
    updateTicketState: async (parent, { ticketId, state }: { ticketId: string, state: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' }, { db, authData }) => {
      // Check if user has permission to update ticket state
      if (!['ADMIN', 'COORDINATOR', 'TECHNICAL'].includes(authData.role)) {
        throw new GraphQLError('Not authorized to update ticket state.');
      }

      const ticket = await db.ticket.findUnique({ where: { id: ticketId } });
      if (!ticket) {
        throw new GraphQLError('Ticket not found.');
      }

      // If user is TECHNICAL, they can only update their own tickets
      if (authData.role === 'TECHNICAL') {
        const user = await db.user.findUnique({ where: { email: authData.email } });
        if (!user || ticket.technicianId !== user.id) {
          throw new GraphQLError('You can only update your own tickets.');
        }
      }

      const updatedTicket = await db.ticket.update({
        where: { id: ticketId },
        data: { state },
      });

      return updatedTicket;
    }
  },
};

export { ticketResolvers };

import gql from 'graphql-tag';

export const ticketTypes = gql`
  enum Enum_TicketState {
    OPEN
    IN_PROGRESS
    CLOSED
  }

  type Ticket {
    id: ID!
    subject: String!
    description: String!
    state: Enum_TicketState!
    createdAt: DateTime!
    updatedAt: DateTime!
    loan: Loan!
    device: Device!
    technician: User
  }

  input CreateTicketInput {
    technicianId: ID
    subject: String!
    description: String!
    loanId: ID!
    deviceId: ID!
  }

  input getUserAssignedTicketsInput {
    state: Enum_TicketState
  }

  input CloseTicketInput {
    ticketId: ID!
  }

  type Query {
    getTickets: [Ticket!]!
    getTicketById(id: ID!): Ticket!
    getTicketsByLoanId(loanId: ID!): [Ticket!]!
    getActiveTickets: [Ticket!]!
    getAssignedTicketsByUserId(userId: ID!): [Ticket!]!
    getUserAssignedTickets(input: getUserAssignedTicketsInput): [Ticket!]!
  }

  type Mutation {
    createTicket(input: CreateTicketInput!): Ticket!
    closeTicket(input: CloseTicketInput!): Ticket!
    assignTicketToTechnician(ticketId: ID!, technicianId: ID!): Ticket!
    updateTicketState(ticketId: ID!, state: Enum_TicketState!): Ticket!
  }
`;

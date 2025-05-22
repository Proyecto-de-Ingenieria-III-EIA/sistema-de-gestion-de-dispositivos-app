import gql from 'graphql-tag';

const loanTypes = gql`
  enum LoanStatus {
    PENDING
    APPROVED
    REJECTED
    EXTENDED
    FINISHED
  }

  enum Enum_ComponentType {
    RAM
    PROCESSOR
    GPU
    BOARD
    STORAGE
  }

  type Loan {
    id: ID!
    user: User!
    devices: [Device!]!
    startDate: DateTime!
    endDate: DateTime!
    status: LoanStatus!
    rejectionReason: String
    createdAt: DateTime!
    updatedAt: DateTime!
    originCity: City! 
    arrivalCity: City!       
    peripherals: [Peripheral!]!
  }
  
  input getLoansByUserEmailInput {
    userEmail: String!
  }

  input CreateLoanInput {
    userEmail: String!
    deviceIds: [String!]!
    peripheralsIds: [String!]!
    startDate: DateTime!
    endDate: DateTime!
    originCityId: String!   
    arrivalCityId: String! 
  }

  input UpdateLoanStatusInput {
    loanId: String!
    status: LoanStatus!
    rejectionReason: String
  }

  input ExtendLoanInput {
    loanId: String!
    newEndDate: DateTime!
  }

  input CreateTestUserInput {
    name: String!
    email: String!
    role: Enum_RoleName!
  }

  input CreateTestDeviceInput {
    serialNumber: String!
    brand: String!
    model: String!
    category: Enum_Category!
    price: Float!
    extraInfo: String
    components: [CreateTestComponentInput!]
  }

  input CreateTestComponentInput {
    brand: String!
    model: String!
    type: Enum_ComponentType!
    description: String!
  }

  input CreateTestPeripheralInput {
    serialNumber: String!
    model: String!
    type: Enum_PeripheralType!
    brand: String!
    price: Float!
    extraInfo: String
  }

  input CreateTestCityInput {
    name: String!
  }

  type Mutation {
    createLoan(input: CreateLoanInput!): Loan!
    updateLoanStatus(input: UpdateLoanStatusInput!): Loan!
    extendLoan(input: ExtendLoanInput!): Loan!
    createTestUser(input: CreateTestUserInput!): User!
    createTestDevice(input: CreateTestDeviceInput!): Device!
    createTestPeripheral(input: CreateTestPeripheralInput!): Peripheral!
    createTestCity(input: CreateTestCityInput!): City!
  }

  type Query {
    getLoans: [Loan!]!
    getLoanReminders: [Loan!]!
    getLoansByUserEmail(input: getLoansByUserEmailInput!): [Loan!]!
  }
`;

export { loanTypes };
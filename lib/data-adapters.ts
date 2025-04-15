import { LoanData, Loan, City } from "@/types/loans";

/**
 * Converts the legacy LoanData format to the new Loan format used by the GraphQL API
 */
export function adaptLoanDataToLoan(loanData: LoanData[]): Loan[] {
  return loanData.map(loan => ({
    id: loan.id,
    startDate: loan.startDate,
    endDate: loan.endDate,
    originCity: {
      name: loan.city
    },
    status: adaptLoanStatus(loan.status),
    devices: [] // Default empty devices array as this data is not in the legacy format
  }));
}

/**
 * Converts string array of city names to City[] objects
 */
export function adaptCityNames(cityNames: string[]): City[] {
  // Convert all city names to City objects (including "All Cities" for filtering)
  return cityNames.map(name => ({ name }));
}

/**
 * Maps legacy loan status to GraphQL API loan status format
 */
function adaptLoanStatus(status: string): "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" {
  switch (status.toLowerCase()) {
    case "active":
      return "APPROVED";
    case "pending":
      return "PENDING";
    case "rejected":
      return "REJECTED";
    case "completed":
      return "COMPLETED";
    default:
      return "PENDING";
  }
} 
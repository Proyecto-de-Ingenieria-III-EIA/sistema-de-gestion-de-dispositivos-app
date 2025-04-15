// Define interfaces for loan-related components

// Legacy interface - you may keep if needed for backward compatibility
export interface LoanData {
  id: string;
  startDate: string; // ISO string format
  endDate: string; // ISO string format
  city: string;
  amount: string;
  status: string;
}

export interface Device {
  brand: string;
  model: string;
  category: string;
  serialNumber: string;
}

export interface City {
  name: string;
}

export interface Loan {
  id: string;
  startDate: string;
  endDate: string;
  originCity: City;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  devices: Device[];
}

// Keep only these versions of the interfaces that match your GraphQL response
export interface LoanTableRowProps {
  loan: Loan;
  formatDate: (dateString: string) => string;
}

export interface LoansTableProps {
  loans: Loan[];
  formatDate: (dateString: string) => string;
}

export interface LoanFiltersProps {
  loanIdFilter: string;
  setLoanIdFilter: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  startDateFilter: Date | undefined;
  setStartDateFilter: (date: Date | undefined) => void;
  endDateFilter: Date | undefined;
  setEndDateFilter: (date: Date | undefined) => void;
  cities: City[];
  resetFilters: () => void;
  totalLoans: number;
  filteredCount: number;
}

export interface UseLoansFiltersReturn {
  loanIdFilter: string;
  setLoanIdFilter: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  startDateFilter: Date | undefined;
  setStartDateFilter: (date: Date | undefined) => void;
  endDateFilter: Date | undefined;
  setEndDateFilter: (date: Date | undefined) => void;
  resetFilters: () => void;
  filteredLoans: Loan[];
}

export interface ActiveLoansCardProps {
  loans: Loan[];
  filteredLoans: Loan[];
  loanIdFilter: string;
  setLoanIdFilter: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  startDateFilter: Date | undefined;
  setStartDateFilter: (date: Date | undefined) => void;
  endDateFilter: Date | undefined;
  setEndDateFilter: (date: Date | undefined) => void;
  cities: City[];
  resetFilters: () => void;
  formatDate: (dateString: string) => string;
} 
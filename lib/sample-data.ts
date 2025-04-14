import { LoanData } from "@/types/loans"

// Sample data for loans with string dates instead of Date objects
export const loansData: LoanData[] = [
  {
    id: "L-2023-001",
    startDate: "2023-01-15",
    endDate: "2024-01-15",
    city: "New York",
    amount: "$250,000",
    status: "Active",
  },
  {
    id: "L-2023-002",
    startDate: "2023-02-20",
    endDate: "2024-02-20",
    city: "Los Angeles",
    amount: "$175,000",
    status: "Active",
  },
  {
    id: "L-2023-003",
    startDate: "2023-03-10",
    endDate: "2024-03-10",
    city: "Chicago",
    amount: "$320,000",
    status: "Active",
  },
  {
    id: "L-2023-004",
    startDate: "2023-04-05",
    endDate: "2024-04-05",
    city: "Miami",
    amount: "$195,000",
    status: "Active",
  },
  {
    id: "L-2023-005",
    startDate: "2023-05-12",
    endDate: "2024-05-12",
    city: "Seattle",
    amount: "$280,000",
    status: "Active",
  },
  {
    id: "L-2023-006",
    startDate: "2023-06-18",
    endDate: "2024-06-18",
    city: "Boston",
    amount: "$210,000",
    status: "Active",
  },
  {
    id: "L-2023-007",
    startDate: "2023-07-22",
    endDate: "2024-07-22",
    city: "Denver",
    amount: "$225,000",
    status: "Active",
  },
  {
    id: "L-2023-008",
    startDate: "2023-08-30",
    endDate: "2024-08-30",
    city: "Austin",
    amount: "$190,000",
    status: "Active",
  },
]

// List of cities for the filter
export const cities = ["All Cities", "New York", "Los Angeles", "Chicago", "Miami", "Seattle", "Boston", "Denver", "Austin"] 
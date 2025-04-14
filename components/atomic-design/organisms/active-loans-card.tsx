"use client"

import { Download } from "lucide-react"
import { ActiveLoansCardProps } from "@/types/loans"
import { Button } from "../atoms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../molecules"
import { LoanFilters } from "../molecules/loan-filters"
import { LoansTable } from "./loans-table"

export const ActiveLoansCard = ({
  loans,
  filteredLoans,
  loanIdFilter,
  setLoanIdFilter,
  cityFilter,
  setCityFilter,
  startDateFilter,
  setStartDateFilter,
  endDateFilter,
  setEndDateFilter,
  cities,
  resetFilters,
  formatDate
}: ActiveLoansCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between space-y-2">
          <CardTitle>Active Loans</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <CardDescription>Manage and filter your active loans portfolio.</CardDescription>
      </CardHeader>

      <CardContent>
        <LoanFilters
          loanIdFilter={loanIdFilter}
          setLoanIdFilter={setLoanIdFilter}
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
          startDateFilter={startDateFilter}
          setStartDateFilter={setStartDateFilter}
          endDateFilter={endDateFilter}
          setEndDateFilter={setEndDateFilter}
          cities={cities}
          resetFilters={resetFilters}
          totalLoans={loans.length}
          filteredCount={filteredLoans.length}
        />
        
        <LoansTable 
          loans={filteredLoans} 
          formatDate={formatDate} 
        />
      </CardContent>
    </Card>
  )
} 
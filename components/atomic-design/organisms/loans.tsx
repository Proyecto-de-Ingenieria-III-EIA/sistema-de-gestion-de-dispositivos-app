"use client"

import { DashboardHeader } from "."
import { DashboardNav, Tabs, TabsContent, TabsList, TabsTrigger } from "../molecules"
import { ActiveLoansCard } from "./active-loans-card"
import { LoanRequestForm } from "./loan-request-form"
import { useLoansFilters } from "@/hooks/useLoansFilters"
import { formatDate } from "@/lib/date-utils"
import { loansData, cities } from "@/lib/sample-data"

export function Loans() {
  // Use the custom hook for filter state and filtered data
  const {
    loanIdFilter,
    setLoanIdFilter,
    cityFilter,
    setCityFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    resetFilters,
    filteredLoans,
  } = useLoansFilters(loansData)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav currentPath={"/loans"} />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Loans</h2>
          </div>

          <Tabs defaultValue="activeLoans" className="w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="activeLoans">Active Loans</TabsTrigger>
              <TabsTrigger value="requestLoan">Request Loan</TabsTrigger>
            </TabsList>
            <TabsContent value="activeLoans">
              <ActiveLoansCard
                loans={loansData}
                filteredLoans={filteredLoans}
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
                formatDate={(dateString) => formatDate(dateString)}
              />
            </TabsContent>
            <TabsContent value="requestLoan">
              <LoanRequestForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

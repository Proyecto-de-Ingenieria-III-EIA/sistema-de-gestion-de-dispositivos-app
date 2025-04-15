"use client"

import { DashboardHeader } from "."
import { DashboardNav, Tabs, TabsContent, TabsList, TabsTrigger } from "../molecules"
import { ActiveLoansCard } from "./active-loans-card"
import { LoanRequestForm } from "./loan-request-form"
import { formatDate } from "@/lib/date-utils"
import { useUserLoansFilters } from "@/hooks/useUserLoansFilters"
import { Spinner } from "../atoms/spinner"

export function Loans() {
  const {
    loans,
    filteredLoans,
    cities,
    loanIdFilter,
    setLoanIdFilter,
    cityFilter,
    setCityFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    resetFilters,
    isLoading,
    error
  } = useUserLoansFilters()

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
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Spinner size="lg" />
                </div>
              ) : error ? (
                <div className="p-6 text-center">
                  <p className="text-destructive font-medium">Error loading loans</p>
                  <p className="text-muted-foreground text-sm mt-2">{error.message}</p>
                </div>
              ) : (
                <ActiveLoansCard
                  loans={loans}
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
              )}
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

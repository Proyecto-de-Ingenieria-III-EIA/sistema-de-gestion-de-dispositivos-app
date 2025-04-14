"use client"

import { useState, useEffect } from "react"
import { parseISO } from "date-fns"
import { LoanData, UseLoansFiltersReturn } from "@/types/loans"

export function useLoansFilters(loansData: LoanData[]): UseLoansFiltersReturn {
  const [mounted, setMounted] = useState(false)
  const [loanIdFilter, setLoanIdFilter] = useState("")
  const [cityFilter, setCityFilter] = useState("All Cities")
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined)
  const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(undefined)

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Helper function to safely parse dates
  const parseDate = (dateString: string): Date => {
    try {
      return parseISO(dateString)
    } catch {
      return new Date(dateString)
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setLoanIdFilter("")
    setCityFilter("All Cities")
    setStartDateFilter(undefined)
    setEndDateFilter(undefined)
  }

  // Filter the loans based on the filter values
  const filteredLoans = loansData.filter((loan) => {
    // Filter by Loan ID
    if (loanIdFilter && !loan.id.toLowerCase().includes(loanIdFilter.toLowerCase())) {
      return false
    }

    // Filter by City
    if (cityFilter !== "All Cities" && loan.city !== cityFilter) {
      return false
    }

    // Filter by Start Date - only apply date filters on client side
    if (mounted && startDateFilter) {
      const loanStartDate = parseDate(loan.startDate)
      if (loanStartDate < startDateFilter) {
        return false
      }
    }

    // Filter by End Date - only apply date filters on client side
    if (mounted && endDateFilter) {
      const loanEndDate = parseDate(loan.endDate)
      if (loanEndDate > endDateFilter) {
        return false
      }
    }

    return true
  })

  return {
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
  }
} 
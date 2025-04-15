"use client"

import { useState, useEffect } from "react"
import { parseISO } from "date-fns"
import { Loan, City } from "@/types/loans"
import { useUserLoans } from "./useUserLoans"

export interface UseUserLoansFiltersReturn {
  loans: Loan[]
  filteredLoans: Loan[]
  cities: City[]
  loanIdFilter: string
  setLoanIdFilter: (value: string) => void
  cityFilter: string
  setCityFilter: (value: string) => void
  startDateFilter: Date | undefined
  setStartDateFilter: (date: Date | undefined) => void
  endDateFilter: Date | undefined
  setEndDateFilter: (date: Date | undefined) => void
  resetFilters: () => void
  isLoading: boolean
  error: Error | null
}

export function useUserLoansFilters(): UseUserLoansFiltersReturn {
  const { loans, isLoading, error } = useUserLoans()
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
  const filteredLoans = loans.filter((loan) => {
    // Filter by Loan ID
    if (loanIdFilter && !loan.id.toLowerCase().includes(loanIdFilter.toLowerCase())) {
      return false
    }

    // Filter by City
    if (cityFilter !== "All Cities" && loan.originCity.name !== cityFilter) {
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

  // Extract unique cities from loans
  const extractedCities: City[] = []
  
  if (loans.length > 0) {
    const cityNames = new Set<string>()
    
    loans.forEach(loan => {
      if (!cityNames.has(loan.originCity.name)) {
        cityNames.add(loan.originCity.name)
        extractedCities.push({ name: loan.originCity.name })
      }
    })
  }

  return {
    loans,
    filteredLoans,
    cities: extractedCities,
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
  }
} 
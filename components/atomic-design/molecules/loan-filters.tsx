"use client"

import { CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { LoanFiltersProps } from "@/types/loans"
import { Button, Input } from "../atoms"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger, 
  Calendar,
} from "../molecules"
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "../organisms"

export const LoanFilters = ({
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
  totalLoans,
  filteredCount
}: LoanFiltersProps) => {
  
  return (
    <>
      {/* Filters */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Loan ID</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID"
              className="pl-8"
              value={loanIdFilter}
              onChange={(e) => setLoanIdFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDateFilter && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDateFilter ? format(startDateFilter, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={startDateFilter} onSelect={setStartDateFilter} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDateFilter && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDateFilter ? format(endDateFilter, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={endDateFilter} onSelect={setEndDateFilter} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{filteredCount}</strong> of <strong>{totalLoans}</strong> loans
        </div>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </>
  )
} 
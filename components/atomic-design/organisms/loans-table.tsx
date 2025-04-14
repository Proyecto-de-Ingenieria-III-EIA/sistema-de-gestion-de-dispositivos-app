"use client"

import { LoansTableProps } from "@/types/loans"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "."
import { LoanTableRow } from "../molecules/loan-table-row"

export const LoansTable = ({ loans, formatDate }: LoansTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loan ID</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.length > 0 ? (
            loans.map((loan) => (
              <LoanTableRow 
                key={loan.id} 
                loan={loan} 
                formatDate={formatDate} 
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No loans found matching your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 
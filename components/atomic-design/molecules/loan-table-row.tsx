"use client"

import { LoanTableRowProps } from "@/types/loans"
import { TableCell, TableRow } from "../organisms"

export const LoanTableRow = ({ loan, formatDate }: LoanTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{loan.id}</TableCell>
      <TableCell>{formatDate(loan.startDate)}</TableCell>
      <TableCell>{formatDate(loan.endDate)}</TableCell>
      <TableCell>{loan.city}</TableCell>
      <TableCell>{loan.amount}</TableCell>
      <TableCell>
        <span 
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
            ${loan.status === "Active" 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
              : loan.status === "Pending"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
            }`}
        >
          {loan.status}
        </span>
      </TableCell>
    </TableRow>
  )
} 
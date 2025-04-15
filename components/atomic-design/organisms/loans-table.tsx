"use client"

import { LoansTableProps } from "@/types/loans"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "."
import { Badge } from "../atoms/badge"

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
            <TableHead>Status</TableHead>
            <TableHead>Devices</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.length > 0 ? (
            loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className="font-medium">{loan.id}</TableCell>
                <TableCell>{formatDate(loan.startDate)}</TableCell>
                <TableCell>{formatDate(loan.endDate)}</TableCell>
                <TableCell>{loan.originCity.name}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(loan.status)}>
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {loan.devices.length > 0 ? (
                    loan.devices.map((device) => (
                      <div key={device.serialNumber} className="mb-1">
                        {device.brand} {device.model} ({device.category})
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500">No devices</span>
                  )}
                </TableCell>
              </TableRow>
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

// Helper function for status badge styling
const getStatusVariant = (status: string) => {
  switch (status) {
    case "APPROVED": return "success";
    case "PENDING": return "warning";
    case "REJECTED": return "destructive";
    case "COMPLETED": return "default";
    default: return "secondary";
  }
}; 
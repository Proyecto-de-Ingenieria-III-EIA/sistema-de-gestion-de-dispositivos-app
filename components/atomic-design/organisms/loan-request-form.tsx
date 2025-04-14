"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../molecules"

export const LoanRequestForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request New Loan</CardTitle>
        <CardDescription>Fill out the form below to request a new device loan.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            Loan request form to be implemented. This will include fields for:
          </p>
          <ul className="list-disc pl-5">
            <li>Device type selection</li>
            <li>Date range selection</li>
            <li>Purpose of loan</li>
            <li>Additional requirements</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 
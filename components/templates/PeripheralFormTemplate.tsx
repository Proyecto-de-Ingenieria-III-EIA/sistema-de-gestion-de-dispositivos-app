"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PeripheralForm } from "@/components/atomic-design/organisms/PeripheralForm"

export function PeripheralFormTemplate() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Add Peripheral</CardTitle>
              <CardDescription>
                Enter the details of the peripheral device you want to add to the inventory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PeripheralForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

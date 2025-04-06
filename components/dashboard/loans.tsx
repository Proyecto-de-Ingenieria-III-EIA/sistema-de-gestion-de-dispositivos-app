import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Loans() {
    return (

        <main className="flex-1">
            <div className="flex min-h-screen flex-col">
                <DashboardHeader />
                <div className="flex flex-1">
                    <DashboardNav currentPath="/loans" />
                    <div className="flex-1 space-y-4 p-8 pt-6">
                        <div className="flex items-center justify-between space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">Loans</h2>
                        </div>
                        <Tabs defaultValue="activeLoans" className="w-[400px]">
                            <TabsList>
                                <TabsTrigger value="activeLoans">Active Loans</TabsTrigger>
                                <TabsTrigger value="password">Request Loan</TabsTrigger>
                            </TabsList>
                            <TabsContent value="activeLoans">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Loans Dashboard</CardTitle>
                                        <CardDescription>Manage your loan applications and approvals</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">
                                            This page is currently under development. Check back soon for loan management features.
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="password">Change your password here.</TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </main>
    )
}


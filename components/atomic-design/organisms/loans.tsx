"use client"
import { CalendarIcon, Download, Search } from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Calendar, Card, CardContent, CardDescription, CardHeader, CardTitle, DashboardNav, Popover, PopoverContent, PopoverTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from "../molecules"
import { Button, Input } from "../atoms"
import { Select, DashboardHeader, SelectTrigger, SelectValue, SelectContent, SelectItem, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "."

// Define the type for loan data
interface LoanData {
    id: string;
    startDate: string; // Store as ISO string to avoid hydration issues
    endDate: string; // Store as ISO string to avoid hydration issues
    city: string;
    amount: string;
    status: string;
}

// Sample data for loans with string dates instead of Date objects
const loansData: LoanData[] = [
    {
        id: "L-2023-001",
        startDate: "2023-01-15",
        endDate: "2024-01-15",
        city: "New York",
        amount: "$250,000",
        status: "Active",
    },
    {
        id: "L-2023-002",
        startDate: "2023-02-20",
        endDate: "2024-02-20",
        city: "Los Angeles",
        amount: "$175,000",
        status: "Active",
    },
    {
        id: "L-2023-003",
        startDate: "2023-03-10",
        endDate: "2024-03-10",
        city: "Chicago",
        amount: "$320,000",
        status: "Active",
    },
    {
        id: "L-2023-004",
        startDate: "2023-04-05",
        endDate: "2024-04-05",
        city: "Miami",
        amount: "$195,000",
        status: "Active",
    },
    {
        id: "L-2023-005",
        startDate: "2023-05-12",
        endDate: "2024-05-12",
        city: "Seattle",
        amount: "$280,000",
        status: "Active",
    },
    {
        id: "L-2023-006",
        startDate: "2023-06-18",
        endDate: "2024-06-18",
        city: "Boston",
        amount: "$210,000",
        status: "Active",
    },
    {
        id: "L-2023-007",
        startDate: "2023-07-22",
        endDate: "2024-07-22",
        city: "Denver",
        amount: "$225,000",
        status: "Active",
    },
    {
        id: "L-2023-008",
        startDate: "2023-08-30",
        endDate: "2024-08-30",
        city: "Austin",
        amount: "$190,000",
        status: "Active",
    },
]

// List of cities for the filter
const cities = ["All Cities", "New York", "Los Angeles", "Chicago", "Miami", "Seattle", "Boston", "Denver", "Austin"]

export function Loans() {
    const [mounted, setMounted] = useState(false);
    const [loanIdFilter, setLoanIdFilter] = useState("")
    const [cityFilter, setCityFilter] = useState("All Cities")
    const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined)
    const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(undefined)

    // Set mounted state after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    // Helper function to safely parse dates
    const parseDate = (dateString: string): Date => {
        try {
            return parseISO(dateString);
        } catch {
            return new Date(dateString);
        }
    };

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
            const loanStartDate = parseDate(loan.startDate);
            if (loanStartDate < startDateFilter) {
                return false;
            }
        }

        // Filter by End Date - only apply date filters on client side
        if (mounted && endDateFilter) {
            const loanEndDate = parseDate(loan.endDate);
            if (loanEndDate > endDateFilter) {
                return false;
            }
        }

        return true
    })

    const resetFilters = () => {
        setLoanIdFilter("")
        setCityFilter("All Cities")
        setStartDateFilter(undefined)
        setEndDateFilter(undefined)
    }

    // Helper function to safely format dates
    const formatDate = (dateString: string): string => {
        if (!mounted) return "Loading..."; // Avoid date formatting during SSR
        try {
            return format(parseDate(dateString), "MMM d, yyyy");
        } catch {
            return dateString;
        }
    };

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
                            <TabsTrigger value="password">Request Loan</TabsTrigger>
                        </TabsList>
                        <TabsContent value="activeLoans">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between space-y-2">
                                        <CardTitle>Active Loans</CardTitle>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline">
                                                <Download className="mr-2 h-4 w-4" />
                                                Export
                                            </Button>
                                        </div>
                                    </div>
                                    <CardDescription>Manage and filter your active loans portfolio.</CardDescription>
                                </CardHeader>

                                <CardContent>
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
                                                        {mounted && startDateFilter ? format(startDateFilter, "PPP") : "Pick a date"}
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
                                                        {mounted && endDateFilter ? format(endDateFilter, "PPP") : "Pick a date"}
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
                                            Showing <strong>{filteredLoans.length}</strong> of <strong>{loansData.length}</strong> loans
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                                            Reset Filters
                                        </Button>
                                    </div>

                                    {/* Loans Table */}
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
                                                {filteredLoans.length > 0 ? (
                                                    filteredLoans.map((loan) => (
                                                        <TableRow key={loan.id}>
                                                            <TableCell className="font-medium">{loan.id}</TableCell>
                                                            <TableCell>{formatDate(loan.startDate)}</TableCell>
                                                            <TableCell>{formatDate(loan.endDate)}</TableCell>
                                                            <TableCell>{loan.city}</TableCell>
                                                            <TableCell>{loan.amount}</TableCell>
                                                            <TableCell>
                                                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                                                                    {loan.status}
                                                                </span>
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
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="password">
                            Add the loan request form here.
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

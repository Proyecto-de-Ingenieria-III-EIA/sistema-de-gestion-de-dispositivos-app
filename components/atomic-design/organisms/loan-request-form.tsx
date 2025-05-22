"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  Calendar, 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "../molecules"
import { 
  Button, 
  Input
} from "../atoms"
import { cn } from "@/lib/utils"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "."
import { graphqlRequest } from "@/lib/graphql-client"

// Define the form schema with Zod
const formSchema = z.object({
  deviceIds: z.array(z.string()).min(1, { message: "Select at least one device" }),
  peripheralsIds: z.array(z.string()).optional(),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  originCityId: z.string({
    required_error: "Origin city is required",
  }),
  arrivalCityId: z.string({
    required_error: "Arrival city is required",
  }),
  userEmail: z.string().email({ message: "Invalid email address" }),
})
.refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.endDate > data.startDate;
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
)
.refine(
  (data) => {
    return data.startDate >= new Date();
  },
  {
    message: "Start date must be in the future",
    path: ["startDate"],
  }
);

// Define types for the form inputs
type FormValues = z.infer<typeof formSchema>;

// Types for data fetching
interface Device {
  id: string;
  serialNumber: string;
  brand: string;
  model: string;
}

interface Peripheral {
  id: string;
  serialNumber: string;
  type: string;
  model: string;
  brand: string;
}

interface City {
  id: string;
  name: string;
}

export const LoanRequestForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [peripherals, setPeripherals] = useState<Peripheral[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deviceIds: [],
      peripheralsIds: [],
      userEmail: "",
    },
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch devices
        const devicesResponse = await graphqlRequest<{ getDevices: Device[] }>({
          query: `
            query GetDevices {
              getDevices {
                id
                serialNumber
                brand
                model
              }
            }
          `,
        });
        
        if (devicesResponse.data) {
          setDevices(devicesResponse.data.getDevices);
        }

        // Fetch peripherals
        const peripheralsResponse = await graphqlRequest<{ getPeripherals: Peripheral[] }>({
          query: `
            query GetPeripherals {
              getPeripherals {
                id
                serialNumber
                type
                model
                brand
              }
            }
          `,
        });
        
        if (peripheralsResponse.data) {
          setPeripherals(peripheralsResponse.data.getPeripherals);
        }

        // Fetch cities
        const citiesResponse = await graphqlRequest<{ getCities: City[] }>({
          query: `
            query GetCities {
              getCities {
                id
                name
              }
            }
          `,
        });
        
        if (citiesResponse.data) {
          setCities(citiesResponse.data.getCities);
        }
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError("Failed to load form data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await graphqlRequest({
        query: `
          mutation CreateLoan($input: CreateLoanInput!) {
            createLoan(input: $input) {
              id
              status
            }
          }
        `,
        variables: {
          input: {
            userEmail: data.userEmail,
            deviceIds: data.deviceIds,
            peripheralsIds: data.peripheralsIds || [],
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
            originCityId: data.originCityId,
            arrivalCityId: data.arrivalCityId,
          },
        },
      });

      if (response.errors) {
        throw new Error(response.errors[0]?.message || "Failed to create loan");
      }

      setIsSuccess(true);
      form.reset();
    } catch (err) {
      console.error("Error submitting loan request:", err);
      setError(
        err instanceof Error ? err.message : "Failed to submit loan request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request New Loan</CardTitle>
        <CardDescription>Fill out the form below to request a new device loan.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-destructive">
            <p>{error}</p>
          </div>
        )}

        {isSuccess && (
          <div className="mb-4 rounded-md bg-green-100 p-3 text-green-800">
            <p>Your loan request has been submitted successfully!</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* User Email */}
            <FormField
              control={form.control}
              name="userEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the email address for this loan request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Device Selection */}
            <FormField
              control={form.control}
              name="deviceIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Devices</FormLabel>
                  <div className="space-y-2">
                    {devices.map((device) => (
                      <div key={device.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`device-${device.id}`}
                          checked={field.value.includes(device.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, device.id]);
                            } else {
                              field.onChange(field.value.filter((id) => id !== device.id));
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor={`device-${device.id}`} className="text-sm">
                          {device.brand} {device.model} ({device.serialNumber})
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormDescription>
                    Select the devices you want to request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Peripherals Selection */}
            <FormField
              control={form.control}
              name="peripheralsIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peripherals (Optional)</FormLabel>
                  <div className="space-y-2">
                    {peripherals.map((peripheral) => (
                      <div key={peripheral.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`peripheral-${peripheral.id}`}
                          checked={field.value?.includes(peripheral.id) || false}
                          onChange={(e) => {
                            const currentValues = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...currentValues, peripheral.id]);
                            } else {
                              field.onChange(
                                currentValues.filter((id) => id !== peripheral.id)
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor={`peripheral-${peripheral.id}`} className="text-sm">
                          {peripheral.type}: {peripheral.brand} {peripheral.model} ({peripheral.serialNumber})
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormDescription>
                    Select any peripherals you want to include with your loan request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the date when you need to start the loan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => 
                          date < new Date() || 
                          (form.getValues().startDate && date < form.getValues().startDate)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the date when you will return the borrowed items.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Origin City */}
            <FormField
              control={form.control}
              name="originCityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origin City</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the city where the devices will be shipped from.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Arrival City */}
            <FormField
              control={form.control}
              name="arrivalCityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival City</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select arrival city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the city where the devices will be delivered.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Request
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 
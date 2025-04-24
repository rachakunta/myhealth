// MainLayout removed as we're using DashboardLayout from App.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { CalendarIcon, Info, MapPin, Search } from "lucide-react";
import { format } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const labTestFormSchema = z.object({
  testType: z.string().min(1, "Please select a test type"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
  location: z.string().min(1, "Please select a location"),
  notes: z.string().optional(),
});

type LabTestFormValues = z.infer<typeof labTestFormSchema>;

const testTypes = [
  { name: "Complete Blood Count (CBC)", price: "$45", description: "Measures different components of the blood, including red and white blood cells, hemoglobin, and platelets" },
  { name: "Comprehensive Metabolic Panel", price: "$65", description: "Assesses kidney and liver function, electrolyte balance, and blood sugar levels" },
  { name: "Lipid Panel", price: "$40", description: "Measures cholesterol levels to assess heart health and risk of heart disease" },
  { name: "Hemoglobin A1C", price: "$35", description: "Measures average blood sugar levels over the past 2-3 months to screen for or monitor diabetes" },
  { name: "Thyroid Function Tests", price: "$55", description: "Evaluates how well the thyroid is functioning by measuring hormone levels" },
  { name: "Vitamin D Test", price: "$50", description: "Measures vitamin D levels to identify deficiencies that can affect bone health" }
];

const locations = [
  { id: 1, name: "MyHealth360 Main Lab", address: "123 Medical Parkway, Suite 200", distance: "1.2" },
  { id: 2, name: "East Side Diagnostics", address: "456 Health Avenue", distance: "3.5" },
  { id: 3, name: "Central Medical Labs", address: "789 Wellness Boulevard", distance: "4.8" }
];

const previousTests = [
  { 
    id: 1, 
    name: "Complete Blood Count", 
    date: "2023-10-15", 
    status: "completed", 
    resultStatus: "normal",
    results: {
      "White Blood Cells": { value: "7.5", unit: "K/uL", range: "4.5-11.0", status: "normal" },
      "Red Blood Cells": { value: "5.1", unit: "M/uL", range: "4.5-5.9", status: "normal" },
      "Hemoglobin": { value: "14.2", unit: "g/dL", range: "13.5-17.5", status: "normal" },
      "Hematocrit": { value: "42", unit: "%", range: "41-50", status: "normal" },
      "Platelets": { value: "250", unit: "K/uL", range: "150-450", status: "normal" }
    }
  },
  { 
    id: 2, 
    name: "Lipid Panel", 
    date: "2023-09-30", 
    status: "completed", 
    resultStatus: "review",
    results: {
      "Total Cholesterol": { value: "210", unit: "mg/dL", range: "<200", status: "high" },
      "LDL Cholesterol": { value: "130", unit: "mg/dL", range: "<100", status: "high" },
      "HDL Cholesterol": { value: "45", unit: "mg/dL", range: ">40", status: "normal" },
      "Triglycerides": { value: "150", unit: "mg/dL", range: "<150", status: "borderline" }
    }
  }
];

export default function DiagnosePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [selectedTestResult, setSelectedTestResult] = useState<number | null>(null);
  const { toast } = useToast();
  
  const form = useForm<LabTestFormValues>({
    resolver: zodResolver(labTestFormSchema),
    defaultValues: {
      testType: "",
      location: "",
      notes: ""
    }
  });

  const onSubmit = (values: LabTestFormValues) => {
    toast({
      title: "Lab Test Booked",
      description: `Your ${values.testType} has been scheduled for ${format(values.date, "MMMM do")} at ${values.time}`,
    });
    form.reset();
    setSelectedTest(null);
  };
  
  const filteredTests = testTypes.filter(test => 
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-success bg-opacity-10 text-success";
      case "high":
        return "bg-danger bg-opacity-10 text-danger";
      case "low":
        return "bg-warning bg-opacity-10 text-warning";
      case "borderline":
        return "bg-warning bg-opacity-10 text-warning";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  return (
    <>
      <div className="pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
          Diagnose
        </h1>
        <p className="text-neutral-700 mt-1">Book diagnostic tests and view your lab results</p>
      </div>

      <Tabs defaultValue="book-test" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="book-test">Book a Test</TabsTrigger>
          <TabsTrigger value="results">Your Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="book-test" className="mt-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
              <Input 
                placeholder="Search for tests..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map(test => (
              <Card key={test.name} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      <Badge variant="outline" className="mt-2">{test.price}</Badge>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-info bg-opacity-20">
                      <i className="fas fa-flask text-info"></i>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-neutral-700">{test.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end">
                  <Button onClick={() => setSelectedTest(test.name)}>
                    Book Test
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredTests.length === 0 && (
              <div className="col-span-full py-8 text-center">
                <i className="fas fa-search text-neutral-400 text-4xl mb-4"></i>
                <h3 className="text-lg font-medium">No tests found</h3>
                <p className="text-neutral-500">Try adjusting your search or browse all tests</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previousTests.map(test => (
              <Card key={test.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      <CardDescription>
                        {format(new Date(test.date), "MMMM d, yyyy")}
                      </CardDescription>
                    </div>
                    <Badge 
                      className={`${
                        test.resultStatus === "normal" 
                          ? "bg-success bg-opacity-10 text-success" 
                          : test.resultStatus === "review" 
                          ? "bg-warning bg-opacity-10 text-warning" 
                          : "bg-danger bg-opacity-10 text-danger"
                      }`}
                    >
                      {test.resultStatus === "normal" ? "Normal" : test.resultStatus === "review" ? "Review" : "Abnormal"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-sm text-neutral-700">
                    <p>Click "View Details" to see your complete test results.</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button variant="ghost" className="text-neutral-700">
                    <i className="fas fa-download mr-2"></i> Download
                  </Button>
                  <Button onClick={() => setSelectedTestResult(test.id)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {previousTests.length === 0 && (
              <div className="col-span-full py-8 text-center">
                <i className="fas fa-file-medical-alt text-neutral-400 text-4xl mb-4"></i>
                <h3 className="text-lg font-medium">No test results found</h3>
                <p className="text-neutral-500">Book a test to see your results here</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedTest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Book {selectedTest}</CardTitle>
              <CardDescription>Schedule your lab test appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="testType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Type</FormLabel>
                        <FormControl>
                          <Input disabled value={selectedTest || ""} onChange={() => {}} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
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
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                              <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                              <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                              <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                              <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                              <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                              <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                              <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map(location => (
                              <SelectItem key={location.id} value={location.name}>
                                <div className="flex items-center">
                                  <span>{location.name}</span>
                                  <span className="ml-2 text-neutral-500 text-xs">({location.distance} miles)</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Any special notes for the lab" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedTest(null)}>
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)}>
                Confirm Booking
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {selectedTestResult !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => setSelectedTestResult(null)}
              >
                <i className="fas fa-times"></i>
              </Button>
              <CardTitle>{previousTests.find(t => t.id === selectedTestResult)?.name} Results</CardTitle>
              <CardDescription>
                Test Date: {format(new Date(previousTests.find(t => t.id === selectedTestResult)?.date || ""), "MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Badge 
                    className={`mr-2 ${
                      previousTests.find(t => t.id === selectedTestResult)?.resultStatus === "normal" 
                        ? "bg-success bg-opacity-10 text-success" 
                        : previousTests.find(t => t.id === selectedTestResult)?.resultStatus === "review" 
                        ? "bg-warning bg-opacity-10 text-warning" 
                        : "bg-danger bg-opacity-10 text-danger"
                    }`}
                  >
                    {previousTests.find(t => t.id === selectedTestResult)?.resultStatus === "normal" ? "Normal" : previousTests.find(t => t.id === selectedTestResult)?.resultStatus === "review" ? "Review" : "Abnormal"}
                  </Badge>
                  
                  {previousTests.find(t => t.id === selectedTestResult)?.resultStatus !== "normal" && (
                    <div className="text-sm text-neutral-700 flex items-center ml-2">
                      <Info size={14} className="mr-1" />
                      <span>Some results require attention</span>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Test</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Result</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Units</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Reference Range</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {previousTests.find(t => t.id === selectedTestResult)?.results && 
                       Object.entries(previousTests.find(t => t.id === selectedTestResult)?.results || {}).map(([name, data]) => (
                        <tr key={name} className="hover:bg-neutral-50">
                          <td className="px-4 py-3 text-sm text-neutral-900 font-medium">{name}</td>
                          <td className="px-4 py-3 text-sm text-neutral-900">{data.value}</td>
                          <td className="px-4 py-3 text-sm text-neutral-700">{data.unit}</td>
                          <td className="px-4 py-3 text-sm text-neutral-700">{data.range}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge className={getStatusBadgeClasses(data.status)}>
                              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Lab Notes</h4>
                  <p className="text-sm text-neutral-700">
                    {previousTests.find(t => t.id === selectedTestResult)?.resultStatus === "review" 
                      ? "Some results are outside the reference range. It is recommended to discuss these results with your healthcare provider."
                      : "All results are within normal limits. Continue with your regular health maintenance."}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <i className="fas fa-download mr-2"></i> Download PDF
              </Button>
              <Button>
                <i className="fas fa-share-alt mr-2"></i> Share with Doctor
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}

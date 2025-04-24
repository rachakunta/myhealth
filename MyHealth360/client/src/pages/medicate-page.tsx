// MainLayout removed as we're using DashboardLayout from App.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Medication } from "@shared/schema";

const orderFormSchema = z.object({
  medication: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  refills: z.number().min(0, "Refills must be 0 or more"),
  deliveryAddress: z.string().min(10, "Please enter a valid address"),
  deliverySpeed: z.string().min(1, "Please select a delivery option"),
  autoRefill: z.boolean().default(false),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

// Sample medications data
const availableMedications = [
  {
    id: 1,
    name: "Lisinopril",
    category: "Prescription",
    description: "Used to treat high blood pressure and heart failure",
    dosages: ["5mg", "10mg", "20mg"],
    price: "$12.99",
    popular: true
  },
  {
    id: 2,
    name: "Metformin",
    category: "Prescription",
    description: "Used to treat type 2 diabetes",
    dosages: ["500mg", "850mg", "1000mg"],
    price: "$9.99",
    popular: true
  },
  {
    id: 3,
    name: "Atorvastatin",
    category: "Prescription",
    description: "Used to lower cholesterol and reduce risk of heart attack and stroke",
    dosages: ["10mg", "20mg", "40mg", "80mg"],
    price: "$15.99",
    popular: true
  },
  {
    id: 4,
    name: "Vitamin D3",
    category: "Over-the-counter",
    description: "Supports bone health, immune function, and mood regulation",
    dosages: ["1000 IU", "2000 IU", "5000 IU"],
    price: "$8.99",
    popular: false
  },
  {
    id: 5,
    name: "Ibuprofen",
    category: "Over-the-counter",
    description: "Pain reliever and anti-inflammatory medication",
    dosages: ["200mg", "400mg", "600mg"],
    price: "$6.99",
    popular: false
  }
];

export default function MedicatePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedication, setSelectedMedication] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState("active");
  const { toast } = useToast();
  
  const { data: medications } = useQuery<Medication[]>({
    queryKey: ["/api/medications"],
  });
  
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      medication: "",
      dosage: "",
      quantity: 30,
      refills: 0,
      deliveryAddress: "",
      deliverySpeed: "",
      autoRefill: false
    }
  });

  const onSubmit = (values: OrderFormValues) => {
    toast({
      title: "Order Placed Successfully",
      description: `Your order for ${values.medication} ${values.dosage} will be delivered in ${values.deliverySpeed === "standard" ? "3-5" : "1-2"} business days.`,
    });
    form.reset();
    setSelectedMedication(null);
  };
  
  const filteredMedications = availableMedications.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMedications = medications?.filter(med => med.status === "taken" || med.status === "pending") || [];
  const pastMedications = medications?.filter(med => med.status === "completed") || [];

  return (
    <>
      <div className="pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
          Medicate
        </h1>
        <p className="text-neutral-700 mt-1">Order medications and manage your prescriptions</p>
      </div>

      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="grid w-full md:w-[500px] grid-cols-3">
          <TabsTrigger value="medications">Your Medications</TabsTrigger>
          <TabsTrigger value="order">Order Medicines</TabsTrigger>
          <TabsTrigger value="tracking">Track Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="medications" className="mt-6">
          <div className="mb-4">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="active">Active Medications</TabsTrigger>
                <TabsTrigger value="past">Past Medications</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {selectedTab === "active" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeMedications.length > 0 ? (
                activeMedications.map((medication) => (
                  <Card key={medication.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{medication.name}</CardTitle>
                          <CardDescription>{medication.dosage}, {medication.frequency}</CardDescription>
                        </div>
                        <Badge 
                          className={medication.status === "taken" 
                            ? "bg-success bg-opacity-10 text-success" 
                            : "bg-warning bg-opacity-10 text-warning"}
                        >
                          {medication.status === "taken" ? "Taken" : "Pending"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-700">Next Dose:</span>
                          <span className="font-medium">Today, {medication.timeOfDay}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-700">Remaining:</span>
                          <span className="font-medium">{medication.remainingDays} days</span>
                        </div>
                        <Separator />
                        <div className="pt-2">
                          <div className="flex items-center space-x-2">
                            <Switch id={`remind-${medication.id}`} />
                            <label
                              htmlFor={`remind-${medication.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Set reminder
                            </label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      {medication.status === "pending" ? (
                        <Button>Mark as Taken</Button>
                      ) : (
                        <Button variant="outline">View Details</Button>
                      )}
                      {medication.remainingDays <= 7 && (
                        <Button>Refill Now</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-8 text-center">
                  <i className="fas fa-pills text-neutral-400 text-4xl mb-4"></i>
                  <h3 className="text-lg font-medium">No active medications</h3>
                  <p className="text-neutral-500">You don't have any active medications at the moment</p>
                </div>
              )}
            </div>
          )}
          
          {selectedTab === "past" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastMedications.length > 0 ? (
                pastMedications.map((medication) => (
                  <Card key={medication.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{medication.name}</CardTitle>
                          <CardDescription>{medication.dosage}, {medication.frequency}</CardDescription>
                        </div>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-700">Taken For:</span>
                          <span className="font-medium">30 days</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-700">Completed On:</span>
                          <span className="font-medium">October 15, 2023</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Button variant="outline">View Details</Button>
                      <Button>Refill Again</Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-8 text-center">
                  <i className="fas fa-history text-neutral-400 text-4xl mb-4"></i>
                  <h3 className="text-lg font-medium">No past medications</h3>
                  <p className="text-neutral-500">You don't have any medication history yet</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="order" className="mt-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
              <Input 
                placeholder="Search medications by name or condition..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-4">Popular Medications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedications
                .filter(med => med.popular)
                .map(medication => (
                <Card key={medication.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{medication.name}</CardTitle>
                        <Badge variant="outline" className="mt-2">{medication.category}</Badge>
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-light bg-opacity-20">
                        <i className="fas fa-pills text-accent"></i>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-neutral-700">{medication.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-neutral-700">Available as: </span>
                        <span className="font-medium">{medication.dosages.join(", ")}</span>
                      </div>
                      <Badge>{medication.price}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-end">
                    <Button onClick={() => setSelectedMedication(medication.id)}>
                      Order Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">All Medications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedications
                .filter(med => !med.popular || searchTerm.length > 0)
                .map(medication => (
                <Card key={medication.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{medication.name}</CardTitle>
                        <Badge variant="outline" className="mt-2">{medication.category}</Badge>
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-light bg-opacity-20">
                        <i className="fas fa-pills text-accent"></i>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-neutral-700">{medication.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-neutral-700">Available as: </span>
                        <span className="font-medium">{medication.dosages.join(", ")}</span>
                      </div>
                      <Badge>{medication.price}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-end">
                    <Button onClick={() => setSelectedMedication(medication.id)}>
                      Order Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {filteredMedications.length === 0 && (
                <div className="col-span-full py-8 text-center">
                  <i className="fas fa-search text-neutral-400 text-4xl mb-4"></i>
                  <h3 className="text-lg font-medium">No medications found</h3>
                  <p className="text-neutral-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tracking" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
              <CardDescription>Track your medication orders and deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Order #INH-3849</h3>
                      <p className="text-sm text-neutral-700">Placed on October 20, 2023</p>
                    </div>
                    <Badge className="bg-success bg-opacity-10 text-success">Out for Delivery</Badge>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-accent-light bg-opacity-20 flex items-center justify-center mr-3">
                        <i className="fas fa-pills text-accent"></i>
                      </div>
                      <div>
                        <p className="font-medium">Lisinopril 10mg</p>
                        <p className="text-sm text-neutral-700">30 tablets, 1 refill</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-primary">
                            Arriving Today by 8:00 PM
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-neutral-200">
                        <div style={{ width: "75%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                          <i className="fas fa-check text-xs"></i>
                        </div>
                        <div className="ml-2">
                          <p className="font-medium text-sm">Order Placed</p>
                          <p className="text-xs text-neutral-700">October 20, 2023 at 3:45 PM</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                          <i className="fas fa-check text-xs"></i>
                        </div>
                        <div className="ml-2">
                          <p className="font-medium text-sm">Order Processed</p>
                          <p className="text-xs text-neutral-700">October 20, 2023 at 4:30 PM</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                          <i className="fas fa-check text-xs"></i>
                        </div>
                        <div className="ml-2">
                          <p className="font-medium text-sm">Out for Delivery</p>
                          <p className="text-xs text-neutral-700">October 21, 2023 at 9:10 AM</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center opacity-50">
                        <div className="w-6 h-6 rounded-full bg-neutral-300 flex items-center justify-center text-white">
                          <i className="fas fa-check text-xs"></i>
                        </div>
                        <div className="ml-2">
                          <p className="font-medium text-sm">Delivered</p>
                          <p className="text-xs text-neutral-700">Estimated: October 21, 2023 by 8:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Order #INH-3752</h3>
                      <p className="text-sm text-neutral-700">Placed on October 10, 2023</p>
                    </div>
                    <Badge className="bg-success bg-opacity-10 text-success">Delivered</Badge>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-accent-light bg-opacity-20 flex items-center justify-center mr-3">
                        <i className="fas fa-pills text-accent"></i>
                      </div>
                      <div>
                        <p className="font-medium">Vitamin D3 2000 IU</p>
                        <p className="text-sm text-neutral-700">60 tablets, 0 refills</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedMedication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Order {availableMedications.find(m => m.id === selectedMedication)?.name}</CardTitle>
              <CardDescription>{availableMedications.find(m => m.id === selectedMedication)?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="medication"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medication</FormLabel>
                        <FormControl>
                          <Input 
                            value={availableMedications.find(m => m.id === selectedMedication)?.name} 
                            readOnly 
                            {...field}
                            onChange={() => {
                              field.onChange(availableMedications.find(m => m.id === selectedMedication)?.name);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dosage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosage</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select dosage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableMedications.find(m => m.id === selectedMedication)?.dosages.map(dosage => (
                              <SelectItem key={dosage} value={dosage}>
                                {dosage}
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
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity (pills/tablets)</FormLabel>
                        <FormControl>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">1</span>
                              <span className="font-medium">{field.value}</span>
                              <span className="text-sm">90</span>
                            </div>
                            <Slider
                              defaultValue={[field.value]}
                              max={90}
                              min={1}
                              step={10}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="refills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Refills</FormLabel>
                        <FormControl>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">0</span>
                              <span className="font-medium">{field.value}</span>
                              <span className="text-sm">3</span>
                            </div>
                            <Slider
                              defaultValue={[field.value]}
                              max={3}
                              min={0}
                              step={1}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, City, State, ZIP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deliverySpeed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Option</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select delivery option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard (3-5 business days) - Free</SelectItem>
                            <SelectItem value="express">Express (1-2 business days) - $5.99</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="autoRefill"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Automatic Refills</FormLabel>
                          <FormDescription>
                            Enable automatic refills when your medication is running low
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedMedication(null)}>
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)}>
                Place Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}

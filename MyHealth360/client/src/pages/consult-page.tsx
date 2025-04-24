// MainLayout removed as we're using DashboardLayout from App.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const appointmentFormSchema = z.object({
  specialty: z.string().min(1, "Please select a specialty"),
  reason: z.string().min(5, "Please describe your reason for the appointment"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
  type: z.string().min(1, "Please select appointment type"),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

const doctors = [
  {
    id: 1,
    name: "Dr. Michael Roberts",
    specialty: "Cardiologist",
    image: "/img/doctor1.jpg",
    rating: 4.9,
    reviewCount: 124,
    nextAvailable: "Today, 4:30 PM",
    experience: "15 years",
    bio: "Dr. Roberts is a board-certified cardiologist with expertise in preventive cardiology and heart failure management.",
  },
  {
    id: 2,
    name: "Dr. Jennifer Lee",
    specialty: "Therapist",
    image: "/img/doctor2.jpg",
    rating: 4.8,
    reviewCount: 98,
    nextAvailable: "Tomorrow, 10:00 AM",
    experience: "12 years",
    bio: "Dr. Lee specializes in cognitive behavioral therapy, anxiety disorders, and stress management techniques.",
  },
  {
    id: 3,
    name: "Dr. James Wilson",
    specialty: "Dermatologist",
    image: "/img/doctor3.jpg",
    rating: 4.7,
    reviewCount: 87,
    nextAvailable: "Wednesday, 1:15 PM",
    experience: "9 years",
    bio: "Dr. Wilson provides comprehensive care for skin conditions, cosmetic dermatology, and skin cancer screenings.",
  },
  {
    id: 4,
    name: "Dr. Samantha Chen",
    specialty: "Nutritionist",
    image: "/img/doctor4.jpg",
    rating: 4.9,
    reviewCount: 112,
    nextAvailable: "Thursday, 11:30 AM",
    experience: "8 years",
    bio: "Dr. Chen specializes in personalized nutrition plans, metabolic disorders, and weight management strategies.",
  }
];

const specialties = [
  "Cardiologist",
  "Dermatologist",
  "General Practitioner",
  "Neurologist",
  "Nutritionist",
  "Pediatrician",
  "Psychiatrist",
  "Therapist"
];

const appointmentTypes = [
  "Video Consultation",
  "Text Chat",
  "In-Person Visit"
];

export default function ConsultPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const { toast } = useToast();
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      specialty: "",
      reason: "",
      type: ""
    }
  });

  const onSubmit = (values: AppointmentFormValues) => {
    toast({
      title: "Appointment Booked",
      description: `Your appointment has been scheduled for ${format(values.date, "MMMM do")} at ${values.time}`,
    });
    form.reset();
    setSelectedDoctor(null);
  };
  
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
          Book a Consultation
        </h1>
        <p className="text-neutral-700 mt-1">Connect with healthcare professionals for your needs</p>
      </div>

      <Tabs defaultValue="find-doctor" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="find-doctor">Find a Doctor</TabsTrigger>
          <TabsTrigger value="book-appointment">Book Appointment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="find-doctor" className="mt-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
              <Input 
                placeholder="Search by name, specialty, or condition..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-light bg-opacity-20">
                      <i className="fas fa-user-md text-primary text-2xl"></i>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <CardDescription>{doctor.specialty}</CardDescription>
                      <div className="flex items-center mt-1 text-sm">
                        <i className="fas fa-star text-yellow-400 mr-1"></i>
                        <span className="font-medium mr-1">{doctor.rating}</span>
                        <span className="text-neutral-500">({doctor.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-sm text-neutral-700 space-y-2">
                    <div className="flex items-center">
                      <i className="fas fa-calendar-alt w-5 text-neutral-500 mr-2"></i>
                      <span>Next available: {doctor.nextAvailable}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-clock w-5 text-neutral-500 mr-2"></i>
                      <span>Experience: {doctor.experience}</span>
                    </div>
                    <p className="mt-3">{doctor.bio}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end">
                  <Button onClick={() => setSelectedDoctor(doctor.id)}>
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredDoctors.length === 0 && (
              <div className="col-span-full py-8 text-center">
                <i className="fas fa-search text-neutral-400 text-4xl mb-4"></i>
                <h3 className="text-lg font-medium">No doctors found</h3>
                <p className="text-neutral-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="book-appointment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule an Appointment</CardTitle>
              <CardDescription>Fill in the details to book your consultation</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Specialty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {specialties.map(specialty => (
                              <SelectItem key={specialty} value={specialty}>
                                {specialty}
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
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Visit</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe your symptoms or reason for consultation" 
                            className="resize-none" 
                            {...field} 
                          />
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
                          <FormLabel>Preferred Date</FormLabel>
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
                          <FormLabel>Preferred Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                              <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                              <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                              <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                              <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                              <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                              <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                              <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                              <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appointment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select appointment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {appointmentTypes.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    Schedule Appointment
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedDoctor !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Book Appointment with {doctors.find(d => d.id === selectedDoctor)?.name}</CardTitle>
              <CardDescription>{doctors.find(d => d.id === selectedDoctor)?.specialty}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Visit</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe your symptoms or reason for consultation" 
                            className="resize-none" 
                            {...field} 
                          />
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
                              <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                              <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                              <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                              <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                              <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                              <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                              <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                              <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                              <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appointment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {appointmentTypes.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedDoctor(null)}>
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)}>
                Confirm Booking
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}

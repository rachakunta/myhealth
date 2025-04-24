import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LabTest {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  preparationNeeded: boolean;
  preparationInstructions?: string;
  homeCollection: boolean;
}

interface LabTestBookingFormProps {
  test: LabTest;
  onSuccess: () => void;
}

// Time slots for lab tests
const TIME_SLOTS = [
  "07:00 AM - 08:00 AM", "08:00 AM - 09:00 AM", "09:00 AM - 10:00 AM", 
  "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM", 
  "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM"
];

// Form schema
const formSchema = z.object({
  collectionType: z.enum(["home", "center"], {
    required_error: "Please select a collection type",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  patientName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  patientAge: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Please enter a valid age",
  }),
  patientGender: z.enum(["male", "female", "other"], {
    required_error: "Please select gender",
  }),
  address: z.string().optional(),
  city: z.string().optional(),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const LabTestBookingForm = ({ test, onSuccess }: LabTestBookingFormProps) => {
  const { toast } = useToast();
  const [collectionType, setCollectionType] = useState<"home" | "center">("home");
  
  // Default form values
  const defaultValues: Partial<FormValues> = {
    collectionType: "home",
    patientName: "",
    patientAge: "",
    patientGender: "male",
    acceptedTerms: false,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Watch collection type value
  const watchedCollectionType = form.watch("collectionType");
  
  // Update state when form value changes
  if (watchedCollectionType !== collectionType) {
    setCollectionType(watchedCollectionType);
  }

  // Create lab test booking mutation
  const bookLabTestMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const testDateTime = new Date(data.date);
      
      const labTestData = {
        testName: test.name,
        date: testDateTime.toISOString(),
        location: data.collectionType === "home" ? "Home Collection" : "Lab Center",
        status: "scheduled",
      };
      
      const res = await apiRequest("POST", "/api/lab-tests", labTestData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lab-tests"] });
      toast({
        title: "Test booked successfully",
        description: `Your ${test.name} has been scheduled.`,
      });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to book test",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    bookLabTestMutation.mutate(data);
  };

  // Calculate available dates (next 14 days, excluding past dates)
  const today = new Date();
  const disabledDays = {
    before: today,
    after: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="collectionType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Sample Collection Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="home" id="home" checked={field.value === 'home'} />
                    </FormControl>
                    <FormLabel className="font-normal" htmlFor="home">
                      Home Collection
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="center" id="center" checked={field.value === 'center'} />
                    </FormControl>
                    <FormLabel className="font-normal" htmlFor="center">
                      Lab Center Visit
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className={cn(
                          "pl-3 text-left font-normal",
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
                      disabled={(date) => {
                        return date < disabledDays.before || date > disabledDays.after;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeSlot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Time</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter patient name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="patientAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 35" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientGender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {collectionType === "home" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Collection Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {test.preparationNeeded && test.preparationInstructions && (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-md mt-4">
            <h4 className="font-medium mb-2">Preparation Required</h4>
            <p className="text-sm">{test.preparationInstructions}</p>
          </div>
        )}

        <FormField
          control={form.control}
          name="acceptedTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I accept the terms and conditions
                </FormLabel>
                <FormDescription>
                  I understand the preparation requirements and consent to the collection of my samples.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-4 flex justify-between items-center">
          <div>
            <p className="font-medium">{test.name}</p>
            <p className="text-sm text-gray-500">Results in {test.duration}</p>
            <p className="font-bold mt-1">${test.price}</p>
          </div>
          <Button 
            type="submit" 
            disabled={bookLabTestMutation.isPending}
          >
            {bookLabTestMutation.isPending ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LabTestBookingForm;

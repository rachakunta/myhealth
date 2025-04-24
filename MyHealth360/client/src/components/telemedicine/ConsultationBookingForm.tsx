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
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  availability: string;
}

interface ConsultationBookingFormProps {
  doctor: Doctor;
  onSuccess: () => void;
}

// Time slots for consultations
const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
];

// Consultation types
const CONSULTATION_TYPES = [
  { value: "video", label: "Video Call" },
  { value: "chat", label: "Chat Consultation" },
  { value: "in-person", label: "In-Person Visit" }
];

// Form schema
const formSchema = z.object({
  appointmentType: z.string({
    required_error: "Please select a consultation type",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ConsultationBookingForm = ({ doctor, onSuccess }: ConsultationBookingFormProps) => {
  const { toast } = useToast();
  const [availableSlots, setAvailableSlots] = useState<string[]>(TIME_SLOTS);
  
  // Default form values
  const defaultValues: Partial<FormValues> = {
    appointmentType: "video",
    notes: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Create appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const appointmentDateTime = new Date(data.date);
      const [hours, minutes] = data.timeSlot.split(':');
      const isPM = data.timeSlot.includes('PM');
      
      let hour = parseInt(hours);
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      
      appointmentDateTime.setHours(hour, parseInt(minutes), 0, 0);
      
      const appointmentData = {
        doctorId: doctor.id,
        appointmentType: data.appointmentType,
        date: appointmentDateTime.toISOString(),
        status: "scheduled",
        notes: data.notes || "",
      };
      
      const res = await apiRequest("POST", "/api/appointments", appointmentData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Appointment booked",
        description: `Your appointment with Dr. ${doctor.name} has been scheduled.`,
      });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to book appointment",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    bookAppointmentMutation.mutate(data);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="appointmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consultation Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consultation type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CONSULTATION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
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
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
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
        </div>

        <FormField
          control={form.control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Slot</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableSlots.map((slot) => (
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

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Briefly describe your symptoms or reason for consultation"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-4 flex justify-between items-center">
          <div>
            <p className="font-medium">Dr. {doctor.name}</p>
            <p className="text-sm text-gray-500">{doctor.specialization}</p>
          </div>
          <Button 
            type="submit" 
            disabled={bookAppointmentMutation.isPending}
          >
            {bookAppointmentMutation.isPending ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ConsultationBookingForm;

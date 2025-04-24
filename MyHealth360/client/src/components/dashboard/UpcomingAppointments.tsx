import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Appointment } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function UpcomingAppointments() {
  const { toast } = useToast();
  
  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });
  
  const cancelAppointmentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been successfully cancelled.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Function to format datetime from ISO string
  const formatAppointmentTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return format(date, "EEEE, h:mm a");
    } catch (e) {
      return dateTimeStr;
    }
  };
  
  // Default appointments if none are available
  const defaultAppointments: Appointment[] = [
    {
      id: 1,
      userId: 1,
      doctorName: "Dr. Michael Roberts",
      specialty: "Cardiologist",
      appointmentType: "video",
      dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      status: "scheduled",
      notes: ""
    },
    {
      id: 2,
      userId: 1,
      doctorName: "Dr. Jennifer Lee",
      specialty: "Therapist",
      appointmentType: "video",
      dateTime: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
      status: "scheduled",
      notes: ""
    }
  ];
  
  const appointmentsToDisplay = appointments?.length ? appointments : defaultAppointments;
  
  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="p-4 border border-neutral-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between">
            <Skeleton className="h-4 w-32" />
            <div className="flex">
              <Skeleton className="h-6 w-16 mr-2" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Upcoming Appointments</h2>
        <a href="#" className="text-primary text-sm font-medium hover:underline">View All</a>
      </div>
      
      {isLoading ? (
        renderSkeletons()
      ) : (
        <div className="space-y-4">
          {appointmentsToDisplay.map((appointment) => (
            <div key={appointment.id} className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-primary-light bg-opacity-20 flex items-center justify-center">
                    <i className="fas fa-user-md text-primary"></i>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-neutral-900">{appointment.doctorName}</p>
                    <p className="text-sm text-neutral-700">{appointment.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <button className="text-primary text-sm font-medium hover:underline">Details</button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between">
                <div className="flex items-center text-sm text-neutral-700">
                  <i className="far fa-calendar-alt mr-2"></i>
                  {formatAppointmentTime(appointment.dateTime)}
                </div>
                <div className="flex">
                  {appointment.appointmentType === "video" && (
                    <Button variant="default" size="sm" className="mr-2 py-1 px-3 h-auto text-xs bg-primary text-white">
                      <i className="fas fa-video mr-1"></i> Join
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="py-1 px-3 h-auto text-xs bg-neutral-100 text-neutral-700"
                    onClick={() => cancelAppointmentMutation.mutate(appointment.id)}
                  >
                    Reschedule
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <Button variant="ghost" className="w-full py-3 text-center bg-neutral-100 rounded-lg text-primary font-medium">
            <i className="fas fa-plus mr-2"></i> Book New Appointment
          </Button>
        </div>
      )}
    </div>
  );
}

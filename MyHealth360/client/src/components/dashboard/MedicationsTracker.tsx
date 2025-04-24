import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Medication } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function MedicationsTracker() {
  const { toast } = useToast();
  
  const { data: medications, isLoading } = useQuery<Medication[]>({
    queryKey: ["/api/medications"],
  });
  
  const updateMedicationStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PUT", `/api/medications/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medications"] });
      toast({
        title: "Medication updated",
        description: "Your medication status has been updated.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update medication. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Default medications if none are available
  const defaultMedications: Medication[] = [
    {
      id: 1,
      userId: 1,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      timeOfDay: "9:00 PM",
      remainingDays: 5,
      status: "taken"
    },
    {
      id: 2,
      userId: 1,
      name: "Vitamin D3",
      dosage: "2000 IU",
      frequency: "Once daily",
      timeOfDay: "8:00 AM",
      remainingDays: 12,
      status: "pending"
    }
  ];
  
  const medicationsToDisplay = medications?.length ? medications : defaultMedications;
  
  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="p-4 border border-neutral-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between items-center">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
  
  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "taken":
        return "bg-success bg-opacity-10 text-success";
      case "pending":
        return "bg-warning bg-opacity-10 text-warning";
      case "missed":
        return "bg-danger bg-opacity-10 text-danger";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "taken":
        return "Taken";
      case "pending":
        return "Pending";
      case "missed":
        return "Missed";
      default:
        return status;
    }
  };
  
  const handleMarkAsTaken = (id: number) => {
    updateMedicationStatusMutation.mutate({ id, status: "taken" });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Medications</h2>
        <a href="#" className="text-primary text-sm font-medium hover:underline">View All</a>
      </div>
      
      {isLoading ? (
        renderSkeletons()
      ) : (
        <div className="space-y-4">
          {medicationsToDisplay.map((medication) => (
            <div key={medication.id} className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-accent-light bg-opacity-20 flex items-center justify-center">
                    <i className={`fas fa-${medication.name.toLowerCase().includes('vitamin') ? 'capsules' : 'pills'} text-accent`}></i>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-neutral-900">{medication.name}</p>
                    <p className="text-sm text-neutral-700">{medication.dosage}, {medication.frequency}</p>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(medication.status)}`}>
                    {getStatusLabel(medication.status)}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between items-center">
                <div className="text-sm text-neutral-700">
                  Next: Today, {medication.timeOfDay}
                </div>
                <div>
                  {medication.status === "pending" ? (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-primary p-0"
                      onClick={() => handleMarkAsTaken(medication.id)}
                    >
                      Mark as taken
                    </Button>
                  ) : (
                    <span className="text-sm text-primary font-medium">{medication.remainingDays} days remaining</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <Button variant="ghost" className="w-full py-3 text-center bg-neutral-100 rounded-lg text-primary font-medium">
            <i className="fas fa-prescription-bottle-alt mr-2"></i> Refill Medications
          </Button>
        </div>
      )}
    </div>
  );
}

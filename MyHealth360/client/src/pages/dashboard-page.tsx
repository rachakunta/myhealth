import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import HealthScore from "@/components/dashboard/HealthScore";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import MedicationTracker from "@/components/dashboard/MedicationTracker";
import HealthMetrics from "@/components/dashboard/HealthMetrics";
import MentalWellness from "@/components/dashboard/MentalWellness";
import HealthProgressGrid from "@/components/health/HealthProgressGrid";
import { HealthAvatar } from "@/components/avatar/HealthAvatar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Mock data for initial rendering
const mockHealthMetricsData = [
  { date: "Mon", bloodPressure: "120/80", heartRate: 72, bloodGlucose: 95 },
  { date: "Tue", bloodPressure: "118/79", heartRate: 74, bloodGlucose: 92 },
  { date: "Wed", bloodPressure: "122/82", heartRate: 71, bloodGlucose: 97 },
  { date: "Thu", bloodPressure: "121/81", heartRate: 73, bloodGlucose: 94 },
  { date: "Fri", bloodPressure: "119/80", heartRate: 70, bloodGlucose: 93 },
  { date: "Sat", bloodPressure: "120/78", heartRate: 68, bloodGlucose: 91 },
  { date: "Sun", bloodPressure: "117/77", heartRate: 72, bloodGlucose: 90 }
];

const mockLatestMetrics = {
  bloodPressure: "120/80",
  heartRate: 72,
  bloodGlucose: 95,
  bloodPressureStatus: "Normal",
  heartRateStatus: "Normal",
  bloodGlucoseStatus: "Normal"
};

const mockAppointments = [
  {
    id: 1,
    type: "video",
    title: "Dr. Sarah Johnson",
    subtitle: "Cardiology Consultation",
    date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
    icon: "ri-video-chat-fill",
    iconBg: "bg-primary bg-opacity-10",
    iconColor: "text-primary"
  },
  {
    id: 2,
    type: "test",
    title: "Annual Blood Test",
    subtitle: "City Lab Center",
    date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    icon: "ri-test-tube-fill",
    iconBg: "bg-green-100",
    iconColor: "text-green-500"
  }
];

const mockMedications = [
  { id: 1, name: "Lisinopril 10mg", dosage: "1 pill", frequency: "once daily", taken: true },
  { id: 2, name: "Metformin 500mg", dosage: "1 pill", frequency: "twice daily", taken: false },
  { id: 3, name: "Vitamin D 1000IU", dosage: "1 pill", frequency: "once daily", taken: false }
];

const DashboardPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [medications, setMedications] = useState(mockMedications);
  const [timeRange, setTimeRange] = useState("day");

  // Fetch appointments
  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/appointments", { credentials: "include" });
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        return await response.json();
      } catch (error) {
        // If there's an error, we'll just use the mock data
        console.error("Error fetching appointments:", error);
        return [];
      }
    },
    initialData: [],
  });

  // Fetch medications
  const { data: medicationsData, isLoading: medicationsLoading } = useQuery({
    queryKey: ["/api/medications"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/medications", { credentials: "include" });
        if (!response.ok) {
          throw new Error("Failed to fetch medications");
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching medications:", error);
        return [];
      }
    },
    initialData: [],
  });

  // Update medication mutation
  const updateMedicationMutation = useMutation({
    mutationFn: async ({ id, taken }: { id: number; taken: boolean }) => {
      await apiRequest("PUT", `/api/medications/${id}`, { taken });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medications"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update medication",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handler for medication toggle
  const handleMedicationToggle = (id: number, taken: boolean) => {
    // Optimistically update UI
    setMedications(medications.map(med => 
      med.id === id ? { ...med, taken } : med
    ));
    
    // Send update to server
    updateMedicationMutation.mutate({ id, taken });
  };

  // Handler for mood selection
  const handleMoodSelect = (mood: string) => {
    toast({
      title: "Mood updated",
      description: `You're feeling ${mood.toLowerCase()} today`,
    });
  };

  // Set medications from API data if available
  useEffect(() => {
    if (medicationsData && medicationsData.length > 0) {
      setMedications(medicationsData);
    }
  }, [medicationsData]);

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start mb-8">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Your Health Dashboard</h2>
            <p className="text-gray-600">Track your metrics, appointments, and personalized recommendations.</p>
          </div>
          <div className="md:w-1/2 flex justify-end">
            <Tabs defaultValue="day" value={timeRange} onValueChange={setTimeRange}>
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Health Score Card */}
          <HealthScore score={85} trend="up" status="Good" />
          
          {/* Upcoming Appointments */}
          <AppointmentCard appointments={appointments.length > 0 ? appointments : mockAppointments} />
          
          {/* Medication Tracker */}
          <MedicationTracker medications={medications} onToggleMedication={handleMedicationToggle} />
        </div>
        
        {/* Animated Health Progress Widgets */}
        <div className="mt-6 mb-8">
          <div className="flex flex-col md:flex-row items-start mb-4">
            <div className="md:w-1/2 mb-2 md:mb-0">
              <h3 className="text-xl font-bold">Animated Health Progress</h3>
              <p className="text-gray-600">Track your health metrics with interactive characters</p>
            </div>
          </div>
          
          <HealthProgressGrid />
        </div>
        
        {/* Health Avatar and Metrics Row */}
        <div className="mt-8 mb-6">
          <div className="flex flex-col md:flex-row items-start mb-4">
            <div className="md:w-1/2 mb-2 md:mb-0">
              <h3 className="text-xl font-bold">Your Interactive Health Assistant</h3>
              <p className="text-gray-600">Get personalized wellness tips and health insights</p>
            </div>
          </div>
          
          <HealthAvatar userName={user?.fullName?.split(' ')[0] || user?.username || 'there'} />
        </div>
        
        {/* Health Metrics Row */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Physical Health Metrics */}
          <HealthMetrics data={mockHealthMetricsData} latestMetrics={mockLatestMetrics} />
          
          {/* Mental Wellness Tracker */}
          <MentalWellness onMoodSelect={handleMoodSelect} />
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { insertHealthMetricsSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Create a form schema extending the insert schema
const healthMetricsFormSchema = z.object({
  bloodPressure: z
    .string()
    .refine(
      (val) => !val || /^\d{2,3}\/\d{2,3}$/.test(val),
      {
        message: "Blood pressure must be in the format of systolic/diastolic (e.g., 120/80)",
      }
    ),
  heartRate: z
    .string(),
  bloodGlucose: z
    .string(),
  weight: z
    .string(),
  height: z
    .string(),
  sleepHours: z
    .string(),
  steps: z
    .string(),
  mentalWellnessScore: z
    .string(),
});

type HealthMetricsFormValues = z.infer<typeof healthMetricsFormSchema>;

const HealthMetricsForm: React.FC = () => {
  const { toast } = useToast();
  
  const form = useForm<HealthMetricsFormValues>({
    resolver: zodResolver(healthMetricsFormSchema),
    defaultValues: {
      bloodPressure: "",
      heartRate: "",
      bloodGlucose: "",
      weight: "",
      height: "",
      sleepHours: "",
      steps: "",
      mentalWellnessScore: "",
    },
  });

  const healthMetricsMutation = useMutation({
    mutationFn: async (data: HealthMetricsFormValues) => {
      // Clean up the data - remove empty string values
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== "") {
          acc[key as keyof HealthMetricsFormValues] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      const response = await apiRequest("POST", "/api/health-metrics", cleanData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Health metrics saved",
        description: "Your health metrics have been successfully recorded.",
      });
      form.reset();
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/health-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/health-metrics/latest"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save health metrics",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: HealthMetricsFormValues) => {
    healthMetricsMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Record Health Metrics</CardTitle>
        <CardDescription>Enter your current health metrics to track your progress</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bloodPressure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Pressure</FormLabel>
                    <FormControl>
                      <Input placeholder="120/80" {...field} />
                    </FormControl>
                    <FormDescription>Systolic/Diastolic in mmHg</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heartRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heart Rate</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="75" {...field} />
                    </FormControl>
                    <FormDescription>Beats per minute (bpm)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bloodGlucose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Glucose</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormDescription>In mg/dL</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="70" {...field} />
                    </FormControl>
                    <FormDescription>In kilograms</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="170" {...field} />
                    </FormControl>
                    <FormDescription>In centimeters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sleepHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sleep Hours</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="8" {...field} />
                    </FormControl>
                    <FormDescription>Hours of sleep last night</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="steps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Steps</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" {...field} />
                    </FormControl>
                    <FormDescription>Steps taken today</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mentalWellnessScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mental Wellness Score</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="8" min="1" max="10" {...field} />
                    </FormControl>
                    <FormDescription>Scale of 1-10 (10 being best)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={healthMetricsMutation.isPending}
            >
              {healthMetricsMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Health Metrics"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default HealthMetricsForm;
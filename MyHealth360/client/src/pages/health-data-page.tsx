import React from "react";
import { useQuery } from "@tanstack/react-query";
import HealthMetricsForm from "@/components/health/HealthMetricsForm";
import HealthProgressGrid from "@/components/health/HealthProgressGrid";
import { HealthMetrics } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const HealthDataPage: React.FC = () => {
  // Fetch all health metrics
  const { data: healthMetrics, isLoading } = useQuery<HealthMetrics[]>({
    queryKey: ["/api/health-metrics"],
  });

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start mb-8">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Health Data Center</h2>
            <p className="text-gray-600">
              Record and track your health metrics with interactive visualizations
            </p>
          </div>
        </div>

        <Tabs defaultValue="record" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="record">Record New Data</TabsTrigger>
            <TabsTrigger value="visualize">Visualize Progress</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="record">
            <div className="grid grid-cols-1 gap-6">
              <HealthMetricsForm />
            </div>
          </TabsContent>

          <TabsContent value="visualize">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Animated Health Progress</h3>
              <HealthProgressGrid />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Health Metrics History</CardTitle>
                <CardDescription>View your previous health metric records</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !healthMetrics || healthMetrics.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-lg text-muted-foreground">No health metrics recorded yet</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Start tracking your health by adding new records
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => {
                        const recordTab = document.querySelector('[value="record"]') as HTMLElement;
                        if (recordTab) recordTab.click();
                      }}
                    >
                      Record New Data
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Blood Pressure</TableHead>
                          <TableHead>Heart Rate</TableHead>
                          <TableHead>Blood Glucose</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>Sleep Hours</TableHead>
                          <TableHead>Steps</TableHead>
                          <TableHead>Wellness Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {healthMetrics
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((metric) => (
                            <TableRow key={metric.id}>
                              <TableCell>{format(new Date(metric.date), "MMM d, yyyy")}</TableCell>
                              <TableCell>{metric.bloodPressure || "-"}</TableCell>
                              <TableCell>{metric.heartRate !== null ? `${metric.heartRate} bpm` : "-"}</TableCell>
                              <TableCell>{metric.bloodGlucose !== null ? `${metric.bloodGlucose} mg/dL` : "-"}</TableCell>
                              <TableCell>{metric.weight !== null ? `${metric.weight} kg` : "-"}</TableCell>
                              <TableCell>{metric.sleepHours !== null ? `${metric.sleepHours} hrs` : "-"}</TableCell>
                              <TableCell>{metric.steps !== null ? metric.steps : "-"}</TableCell>
                              <TableCell>{metric.mentalWellnessScore !== null ? `${metric.mentalWellnessScore}/10` : "-"}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default HealthDataPage;
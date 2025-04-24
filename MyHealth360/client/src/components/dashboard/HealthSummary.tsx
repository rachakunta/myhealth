import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HealthMetric } from "@shared/schema";
import { HealthMetricCard } from "@/components/ui/health-metric-card";
import { Skeleton } from "@/components/ui/skeleton";

export function HealthSummary() {
  const [timeRange, setTimeRange] = useState<string>("week");
  
  const { data: healthMetrics, isLoading } = useQuery<HealthMetric[]>({
    queryKey: ["/api/health-metrics"],
  });
  
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-neutral-100 rounded-lg p-4">
          <div className="flex items-center">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="ml-4 flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <Skeleton className="mt-3 h-4 w-32" />
        </div>
      ))}
    </div>
  );
  
  // Default metrics if none are available from the API
  const defaultMetrics: HealthMetric[] = [
    {
      id: 1,
      userId: 1,
      metricType: "heart_rate",
      value: "72",
      unit: "bpm",
      recordedAt: new Date().toISOString(),
      trend: "down",
      trendPercentage: 3
    },
    {
      id: 2,
      userId: 1,
      metricType: "steps",
      value: "8342",
      unit: "steps",
      recordedAt: new Date().toISOString(),
      trend: "up",
      trendPercentage: 12
    },
    {
      id: 3,
      userId: 1,
      metricType: "sleep",
      value: "6.5",
      unit: "hours",
      recordedAt: new Date().toISOString(),
      trend: "down",
      trendPercentage: 8
    },
    {
      id: 4,
      userId: 1,
      metricType: "stress",
      value: "Medium",
      unit: "",
      recordedAt: new Date().toISOString(),
      trend: "stable",
      trendPercentage: 0
    }
  ];
  
  const metricsToDisplay = healthMetrics?.length ? healthMetrics : defaultMetrics;
  
  return (
    <div className="mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Your Health Summary</h2>
          <div className="mt-2 md:mt-0">
            <select 
              className="bg-neutral-100 border border-neutral-200 text-neutral-700 py-2 px-3 rounded-lg text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 90 days</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          renderSkeletons()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {metricsToDisplay.map((metric) => (
              <HealthMetricCard 
                key={metric.id}
                metric={metric}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MetricData {
  date: string;
  bloodPressure: string;
  heartRate: number;
  bloodGlucose: number;
}

interface HealthMetricsProps {
  data: MetricData[];
  latestMetrics: {
    bloodPressure: string;
    heartRate: number;
    bloodGlucose: number;
    bloodPressureStatus: string;
    heartRateStatus: string;
    bloodGlucoseStatus: string;
  };
}

const HealthMetrics = ({ data, latestMetrics }: HealthMetricsProps) => {
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'high':
        return 'text-red-500';
      case 'normal':
        return 'text-green-500';
      case 'low':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold">Physical Health Metrics</h3>
        <Tabs defaultValue="weekly">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="h-64 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="#1976D2"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="bloodGlucose" stroke="#4CAF50" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Blood Pressure</p>
          <p className="font-medium">{latestMetrics.bloodPressure}</p>
          <p className={`text-xs ${getStatusColor(latestMetrics.bloodPressureStatus)}`}>
            {latestMetrics.bloodPressureStatus}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Heart Rate</p>
          <p className="font-medium">{latestMetrics.heartRate} bpm</p>
          <p className={`text-xs ${getStatusColor(latestMetrics.heartRateStatus)}`}>
            {latestMetrics.heartRateStatus}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Blood Glucose</p>
          <p className="font-medium">{latestMetrics.bloodGlucose} mg/dL</p>
          <p className={`text-xs ${getStatusColor(latestMetrics.bloodGlucoseStatus)}`}>
            {latestMetrics.bloodGlucoseStatus}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthMetrics;

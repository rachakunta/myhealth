import { HealthMetric } from "@shared/schema";

interface HealthMetricCardProps {
  metric: HealthMetric;
}

export function HealthMetricCard({ metric }: HealthMetricCardProps) {
  const getMetricIcon = (type: string) => {
    switch (type) {
      case "heart_rate":
        return "heartbeat";
      case "steps":
        return "shoe-prints";
      case "sleep":
        return "moon";
      case "stress":
        return "brain";
      default:
        return "chart-line";
    }
  };
  
  const getMetricName = (type: string) => {
    switch (type) {
      case "heart_rate":
        return "Heart Rate";
      case "steps":
        return "Daily Steps";
      case "sleep":
        return "Sleep";
      case "stress":
        return "Stress Level";
      default:
        return type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }
  };
  
  const getMetricColor = (type: string) => {
    switch (type) {
      case "heart_rate":
        return "primary";
      case "steps":
        return "secondary";
      case "sleep":
        return "accent";
      case "stress":
        return "info";
      default:
        return "primary";
    }
  };
  
  const getTrendIconAndClass = (trend: string | undefined) => {
    if (!trend) return { icon: "equals", class: "text-neutral-700" };
    
    switch (trend) {
      case "up":
        return { 
          icon: "arrow-up", 
          class: metric.metricType === "stress" ? "text-warning" : "text-success"
        };
      case "down":
        return { 
          icon: "arrow-down", 
          class: metric.metricType === "stress" ? "text-success" : (
            metric.metricType === "sleep" ? "text-warning" : "text-danger"
          )
        };
      default:
        return { icon: "equals", class: "text-neutral-700" };
    }
  };
  
  const formatValue = (value: string) => {
    return value.includes(".") ? parseFloat(value).toLocaleString() : parseInt(value).toLocaleString();
  };
  
  const { icon, class: trendClass } = getTrendIconAndClass(metric.trend);
  
  return (
    <div className="bg-neutral-100 rounded-lg p-4">
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-full bg-${getMetricColor(metric.metricType)}-light bg-opacity-20 flex items-center justify-center`}>
          <i className={`fas fa-${getMetricIcon(metric.metricType)} text-${getMetricColor(metric.metricType)}`}></i>
        </div>
        <div className="ml-4">
          <p className="text-neutral-700 text-sm">{getMetricName(metric.metricType)}</p>
          <div className="flex items-end">
            <p className="text-2xl font-semibold text-neutral-900">{metric.value}</p>
            {metric.unit && (
              <p className="ml-1 text-sm text-neutral-700">{metric.unit}</p>
            )}
          </div>
        </div>
      </div>
      
      {metric.trend && (
        <div className="mt-3 text-sm">
          <span className={`${trendClass} flex items-center`}>
            <i className={`fas fa-${icon} mr-1 text-xs`}></i>
            {metric.trendPercentage ? `${metric.trendPercentage}% from last week` : 'Same as last week'}
          </span>
        </div>
      )}
    </div>
  );
}

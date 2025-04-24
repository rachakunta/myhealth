import { useQuery } from "@tanstack/react-query";
import { HealthInsight } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function HealthInsights() {
  const { data: insights, isLoading } = useQuery<HealthInsight[]>({
    queryKey: ["/api/health-insights"],
  });
  
  // Default insights if none are available from API
  const defaultInsights: HealthInsight[] = [
    {
      id: 1,
      userId: 1,
      insightType: "improvement",
      title: "Your sleep pattern is improving",
      description: "Your sleep consistency has improved by 15% in the last two weeks, which can help reduce stress levels.",
      actionLink: "/sleep-data",
      actionText: "View sleep data",
      icon: "robot"
    },
    {
      id: 2,
      userId: 1,
      insightType: "warning",
      title: "Hydration reminder",
      description: "Your tracked water intake is below recommended levels for the past 3 days. Consider increasing fluid intake.",
      actionLink: "/track-water",
      actionText: "Track water intake",
      icon: "exclamation-triangle"
    },
    {
      id: 3,
      userId: 1,
      insightType: "info",
      title: "Heart rate trends are stable",
      description: "Your resting heart rate remains within a healthy range, averaging 68-73 bpm over the past month.",
      actionLink: "/heart-data",
      actionText: "Review heart data",
      icon: "heartbeat"
    }
  ];
  
  const insightsToDisplay = insights?.length ? insights : defaultInsights;
  
  const getInsightClasses = (type: string) => {
    switch (type) {
      case "improvement":
        return "bg-primary bg-opacity-5 border border-primary border-opacity-20";
      case "warning":
        return "bg-warning bg-opacity-5 border border-warning border-opacity-20";
      case "info":
        return "border border-neutral-200";
      default:
        return "border border-neutral-200";
    }
  };
  
  const getIconClasses = (type: string) => {
    switch (type) {
      case "improvement":
        return "bg-primary bg-opacity-20 text-primary";
      case "warning":
        return "bg-warning bg-opacity-20 text-warning";
      case "info":
        return "bg-secondary bg-opacity-20 text-secondary";
      default:
        return "bg-neutral-200 text-neutral-700";
    }
  };
  
  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border border-neutral-200 rounded-lg">
          <div className="flex items-start">
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="ml-3 flex-1">
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-2/3" />
              <div className="mt-3">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">AI Health Insights</h2>
        <button className="text-neutral-700 hover:text-neutral-900">
          <i className="fas fa-ellipsis-v"></i>
        </button>
      </div>
      
      {isLoading ? (
        renderSkeletons()
      ) : (
        <div className="space-y-4">
          {insightsToDisplay.map((insight) => (
            <div key={insight.id} className={`p-4 rounded-lg ${getInsightClasses(insight.insightType)}`}>
              <div className="flex items-start">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconClasses(insight.insightType)}`}>
                  <i className={`fas fa-${insight.icon}`}></i>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-neutral-900">{insight.title}</p>
                  <p className="text-sm text-neutral-700 mt-1">{insight.description}</p>
                  {insight.actionLink && insight.actionText && (
                    <div className="mt-3">
                      <button className="text-primary text-sm font-medium hover:underline">
                        {insight.actionText}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

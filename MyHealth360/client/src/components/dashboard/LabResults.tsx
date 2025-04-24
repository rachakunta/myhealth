import { useQuery } from "@tanstack/react-query";
import { LabTest } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";

export function LabResults() {
  const { data: labTests, isLoading } = useQuery<LabTest[]>({
    queryKey: ["/api/lab-tests"],
  });
  
  // Format date function
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };
  
  // Default lab tests if none are available from API
  const defaultLabTests: LabTest[] = [
    {
      id: 1,
      userId: 1,
      testName: "Complete Blood Count",
      testDate: "2023-10-15",
      status: "completed",
      results: "All values within normal range",
      resultStatus: "normal"
    },
    {
      id: 2,
      userId: 1,
      testName: "Lipid Panel",
      testDate: "2023-09-30",
      status: "completed",
      results: "LDL slightly elevated",
      resultStatus: "review"
    }
  ];
  
  const labTestsToDisplay = labTests?.length ? labTests : defaultLabTests;
  
  const getStatusBadgeClasses = (status: string | undefined) => {
    switch (status) {
      case "normal":
        return "bg-success bg-opacity-10 text-success";
      case "review":
        return "bg-warning bg-opacity-10 text-warning";
      case "abnormal":
        return "bg-danger bg-opacity-10 text-danger";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };
  
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
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Lab Results</h2>
        <a href="#" className="text-primary text-sm font-medium hover:underline">View All</a>
      </div>
      
      {isLoading ? (
        renderSkeletons()
      ) : (
        <div className="space-y-4">
          {labTestsToDisplay.map((labTest) => (
            <div key={labTest.id} className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-info bg-opacity-20 flex items-center justify-center">
                    <i className={`fas fa-${labTest.testName.toLowerCase().includes('blood') ? 'flask' : 'vial'} text-info`}></i>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-neutral-900">{labTest.testName}</p>
                    <p className="text-sm text-neutral-700">{formatDate(labTest.testDate)}</p>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(labTest.resultStatus)}`}>
                    {labTest.resultStatus ? labTest.resultStatus.charAt(0).toUpperCase() + labTest.resultStatus.slice(1) : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between">
                <button className="text-sm text-primary font-medium">
                  View Details
                </button>
                <button className="text-sm text-neutral-700">
                  <i className="fas fa-download mr-1"></i> Download
                </button>
              </div>
            </div>
          ))}
          
          <Button variant="ghost" className="w-full py-3 text-center bg-neutral-100 rounded-lg text-primary font-medium">
            <i className="fas fa-file-medical-alt mr-2"></i> Book New Test
          </Button>
        </div>
      )}
    </div>
  );
}

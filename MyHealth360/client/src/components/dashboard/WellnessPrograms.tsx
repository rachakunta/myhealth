import { useQuery } from "@tanstack/react-query";
import { WellnessProgram } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function WellnessPrograms() {
  const { toast } = useToast();
  
  const { data: programs, isLoading } = useQuery<WellnessProgram[]>({
    queryKey: ["/api/wellness-programs"],
  });
  
  const handleJoinProgram = (programId: number, programName: string) => {
    toast({
      title: "Program Joined",
      description: `You've successfully joined the ${programName} program.`,
      variant: "default",
    });
  };
  
  // Default programs if none are available from API
  const defaultPrograms: WellnessProgram[] = [
    {
      id: 1,
      name: "Stress Management Program",
      category: "mental_wellness",
      description: "Learn techniques to manage daily stress and improve mental resilience",
      duration: "4-week program",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      name: "Balanced Diet Plan",
      category: "nutrition",
      description: "Personalized nutrition guidance for your health goals and preferences",
      duration: "6-week program",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      name: "Better Sleep Habits",
      category: "sleep",
      description: "Improve your sleep quality with evidence-based techniques and tracking",
      duration: "3-week program",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80"
    }
  ];
  
  const programsToDisplay = programs?.length ? programs : defaultPrograms;
  
  const getCategoryBadgeClasses = (category: string) => {
    switch (category) {
      case "mental_wellness":
        return "bg-secondary";
      case "nutrition":
        return "bg-accent";
      case "sleep":
        return "bg-primary";
      case "fitness":
        return "bg-info";
      default:
        return "bg-primary";
    }
  };
  
  const getCategoryName = (category: string) => {
    switch (category) {
      case "mental_wellness":
        return "Mental Wellness";
      case "nutrition":
        return "Nutrition";
      case "sleep":
        return "Sleep";
      case "fitness":
        return "Fitness";
      default:
        return category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ");
    }
  };
  
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-neutral-200 rounded-xl overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-4/5 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className="mt-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Wellness Programs</h2>
          <a href="#" className="text-primary text-sm font-medium hover:underline">Explore All Programs</a>
        </div>
        
        {isLoading ? (
          renderSkeletons()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programsToDisplay.map((program) => (
              <div key={program.id} className="border border-neutral-200 rounded-xl overflow-hidden">
                <div className="h-48 bg-neutral-200 relative">
                  {program.image && (
                    <img 
                      src={program.image} 
                      alt={program.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getCategoryBadgeClasses(program.category)}`}>
                      {getCategoryName(program.category)}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-neutral-900">{program.name}</h3>
                  <p className="text-neutral-700 text-sm mt-1">{program.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-neutral-700">{program.duration}</span>
                    <Button 
                      className="bg-primary hover:bg-primary-dark text-white font-medium px-3 py-1.5 text-sm rounded-lg"
                      onClick={() => handleJoinProgram(program.id, program.name)}
                    >
                      Join Program
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

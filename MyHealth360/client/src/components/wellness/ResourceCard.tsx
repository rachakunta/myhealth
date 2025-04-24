import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WellnessResource {
  id: number;
  title: string;
  type: string;
  description: string;
  duration: string;
  thumbnailUrl?: string;
  url?: string;
}

interface ResourceCardProps {
  resource: WellnessResource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  // Helper function to get icon based on resource type
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'meditation':
        return 'ri-mental-health-line';
      case 'breathing':
        return 'ri-lungs-line';
      case 'sleep':
        return 'ri-moon-line';
      case 'reading':
        return 'ri-book-read-line';
      case 'yoga':
        return 'ri-yoga-line';
      case 'stress relief':
        return 'ri-psychology-line';
      case 'nutrition':
        return 'ri-restaurant-line';
      case 'exercise':
        return 'ri-run-line';
      default:
        return 'ri-heart-line';
    }
  };

  // Helper function to get background color based on resource type
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'meditation':
        return 'bg-blue-500';
      case 'breathing':
        return 'bg-teal-500';
      case 'sleep':
        return 'bg-indigo-500';
      case 'reading':
        return 'bg-amber-500';
      case 'yoga':
        return 'bg-green-500';
      case 'stress relief':
        return 'bg-purple-500';
      case 'nutrition':
        return 'bg-orange-500';
      case 'exercise':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Resource Thumbnail/Header */}
        <div className={`h-48 ${getTypeColor(resource.type)} flex items-center justify-center`}>
          {resource.thumbnailUrl ? (
            <img 
              src={resource.thumbnailUrl} 
              alt={resource.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <i className={`${getTypeIcon(resource.type)} text-5xl text-white`}></i>
          )}
        </div>
        
        {/* Resource Details */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="bg-gray-100 text-gray-800">
              {resource.type}
            </Badge>
            <span className="text-sm text-gray-500">{resource.duration}</span>
          </div>
          
          <h3 className="font-semibold text-lg mb-3">{resource.title}</h3>
          
          <p className="text-gray-600 text-sm mb-4">
            {resource.description}
          </p>
          
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm">
              <i className="ri-bookmark-line mr-1"></i>
              Save
            </Button>
            
            <Button>
              {resource.type.toLowerCase() === 'reading' ? (
                <>
                  <i className="ri-book-open-line mr-1"></i>
                  Read Now
                </>
              ) : (
                <>
                  <i className="ri-play-line mr-1"></i>
                  Start Now
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;

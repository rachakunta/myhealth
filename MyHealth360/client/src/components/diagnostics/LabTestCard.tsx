import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LabTest {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  preparationNeeded: boolean;
  preparationInstructions?: string;
  homeCollection: boolean;
}

interface LabTestCardProps {
  test: LabTest;
  onBookTest: () => void;
}

const LabTestCard = ({ test, onBookTest }: LabTestCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{test.name}</h3>
          <Badge variant="outline" className="ml-2">
            {test.homeCollection ? "Home Collection" : "Lab Visit Required"}
          </Badge>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">
          {test.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            <i className="ri-time-line mr-1"></i>
            Results in {test.duration}
          </Badge>
          
          {test.preparationNeeded && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
              <i className="ri-information-line mr-1"></i>
              Preparation Required
            </Badge>
          )}
        </div>
        
        {test.preparationNeeded && test.preparationInstructions && (
          <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm mb-4">
            <p className="font-medium mb-1">Preparation Instructions:</p>
            <p>{test.preparationInstructions}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">${test.price}</span>
            <span className="text-gray-500 ml-1 line-through">${(test.price * 1.2).toFixed(2)}</span>
            <span className="text-green-600 text-sm ml-2">20% off</span>
          </div>
          
          <Button onClick={onBookTest}>
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabTestCard;

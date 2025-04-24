import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  availability: string;
  imageUrl?: string;
}

interface DoctorCardProps {
  doctor: Doctor;
  onBookConsultation: () => void;
}

const DoctorCard = ({ doctor, onBookConsultation }: DoctorCardProps) => {
  // Helper function to render doctor's rating as stars
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="ri-star-fill text-yellow-400"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-fill text-yellow-400"></i>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="ri-star-line text-yellow-400"></i>);
    }

    return (
      <div className="flex items-center">
        <div className="flex mr-1">{stars}</div>
        <span className="text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  // Parse availability string to check if doctor is available now
  const isAvailableNow = doctor.availability.includes("Now") || doctor.availability.includes("now");

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {doctor.imageUrl ? (
                <img src={doctor.imageUrl} alt={doctor.name} className="h-full w-full object-cover" />
              ) : (
                <i className="ri-user-line text-2xl text-gray-400"></i>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-lg">{doctor.name}</h3>
                {isAvailableNow && (
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 inline-block"></span>
                    Available Now
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-600 mb-1">{doctor.specialization}</p>
              <p className="text-sm text-gray-500 mb-2">{doctor.experience} years experience</p>
              
              {renderRating(doctor.rating)}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Next Available</p>
                <p className="font-medium">{doctor.availability}</p>
              </div>
              
              <Button onClick={onBookConsultation}>
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;

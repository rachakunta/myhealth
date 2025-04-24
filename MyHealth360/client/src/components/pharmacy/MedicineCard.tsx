import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Medicine {
  id: number;
  name: string;
  manufacturer: string;
  description: string;
  price: number;
  dosage: string;
  category: string;
  requiresPrescription: boolean;
  inStock: boolean;
  imageUrl?: string;
}

interface MedicineCardProps {
  medicine: Medicine;
  onAddToCart: () => void;
  onOrderNow: () => void;
}

const MedicineCard = ({ medicine, onAddToCart, onOrderNow }: MedicineCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{medicine.name}</h3>
          {medicine.requiresPrescription && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Prescription
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mb-1">{medicine.dosage} • {medicine.manufacturer}</p>
        
        <p className="text-gray-600 text-sm mb-4">
          {medicine.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            {medicine.category}
          </Badge>
          
          {medicine.inStock ? (
            <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
              In Stock
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100">
              Out of Stock
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">${medicine.price.toFixed(2)}</span>
            {medicine.price > 10 && (
              <span className="text-green-600 text-sm ml-2">10% off</span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onAddToCart} disabled={!medicine.inStock}>
              Add to Cart
            </Button>
            <Button onClick={onOrderNow} disabled={!medicine.inStock}>
              Order Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineCard;

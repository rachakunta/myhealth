import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, ShoppingCart } from "lucide-react";
import MedicineCard from "@/components/pharmacy/MedicineCard";
import OrderForm from "@/components/pharmacy/OrderForm";
import PharmacySearch from "@/components/pharmacy/PharmacySearch"; // Added import

// Types for medications
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

// Sample medication categories
const medicineCategories = [
  { id: 1, name: "Diabetes", icon: "ri-capsule-line" },
  { id: 2, name: "Heart Health", icon: "ri-heart-line" },
  { id: 3, name: "Pain Relief", icon: "ri-psychotherapy-line" },
  { id: 4, name: "Antibiotics", icon: "ri-virus-line" },
  { id: 5, name: "Respiratory", icon: "ri-lungs-line" },
  { id: 6, name: "Allergy", icon: "ri-eye-line" },
  { id: 7, name: "Vitamins", icon: "ri-medicine-bottle-line" },
  { id: 8, name: "Skin Care", icon: "ri-flower-line" }
];

// Sample medications
const sampleMedicines: Medicine[] = [
  {
    id: 1,
    name: "Metformin 500mg",
    manufacturer: "HealthPharm",
    description: "Oral diabetes medicine that helps control blood sugar levels.",
    price: 12.99,
    dosage: "500mg",
    category: "Diabetes",
    requiresPrescription: true,
    inStock: true
  },
  {
    id: 2,
    name: "Lisinopril 10mg",
    manufacturer: "MediCore",
    description: "ACE inhibitor that treats high blood pressure and heart failure.",
    price: 15.49,
    dosage: "10mg",
    category: "Heart Health",
    requiresPrescription: true,
    inStock: true
  },
  {
    id: 3,
    name: "Ibuprofen 200mg",
    manufacturer: "PainRelief Inc",
    description: "Nonsteroidal anti-inflammatory drug used to relieve pain and reduce fever.",
    price: 8.99,
    dosage: "200mg",
    category: "Pain Relief",
    requiresPrescription: false,
    inStock: true
  },
  {
    id: 4,
    name: "Amoxicillin 500mg",
    manufacturer: "AntiBac Pharmaceuticals",
    description: "Antibiotic used to treat a number of bacterial infections.",
    price: 14.99,
    dosage: "500mg",
    category: "Antibiotics",
    requiresPrescription: true,
    inStock: true
  },
  {
    id: 5,
    name: "Vitamin D3 1000IU",
    manufacturer: "VitalNutrients",
    description: "Helps the body absorb calcium for bone health.",
    price: 10.99,
    dosage: "1000IU",
    category: "Vitamins",
    requiresPrescription: false,
    inStock: true
  },
  {
    id: 6,
    name: "Cetirizine 10mg",
    manufacturer: "AllerClear",
    description: "Antihistamine that reduces the effects of natural chemical histamine in the body.",
    price: 9.49,
    dosage: "10mg",
    category: "Allergy",
    requiresPrescription: false,
    inStock: true
  }
];

const PharmacyPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [cart, setCart] = useState<{medicine: Medicine, quantity: number}[]>([]);

  // Fetch medications from API (using sample data for now)
  const { data: medicines = sampleMedicines, isLoading } = useQuery({
    queryKey: ["/api/medications/available"],
    // If you have an actual API endpoint, use it here
    initialData: sampleMedicines,
  });

  // Filter medications based on search and category
  const filteredMedicines = medicines.filter((medicine: Medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          medicine.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? 
      // This would need to be adjusted based on your actual data model
      medicine.category.toLowerCase() === medicineCategories.find(c => c.id === selectedCategory)?.name.toLowerCase() : 
      true;

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (medicine: Medicine) => {
    const existingItemIndex = cart.findIndex(item => item.medicine.id === medicine.id);

    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, { medicine, quantity: 1 }]);
    }
  };

  const handleOrderNow = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setOrderDialogOpen(true);
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + (item.medicine.price * item.quantity), 0);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16 md:pb-0">
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Medicine Delivery</h1>
          <p className="text-lg opacity-90 mb-6">
            Order medications and get them delivered to your doorstep
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input 
                type="text"
                placeholder="Search for medicines by name or description"
                className="pl-10 bg-white text-gray-900 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <Search className="mr-2" size={18} />
                  Find Nearby Pharmacies
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Nearby Pharmacies</DialogTitle>
                </DialogHeader>
                <PharmacySearch />
              </DialogContent>
            </Dialog>

            <Dialog open={cart.length > 0} onOpenChange={(open) => !open && setCart([])}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap relative" variant="secondary">
                  <ShoppingCart className="mr-2" size={18} />
                  Cart
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Your Cart</DialogTitle>
                </DialogHeader>
                {cart.length > 0 ? (
                  <div>
                    <div className="space-y-4 my-4 max-h-[50vh] overflow-auto">
                      {cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b">
                          <div>
                            <p className="font-medium">{item.medicine.name}</p>
                            <p className="text-sm text-gray-500">{item.medicine.dosage}</p>
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm mr-4">Qty: {item.quantity}</p>
                            <p className="font-medium">${(item.medicine.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-4">
                      <p className="font-semibold">Total</p>
                      <p className="font-bold text-lg">${calculateCartTotal().toFixed(2)}</p>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setCart([])}>
                        Clear Cart
                      </Button>
                      <Button onClick={() => setOrderDialogOpen(true)}>
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="mx-auto mb-4 text-gray-400" size={48} />
                    <p>Your cart is empty</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <i className="ri-shopping-bag-line mr-2"></i>
                  Order Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Complete Your Order</DialogTitle>
                </DialogHeader>
                <OrderForm 
                  medicines={selectedMedicine ? [{ medicine: selectedMedicine, quantity: 1 }] : cart}
                  onSuccess={() => {
                    setOrderDialogOpen(false);
                    setCart([]);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Medicines</TabsTrigger>
            <TabsTrigger value="prescription">Prescription Medicines</TabsTrigger>
            <TabsTrigger value="otc">Over-the-Counter</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {medicineCategories.map((category) => (
                <Card 
                  key={category.id} 
                  className={`cursor-pointer ${selectedCategory === category.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <i className={`${category.icon} text-2xl mb-2 text-primary`}></i>
                    <p className="text-sm font-medium">{category.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="prescription">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <i className="ri-prescription-line text-blue-600 text-xl mr-3 mt-1"></i>
                <div>
                  <h3 className="font-medium text-blue-800">Prescription Required</h3>
                  <p className="text-sm text-blue-700">
                    These medications require a valid prescription. You can upload your prescription during checkout.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="otc">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <i className="ri-shopping-basket-line text-green-600 text-xl mr-3 mt-1"></i>
                <div>
                  <h3 className="font-medium text-green-800">No Prescription Needed</h3>
                  <p className="text-sm text-green-700">
                    These medications can be purchased without a prescription. Always follow recommended dosage instructions.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredMedicines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine: Medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                onAddToCart={() => handleAddToCart(medicine)}
                onOrderNow={() => handleOrderNow(medicine)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <i className="ri-search-line text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-medium mb-2">No medicines found</h3>
              <p className="text-gray-500 text-center max-w-md">
                We couldn't find any medicines matching your criteria. Try adjusting your filters or search query.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Why choose MyHealth360 Pharmacy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                <i className="ri-truck-line text-2xl text-primary"></i>
              </div>
              <div>
                <h3 className="font-medium mb-1">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Medicines delivered to your doorstep within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                <i className="ri-shield-check-line text-2xl text-primary"></i>
              </div>
              <div>
                <h3 className="font-medium mb-1">Genuine Medicines</h3>
                <p className="text-sm text-gray-600">100% authentic medicines from licensed vendors</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                <i className="ri-price-tag-3-line text-2xl text-primary"></i>
              </div>
              <div>
                <h3 className="font-medium mb-1">Cost Savings</h3>
                <p className="text-sm text-gray-600">Up to 20% lower prices compared to retail pharmacies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyPage;
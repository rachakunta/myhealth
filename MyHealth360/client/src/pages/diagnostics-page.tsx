import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, MapPin } from "lucide-react";
import LabTestCard from "@/components/diagnostics/LabTestCard";
import LabTestBookingForm from "@/components/diagnostics/LabTestBookingForm";

// Types for lab tests
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

// Sample categories for lab tests
const testCategories = [
  { id: 1, name: "Complete Health", icon: "ri-heart-pulse-line" },
  { id: 2, name: "Diabetes", icon: "ri-drop-line" },
  { id: 3, name: "Thyroid", icon: "ri-vip-diamond-line" },
  { id: 4, name: "Liver Function", icon: "ri-lungs-line" },
  { id: 5, name: "Kidney Function", icon: "ri-capsule-line" },
  { id: 6, name: "Covid-19", icon: "ri-virus-line" },
  { id: 7, name: "Women's Health", icon: "ri-women-line" },
  { id: 8, name: "Men's Health", icon: "ri-men-line" }
];

// Sample tests
const sampleTests: LabTest[] = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    description: "Measures various components of the blood including red and white blood cells, hemoglobin and platelets.",
    price: 25,
    duration: "24 hours",
    preparationNeeded: false,
    homeCollection: true
  },
  {
    id: 2,
    name: "Comprehensive Metabolic Panel",
    description: "Assess kidney and liver function, electrolyte and acid/base balance, blood glucose, and blood proteins.",
    price: 35,
    duration: "24 hours",
    preparationNeeded: true,
    preparationInstructions: "Fast for 8-12 hours before the test",
    homeCollection: true
  },
  {
    id: 3,
    name: "Lipid Profile",
    description: "Measures the amount of cholesterol and fats in your blood.",
    price: 30,
    duration: "24 hours",
    preparationNeeded: true,
    preparationInstructions: "Fast for 8-12 hours before the test",
    homeCollection: true
  },
  {
    id: 4,
    name: "Thyroid Function Test",
    description: "Assesses thyroid function by measuring levels of TSH, T3, and T4 hormones.",
    price: 40,
    duration: "48 hours",
    preparationNeeded: false,
    homeCollection: true
  },
  {
    id: 5,
    name: "HbA1c Test",
    description: "Measures your average blood glucose levels over the past 2-3 months.",
    price: 30,
    duration: "24 hours",
    preparationNeeded: false,
    homeCollection: true
  },
  {
    id: 6,
    name: "Covid-19 PCR Test",
    description: "Detects genetic material from the SARS-CoV-2 virus.",
    price: 80,
    duration: "24 hours",
    preparationNeeded: false,
    homeCollection: true
  }
];

const DiagnosticsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  // Fetch lab tests from API (using sample data for now)
  const { data: labTests = sampleTests, isLoading } = useQuery({
    queryKey: ["/api/lab-tests/available"],
    // If you have an actual API endpoint, use it here
    initialData: sampleTests,
  });

  // Filter tests based on search and category
  const filteredTests = labTests.filter((test: LabTest) => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? 
      // This would need to be adjusted based on your actual data model
      test.id % testCategories.length === selectedCategory % testCategories.length : 
      true;
    
    return matchesSearch && matchesCategory;
  });

  const handleBookTest = (test: LabTest) => {
    setSelectedTest(test);
    setBookingDialogOpen(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16 md:pb-0">
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Diagnostic Lab Tests</h1>
          <p className="text-lg opacity-90 mb-6">
            Book lab tests with home sample collection or visit a center near you
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input 
                type="text"
                placeholder="Search for tests, profiles, or health conditions"
                className="pl-10 bg-white text-gray-900 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>
            
            <Button className="whitespace-nowrap" variant="outline">
              <MapPin className="mr-2" size={18} />
              Find Nearby Centers
            </Button>
            
            <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <i className="ri-test-tube-line mr-2"></i>
                  Book Test
                </Button>
              </DialogTrigger>
              {selectedTest && (
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Book {selectedTest.name}</DialogTitle>
                  </DialogHeader>
                  <LabTestBookingForm 
                    test={selectedTest} 
                    onSuccess={() => setBookingDialogOpen(false)}
                  />
                </DialogContent>
              )}
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="category" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="packages">Health Packages</TabsTrigger>
            <TabsTrigger value="popular">Popular Tests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="category">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {testCategories.map((category) => (
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
          
          <TabsContent value="packages">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { name: "Complete Health Checkup", tests: 35, price: 99, popular: true },
                { name: "Diabetes Care Package", tests: 15, price: 49, popular: false },
                { name: "Senior Citizen Package", tests: 40, price: 129, popular: false }
              ].map((pkg, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6 flex flex-col h-full">
                    {pkg.popular && (
                      <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1">
                        Popular
                      </div>
                    )}
                    <h3 className="font-semibold text-lg mb-2">{pkg.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">Includes {pkg.tests} essential tests</p>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="font-bold text-xl">${pkg.price}</p>
                      <Button variant="outline" onClick={() => {}}>View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="popular">
            <div className="space-y-2 mb-8">
              {["Full Body Checkup", "Liver Function Test", "Thyroid Profile", "Covid-19 Antibody", "Vitamin D & B12"].map((test, index) => (
                <Card key={index} className="cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="ri-test-tube-fill text-primary mr-3"></i>
                      <p className="font-medium">{test}</p>
                    </div>
                    <i className="ri-arrow-right-line"></i>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
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
        ) : filteredTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTests.map((test: LabTest) => (
              <LabTestCard
                key={test.id}
                test={test}
                onBookTest={() => handleBookTest(test)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <i className="ri-search-line text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-medium mb-2">No tests found</h3>
              <p className="text-gray-500 text-center max-w-md">
                We couldn't find any tests matching your criteria. Try adjusting your filters or search query.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Why choose MyHealth360 diagnostics?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                <i className="ri-home-heart-line text-2xl text-primary"></i>
              </div>
              <div>
                <h3 className="font-medium mb-1">Home Collection</h3>
                <p className="text-sm text-gray-600">Samples collected from the comfort of your home</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                <i className="ri-award-line text-2xl text-primary"></i>
              </div>
              <div>
                <h3 className="font-medium mb-1">Certified Labs</h3>
                <p className="text-sm text-gray-600">All tests conducted at accredited laboratory facilities</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                <i className="ri-file-list-3-line text-2xl text-primary"></i>
              </div>
              <div>
                <h3 className="font-medium mb-1">Digital Reports</h3>
                <p className="text-sm text-gray-600">Get your results online with detailed doctor's analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsPage;

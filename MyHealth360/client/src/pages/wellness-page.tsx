import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import ResourceCard from "@/components/wellness/ResourceCard";

// Types for wellness resources
interface WellnessResource {
  id: number;
  title: string;
  type: string;
  description: string;
  duration: string;
  thumbnailUrl?: string;
  url?: string;
}

// Sample wellness resource categories
const resourceCategories = [
  { id: 1, name: "Meditation", icon: "ri-mental-health-line" },
  { id: 2, name: "Breathing", icon: "ri-lungs-line" },
  { id: 3, name: "Sleep", icon: "ri-moon-line" },
  { id: 4, name: "Stress Relief", icon: "ri-psychology-line" },
  { id: 5, name: "Yoga", icon: "ri-yoga-line" },
  { id: 6, name: "Nutrition", icon: "ri-restaurant-line" },
  { id: 7, name: "Exercise", icon: "ri-run-line" },
  { id: 8, name: "Reading", icon: "ri-book-read-line" }
];

// Sample wellness resources
const sampleResources: WellnessResource[] = [
  {
    id: 1,
    title: "Guided Meditation for Anxiety",
    type: "Meditation",
    description: "A calming guided meditation to help reduce anxiety and stress.",
    duration: "10 min",
  },
  {
    id: 2,
    title: "Deep Breathing Exercise",
    type: "Breathing",
    description: "Simple breathing techniques to calm the mind and reduce stress.",
    duration: "5 min",
  },
  {
    id: 3,
    title: "Calming Nature Sounds",
    type: "Sleep",
    description: "Soothing natural sounds to help you relax and fall asleep.",
    duration: "30 min",
  },
  {
    id: 4,
    title: "Mindfulness Tips for Daily Life",
    type: "Reading",
    description: "Quick tips on practicing mindfulness in your daily life.",
    duration: "3 min read",
  },
  {
    id: 5,
    title: "Gentle Yoga for Beginners",
    type: "Yoga",
    description: "Easy yoga poses for beginners to improve flexibility and mindfulness.",
    duration: "15 min",
  },
  {
    id: 6,
    title: "Stress Relief Visualization",
    type: "Stress Relief",
    description: "Guided visualization to help release tension and stress from your body and mind.",
    duration: "8 min",
  },
  {
    id: 7,
    title: "Healthy Eating Habits",
    type: "Nutrition",
    description: "Learn about balanced nutrition and develop healthier eating habits.",
    duration: "5 min read",
  },
  {
    id: 8,
    title: "Quick Home Workout",
    type: "Exercise",
    description: "Simple exercises you can do at home without equipment.",
    duration: "12 min",
  }
];

const WellnessPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [moodFilter, setMoodFilter] = useState<string | null>(null);

  // Fetch wellness resources from API
  const { data: resources = sampleResources, isLoading } = useQuery({
    queryKey: ["/api/mental-wellness-resources"],
    initialData: sampleResources,
  });

  // Filter resources based on search, category, and mood
  const filteredResources = resources.filter((resource: WellnessResource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? 
      resource.type.toLowerCase() === resourceCategories.find(c => c.id === selectedCategory)?.name.toLowerCase() : 
      true;
    
    // You would implement mood-based filtering with a real API
    const matchesMood = moodFilter ? 
      (moodFilter === "Happy" && ["Meditation", "Exercise"].includes(resource.type)) ||
      (moodFilter === "Neutral" && ["Breathing", "Yoga"].includes(resource.type)) ||
      (moodFilter === "Sad" && ["Sleep", "Stress Relief"].includes(resource.type)) : 
      true;
    
    return matchesSearch && matchesCategory && matchesMood;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-16 md:pb-0">
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Mental Wellness Resources</h1>
          <p className="text-lg opacity-90 mb-6">
            Access resources and programs for mental wellness, nutrition, and fitness
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input 
                type="text"
                placeholder="Search for wellness resources"
                className="pl-10 bg-white text-gray-900 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">Filter by mood:</span>
              <div className="flex space-x-1">
                <button 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    moodFilter === "Happy" 
                      ? "bg-white text-primary" 
                      : "bg-primary-dark bg-opacity-30 text-white"
                  }`}
                  onClick={() => setMoodFilter(moodFilter === "Happy" ? null : "Happy")}
                >
                  😊
                </button>
                <button 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    moodFilter === "Neutral" 
                      ? "bg-white text-primary" 
                      : "bg-primary-dark bg-opacity-30 text-white"
                  }`}
                  onClick={() => setMoodFilter(moodFilter === "Neutral" ? null : "Neutral")}
                >
                  😐
                </button>
                <button 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    moodFilter === "Sad" 
                      ? "bg-white text-primary" 
                      : "bg-primary-dark bg-opacity-30 text-white"
                  }`}
                  onClick={() => setMoodFilter(moodFilter === "Sad" ? null : "Sad")}
                >
                  😔
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="stress">Stress Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {resourceCategories.map((category) => (
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
          
          <TabsContent value="meditation">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <i className="ri-mental-health-line text-blue-600 text-xl mr-3 mt-1"></i>
                <div>
                  <h3 className="font-medium text-blue-800">Meditation Benefits</h3>
                  <p className="text-sm text-blue-700">
                    Regular meditation can reduce stress, improve focus, and enhance overall well-being.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sleep">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <i className="ri-moon-line text-indigo-600 text-xl mr-3 mt-1"></i>
                <div>
                  <h3 className="font-medium text-indigo-800">Better Sleep</h3>
                  <p className="text-sm text-indigo-700">
                    Improve your sleep quality with calming sounds, bedtime routines, and relaxation techniques.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stress">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <i className="ri-psychology-line text-purple-600 text-xl mr-3 mt-1"></i>
                <div>
                  <h3 className="font-medium text-purple-800">Stress Management</h3>
                  <p className="text-sm text-purple-700">
                    Learn effective techniques to manage stress and anxiety in your daily life.
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
                <CardContent className="p-0">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource: WellnessResource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <i className="ri-search-line text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-medium mb-2">No resources found</h3>
              <p className="text-gray-500 text-center max-w-md">
                We couldn't find any wellness resources matching your criteria. Try adjusting your filters or search query.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Wellness Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="h-40 bg-blue-500"></div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">30-Day Mindfulness Challenge</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Build a daily mindfulness practice with guided exercises and trackers.
                </p>
                <Button className="w-full">Join Challenge</Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-40 bg-green-500"></div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Stress Reduction Course</h3>
                <p className="text-gray-600 text-sm mb-4">
                  A 6-week program to learn effective stress management techniques.
                </p>
                <Button className="w-full">Enroll Now</Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-40 bg-purple-500"></div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Better Sleep Program</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Improve your sleep quality with science-backed methods and tracking.
                </p>
                <Button className="w-full">Get Started</Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-12 bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Connect with Mental Health Professionals</h2>
          <p className="text-gray-600 mb-6">
            Sometimes self-help resources aren't enough. Connect with licensed therapists and counselors through our secure platform.
          </p>
          <Button>
            Book Mental Health Consultation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WellnessPage;

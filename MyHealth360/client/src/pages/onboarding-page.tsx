import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronLeft, ChevronRight, Heart, Activity, Calendar, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  // Redirect to dashboard if user has already completed onboarding
  useEffect(() => {
    if (user?.onboardingCompleted) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompleted([...completed, currentStep]);
      setCurrentStep(currentStep + 1);
    } else {
      finishOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const finishOnboarding = async () => {
    try {
      // Update user profile to mark onboarding as completed
      await apiRequest('PATCH', '/api/user/onboarding', { onboardingCompleted: true });
      navigate("/");
    } catch (error) {
      console.error("Failed to update onboarding status:", error);
      navigate("/");
    }
  };
  
  const handleSkip = () => {
    navigate("/");
  };

  // Define the onboarding steps
  const steps: TimelineStep[] = [
    {
      id: 1,
      title: "Welcome to MyHealth360",
      description: "Your integrated healthcare journey begins here",
      icon: <Heart className="h-6 w-6 text-primary" />,
      content: (
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <img 
              src="/assets/onboarding-welcome.svg" 
              alt="Welcome" 
              className="h-48 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-center mb-2">Welcome to Your Health Journey</h2>
            <p className="text-neutral-600 max-w-md mx-auto">
              MyHealth360 brings together all your healthcare needs in one place.
              Let's set up your personalized health profile to get the most out of your experience.
            </p>
          </motion.div>
        </div>
      )
    },
    {
      id: 2,
      title: "Health Profile",
      description: "Let's customize your experience",
      icon: <Activity className="h-6 w-6 text-primary" />,
      content: (
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4">Tell us about yourself</h2>
            <p className="text-neutral-600 mb-6">
              This information helps us personalize your healthcare recommendations 
              and track your health journey effectively.
            </p>
            
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Height</label>
                  <div className="flex">
                    <input type="text" className="w-full rounded-l-md border p-2" placeholder="5'10&quot;" />
                    <span className="bg-neutral-100 border border-l-0 rounded-r-md px-3 flex items-center text-neutral-600">
                      ft/in
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weight</label>
                  <div className="flex">
                    <input type="text" className="w-full rounded-l-md border p-2" placeholder="165" />
                    <span className="bg-neutral-100 border border-l-0 rounded-r-md px-3 flex items-center text-neutral-600">
                      lbs
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Health Goals (select all that apply)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {['Weight management', 'Stress reduction', 'Better sleep', 'Exercise regularly', 'Manage chronic conditions', 'Preventive care'].map((goal) => (
                    <div key={goal} className="flex items-center">
                      <input type="checkbox" id={goal.replace(/\s+/g, '-').toLowerCase()} className="mr-2" />
                      <label htmlFor={goal.replace(/\s+/g, '-').toLowerCase()}>{goal}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      id: 3,
      title: "Health Timeline",
      description: "Map out your health journey",
      icon: <Calendar className="h-6 w-6 text-primary" />,
      content: (
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4">Your Health Timeline</h2>
            <p className="text-neutral-600 mb-6">
              Mark important health milestones to create your personalized health journey.
            </p>
            
            <div className="relative pb-12">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200"></div>
              
              {[
                { year: "2023", event: "Annual Physical", date: "May 15", details: "All results normal" },
                { year: "2022", event: "Sprained Ankle", date: "November 3", details: "Physical therapy completed" },
                { year: "2021", event: "COVID-19 Vaccination", date: "March 22", details: "Both doses received" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                  className="ml-10 relative mb-8"
                >
                  <div className="absolute -left-10 mt-1.5">
                    <div className="h-8 w-8 rounded-full border-2 border-primary bg-white flex items-center justify-center">
                      {index === 0 ? (
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                      ) : (
                        <div className="h-3 w-3 rounded-full bg-neutral-300"></div>
                      )}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{item.event}</h3>
                      <span className="text-sm bg-neutral-100 px-2 py-1 rounded-full">{item.year}</span>
                    </div>
                    <p className="text-sm text-neutral-600">{item.date}</p>
                    <p className="text-sm mt-2">{item.details}</p>
                  </div>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <Button variant="outline" className="flex items-center">
                  <span>Add Health Event</span>
                  <Plus className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      id: 4,
      title: "All Set!",
      description: "You're ready to go",
      icon: <Check className="h-6 w-6 text-primary" />,
      content: (
        <div className="space-y-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
            <p className="text-neutral-600 max-w-md mx-auto mb-8">
              Your health profile is complete and your journey is ready to begin.
              Explore the MyHealth360 platform to start managing your healthcare in one place.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { 
                  title: "Access Virtual Care", 
                  description: "Connect with healthcare professionals via telemedicine",
                  icon: <VideoIcon className="h-8 w-8 text-primary mb-2" />
                },
                { 
                  title: "Track Health Metrics", 
                  description: "Monitor your vital stats and health progress",
                  icon: <ActivityIcon className="h-8 w-8 text-primary mb-2" />
                },
                { 
                  title: "Manage Medications", 
                  description: "Keep track of prescriptions and get timely reminders",
                  icon: <PillIcon className="h-8 w-8 text-primary mb-2" />
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  className="border rounded-lg p-4 text-center"
                >
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-neutral-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-primary">MyHealth360</div>
            <Button variant="ghost" onClick={handleSkip}>Skip</Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto w-full">
          {/* Progress bar */}
          <div className="mb-8">
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
            <div className="mt-4 flex justify-between">
              {steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`flex flex-col items-center relative ${
                    index < steps.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === index
                        ? 'bg-primary text-white' 
                        : completed.includes(index)
                        ? 'bg-primary/20 text-primary'
                        : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    {completed.includes(index) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <p className={`text-xs font-medium ${
                      currentStep === index ? 'text-primary' : 'text-neutral-600'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Card className="border shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {steps[currentStep].content}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
          
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              className="flex items-center"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep === steps.length - 1 ? (
                <ArrowRight className="ml-2 h-4 w-4" />
              ) : (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Additional icons for the completion step
function VideoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M22 9L18 12L22 15V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PillIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10.5 19.5L4.5 13.5C2.5 11.5 2.5 8.5 4.5 6.5C6.5 4.5 9.5 4.5 11.5 6.5L17.5 12.5C19.5 14.5 19.5 17.5 17.5 19.5C15.5 21.5 12.5 21.5 10.5 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
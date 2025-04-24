import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Heart, Brain, Activity, Award, X, RefreshCw, ChevronRight, ChevronLeft } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { HealthMetrics } from "@shared/schema";

// Avatar animations
const avatarVariants = {
  idle: {
    rotate: [0, 2, 0, -2, 0],
    y: [0, -5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "loop" as const,
    },
  },
  talking: {
    rotate: [0, 1, 0, -1, 0],
    scale: [1, 1.05, 1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop" as const,
    },
  },
  excited: {
    rotate: [0, 5, 0, -5, 0],
    scale: [1, 1.1, 1, 1.1, 1],
    y: [0, -10, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "loop" as const,
    },
  },
  thinking: {
    rotate: [0, 3, 0],
    scale: [1, 0.95, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const,
    },
  },
};

interface HealthAvatarProps {
  userName?: string;
}

// Types for the AI response
interface HealthRiskAssessment {
  overallRiskScore: number;
  topRisks: {
    name: string;
    description: string;
    riskLevel: string;
    preventionTips: string[];
  }[];
  summary: string;
}

interface WellnessTips {
  dailyTip: {
    title: string;
    description: string;
  };
  recommendations: {
    category: string;
    title: string;
    details: string;
  }[];
  message: string;
}

export function HealthAvatar({ userName = "there" }: HealthAvatarProps) {
  const { toast } = useToast();
  const [avatarState, setAvatarState] = useState<"idle" | "talking" | "excited" | "thinking">("idle");
  const [showTipCard, setShowTipCard] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState(0);

  // Fetch user's latest health metrics
  const { data: healthMetrics } = useQuery<HealthMetrics>({
    queryKey: ["/api/health-metrics/latest"],
  });

  // Fetch personalized wellness tips
  const { data: wellnessTips, isLoading: isLoadingTips, isError: tipsError } = useQuery<WellnessTips>({
    queryKey: ["/api/health/wellness-tips"],
    queryFn: async () => {
      const res = await apiRequest("POST", "/api/health/wellness-tips", {
        preferences: { focus: "general" }
      });
      return await res.json();
    },
    enabled: !!healthMetrics, // Only run if health metrics are available
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });

  // Fetch health risk assessment
  const { data: riskAssessment, isLoading: isLoadingRisks, isError: risksError } = useQuery<HealthRiskAssessment>({
    queryKey: ["/api/health/risk-prediction"],
    queryFn: async () => {
      const res = await apiRequest("POST", "/api/health/risk-prediction", {});
      return await res.json();
    },
    enabled: !!healthMetrics, // Only run if health metrics are available
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });

  // Generate new wellness tips
  const regenerateTipsMutation = useMutation({
    mutationFn: async (preferences: any) => {
      const res = await apiRequest("POST", "/api/health/wellness-tips", { preferences });
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/health/wellness-tips"], data);
      toast({
        title: "New wellness tips generated!",
        description: "Your personalized health recommendations have been refreshed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to generate new tips",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (isLoadingTips || isLoadingRisks) {
      setAvatarState("thinking");
    } else if (showTipCard) {
      setAvatarState("talking");
    } else {
      setAvatarState("idle");
    }
  }, [isLoadingTips, isLoadingRisks, showTipCard]);

  const handleRegenerateTips = () => {
    regenerateTipsMutation.mutate({ focus: "general" });
    setAvatarState("thinking");
  };

  const nextRecommendation = () => {
    if (wellnessTips && currentRecommendation < wellnessTips.recommendations.length - 1) {
      setCurrentRecommendation(currentRecommendation + 1);
    }
  };

  const prevRecommendation = () => {
    if (currentRecommendation > 0) {
      setCurrentRecommendation(currentRecommendation - 1);
    }
  };

  // Placeholder avatar - in a real app, this would be a more sophisticated avatar
  const renderAvatar = () => (
    <motion.div
      className="bg-primary/10 rounded-full w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center"
      variants={avatarVariants}
      animate={avatarState}
    >
      <div className="relative">
        {/* Face */}
        <div className="rounded-full bg-yellow-100 w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="flex space-x-5 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-800"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-gray-800"></div>
          </div>
          {/* Mouth */}
          <div className={`mt-2 ${avatarState === "talking" ? "w-5 h-3 bg-gray-800 rounded-full" : "w-6 h-1 bg-gray-800 rounded-full"}`}></div>
        </div>
        {/* Stethoscope */}
        <div className="absolute -right-2 -top-2">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-blue-300"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Loading state
  if (!healthMetrics) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Health Assistant</CardTitle>
          <CardDescription>
            Add your health data to get personalized insights
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {renderAvatar()}
          <p className="mt-4 text-center">
            Please add your health metrics in the Health Data section to unlock personalized recommendations.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline" onClick={() => window.location.href = "/health-data"}>
            Add Health Data
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Your Health Assistant</CardTitle>
            {showTipCard && (
              <Button variant="ghost" size="icon" onClick={() => setShowTipCard(false)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CardDescription>
            Personalized wellness tips and health insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div 
              className="cursor-pointer hover:scale-105 transition-transform" 
              onClick={() => setShowTipCard(!showTipCard)}
            >
              {renderAvatar()}
            </div>
            <AnimatePresence>
              {!showTipCard && (
                <motion.div 
                  className="mt-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="font-medium">Hi {userName}!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click on me for personalized health insights
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <AnimatePresence>
            {showTipCard && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <Tabs defaultValue="tips">
                  <TabsList className="w-full">
                    <TabsTrigger value="tips" className="flex-1">Wellness Tips</TabsTrigger>
                    <TabsTrigger value="risks" className="flex-1">Health Risks</TabsTrigger>
                  </TabsList>

                  {/* Wellness Tips Tab */}
                  <TabsContent value="tips" className="mt-4">
                    {isLoadingTips ? (
                      <div className="text-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2">Analyzing your health data...</p>
                      </div>
                    ) : tipsError ? (
                      <div className="text-center py-6">
                        <p>Sorry, we couldn't generate your wellness tips right now.</p>
                        <Button onClick={handleRegenerateTips} className="mt-2" variant="outline" size="sm">
                          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                        </Button>
                      </div>
                    ) : wellnessTips ? (
                      <div>
                        {/* Daily Tip */}
                        <div className="bg-primary/10 p-4 rounded-lg mb-4">
                          <div className="flex items-start">
                            <Lightbulb className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <h3 className="text-sm font-medium">{wellnessTips.dailyTip.title}</h3>
                              <p className="text-sm mt-1">{wellnessTips.dailyTip.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div className="border rounded-lg p-4 relative">
                          {wellnessTips.recommendations.length > 1 && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
                                onClick={prevRecommendation}
                                disabled={currentRecommendation === 0}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                                onClick={nextRecommendation}
                                disabled={currentRecommendation === wellnessTips.recommendations.length - 1}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {wellnessTips.recommendations.map((rec, idx) => (
                            <div 
                              key={idx}
                              className={`transition-opacity duration-300 ${idx === currentRecommendation ? 'opacity-100' : 'hidden opacity-0'}`}
                            >
                              <div className="flex items-start">
                                {rec.category === "Physical" && <Activity className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />}
                                {rec.category === "Mental" && <Brain className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />}
                                {rec.category === "Nutrition" && <Award className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />}
                                {rec.category === "Emotional" && <Heart className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />}
                                {!["Physical", "Mental", "Nutrition", "Emotional"].includes(rec.category) && 
                                  <Lightbulb className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                                }
                                <div>
                                  <h3 className="text-sm font-medium">{rec.title}</h3>
                                  <p className="text-sm mt-1">{rec.details}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Pagination indicator */}
                          {wellnessTips.recommendations.length > 1 && (
                            <div className="flex justify-center mt-4 space-x-1">
                              {wellnessTips.recommendations.map((_, idx) => (
                                <div 
                                  key={idx} 
                                  className={`h-1.5 rounded-full ${idx === currentRecommendation ? 'w-4 bg-primary' : 'w-1.5 bg-gray-300'}`}
                                ></div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Personal message */}
                        <p className="text-sm italic text-center mt-4">{wellnessTips.message}</p>
                      </div>
                    ) : null}
                  </TabsContent>

                  {/* Health Risks Tab */}
                  <TabsContent value="risks" className="mt-4">
                    {isLoadingRisks ? (
                      <div className="text-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2">Analyzing your health risks...</p>
                      </div>
                    ) : risksError ? (
                      <div className="text-center py-6">
                        <p>Sorry, we couldn't generate your health risk assessment right now.</p>
                        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/health/risk-prediction"] })} className="mt-2" variant="outline" size="sm">
                          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                        </Button>
                      </div>
                    ) : riskAssessment ? (
                      <div>
                        {/* Overall risk score */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-sm font-medium">Overall Health Risk</h3>
                            <p className="text-sm text-muted-foreground">Based on your health metrics</p>
                          </div>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white
                            ${riskAssessment.overallRiskScore < 30 ? 'bg-green-500' : 
                              riskAssessment.overallRiskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'}
                          `}>
                            {riskAssessment.overallRiskScore}
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-primary/10 p-4 rounded-lg mb-4">
                          <p className="text-sm">{riskAssessment.summary}</p>
                        </div>

                        {/* Top Risks */}
                        <h3 className="text-sm font-medium mb-2">Areas to Monitor</h3>
                        {riskAssessment.topRisks.map((risk, idx) => (
                          <div key={idx} className="border rounded-lg p-3 mb-3 last:mb-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{risk.name}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full
                                ${risk.riskLevel === 'Low' ? 'bg-green-100 text-green-800' : 
                                  risk.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                              `}>
                                {risk.riskLevel} Risk
                              </span>
                            </div>
                            <p className="text-sm mt-1 mb-2">{risk.description}</p>
                            <div className="text-xs space-y-1">
                              {risk.preventionTips.map((tip, tipIdx) => (
                                <div key={tipIdx} className="flex items-start">
                                  <div className="w-1 h-1 rounded-full bg-primary mt-1.5 mr-1.5"></div>
                                  <span>{tip}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRegenerateTips}
                    disabled={regenerateTipsMutation.isPending}
                  >
                    <RefreshCw className="mr-2 h-3 w-3" /> 
                    {regenerateTipsMutation.isPending ? "Refreshing..." : "Refresh Tips"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
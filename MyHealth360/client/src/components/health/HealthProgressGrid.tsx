import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HealthMetrics } from "@shared/schema";
import HealthCharacter from "@/components/health/HealthCharacter";
import { Skeleton } from "@/components/ui/skeleton";

const HealthProgressGrid: React.FC = () => {
  // Fetch the latest health metrics
  const { data: latestMetrics, isLoading } = useQuery<HealthMetrics>({
    queryKey: ["/api/health-metrics/latest"],
  });

  // Different characters for each metric
  const characters = {
    heartRate: "heart",
    bloodPressure: "heart",
    bloodGlucose: "energy",
    steps: "runner",
    sleepHours: "moon",
    weight: "scale",
    height: "ruler",
    mentalWellnessScore: "brain"
  };

  // Calculate health scores based on metrics
  const calculateHeartScore = (heartRate: number | null): number => {
    if (!heartRate) return 50; // Default
    // Optimal heart rate is typically 60-100 bpm
    if (heartRate >= 60 && heartRate <= 100) return 100; 
    if (heartRate > 100) {
      return Math.max(0, 100 - (heartRate - 100));
    }
    if (heartRate < 60) {
      return Math.max(0, 100 - (60 - heartRate) * 2);
    }
    return 50;
  };

  const calculateBloodPressureScore = (bp: string | null): number => {
    if (!bp) return 50; // Default
    
    const parts = bp.split('/');
    if (parts.length !== 2) return 50;
    
    const systolic = parseInt(parts[0]);
    const diastolic = parseInt(parts[1]);
    
    // Ideal is around 120/80
    const systolicScore = 100 - Math.min(100, Math.abs(systolic - 120) * 1.5);
    const diastolicScore = 100 - Math.min(100, Math.abs(diastolic - 80) * 2);
    
    return (systolicScore + diastolicScore) / 2;
  };

  const calculateGlucoseScore = (glucose: number | null): number => {
    if (!glucose) return 50; // Default
    // Normal fasting glucose is 70-100 mg/dL
    if (glucose >= 70 && glucose <= 100) return 100;
    if (glucose > 100) {
      return Math.max(0, 100 - (glucose - 100) * 0.5);
    }
    if (glucose < 70) {
      return Math.max(0, 100 - (70 - glucose) * 2);
    }
    return 50;
  };

  const calculateStepsScore = (steps: number | null): number => {
    if (!steps) return 30; // Default is low
    // 10000 steps is often recommended
    return Math.min(100, (steps / 10000) * 100);
  };

  const calculateSleepScore = (hours: number | null): number => {
    if (!hours) return 50; // Default
    // 7-9 hours is recommended
    if (hours >= 7 && hours <= 9) return 100;
    if (hours > 9) {
      return Math.max(0, 100 - (hours - 9) * 15);
    }
    if (hours < 7) {
      return Math.max(0, 100 - (7 - hours) * 20);
    }
    return 50;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number): string => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Render loading skeletons when data is loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-3 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-4">
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
              <Skeleton className="h-2 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // If we don't have metrics data yet, show a prompt to add data
  if (!latestMetrics) {
    return (
      <Card className="col-span-full p-6 text-center">
        <CardTitle className="mb-2">No Health Data Available</CardTitle>
        <CardDescription className="mb-4">
          Track your health metrics to see animated progress widgets
        </CardDescription>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <HealthCharacter type="energy" status="idle" size={120} />
        </motion.div>
      </Card>
    );
  }

  // Calculate scores from latest metrics
  const heartScore = calculateHeartScore(latestMetrics.heartRate);
  const bloodPressureScore = calculateBloodPressureScore(latestMetrics.bloodPressure);
  const glucoseScore = calculateGlucoseScore(latestMetrics.bloodGlucose);
  const stepsScore = calculateStepsScore(latestMetrics.steps);
  const sleepScore = calculateSleepScore(latestMetrics.sleepHours);
  const mentalScore = latestMetrics.mentalWellnessScore ? (latestMetrics.mentalWellnessScore * 10) : 50;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Heart Rate Widget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Heart Rate</CardTitle>
          <CardDescription>
            {latestMetrics.heartRate ? `${latestMetrics.heartRate} bpm` : "Not recorded"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-2">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 2, -2, 0] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <HealthCharacter 
                type={characters.heartRate as any} 
                status={heartScore >= 70 ? "happy" : heartScore >= 40 ? "neutral" : "sad"}
                size={100} 
              />
            </motion.div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between mb-1 text-sm">
              <span>Health Score</span>
              <span className={getScoreColor(heartScore)}>{Math.round(heartScore)}%</span>
            </div>
            <Progress value={heartScore} className={`h-2 ${getProgressColor(heartScore)}`} />
          </div>
        </CardContent>
      </Card>

      {/* Blood Pressure Widget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Blood Pressure</CardTitle>
          <CardDescription>
            {latestMetrics.bloodPressure || "Not recorded"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-2">
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 3, -3, 0] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <HealthCharacter 
                type={characters.bloodPressure as any} 
                status={bloodPressureScore >= 70 ? "happy" : bloodPressureScore >= 40 ? "neutral" : "sad"}
                size={100} 
              />
            </motion.div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between mb-1 text-sm">
              <span>Health Score</span>
              <span className={getScoreColor(bloodPressureScore)}>{Math.round(bloodPressureScore)}%</span>
            </div>
            <Progress value={bloodPressureScore} className={`h-2 ${getProgressColor(bloodPressureScore)}`} />
          </div>
        </CardContent>
      </Card>

      {/* Blood Glucose Widget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Blood Glucose</CardTitle>
          <CardDescription>
            {latestMetrics.bloodGlucose ? `${latestMetrics.bloodGlucose} mg/dL` : "Not recorded"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-2">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <HealthCharacter 
                type={characters.bloodGlucose as any} 
                status={glucoseScore >= 70 ? "happy" : glucoseScore >= 40 ? "neutral" : "sad"}
                size={100} 
              />
            </motion.div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between mb-1 text-sm">
              <span>Health Score</span>
              <span className={getScoreColor(glucoseScore)}>{Math.round(glucoseScore)}%</span>
            </div>
            <Progress value={glucoseScore} className={`h-2 ${getProgressColor(glucoseScore)}`} />
          </div>
        </CardContent>
      </Card>

      {/* Activity Steps Widget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Activity</CardTitle>
          <CardDescription>
            {latestMetrics.steps ? `${latestMetrics.steps} steps` : "Not recorded"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-2">
            <motion.div
              animate={{ 
                x: [0, 10, -10, 0],
                y: [0, -5, 0]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <HealthCharacter 
                type={characters.steps as any} 
                status={stepsScore >= 70 ? "happy" : stepsScore >= 40 ? "neutral" : "sad"}
                size={100} 
              />
            </motion.div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between mb-1 text-sm">
              <span>Health Score</span>
              <span className={getScoreColor(stepsScore)}>{Math.round(stepsScore)}%</span>
            </div>
            <Progress value={stepsScore} className={`h-2 ${getProgressColor(stepsScore)}`} />
          </div>
        </CardContent>
      </Card>

      {/* Sleep Widget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Sleep</CardTitle>
          <CardDescription>
            {latestMetrics.sleepHours ? `${latestMetrics.sleepHours} hours` : "Not recorded"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-2">
            <motion.div
              animate={{ 
                rotate: [0, 3, -3, 0],
                scale: [1, 0.95, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <HealthCharacter 
                type={characters.sleepHours as any} 
                status={sleepScore >= 70 ? "happy" : sleepScore >= 40 ? "neutral" : "sad"}
                size={100} 
              />
            </motion.div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between mb-1 text-sm">
              <span>Health Score</span>
              <span className={getScoreColor(sleepScore)}>{Math.round(sleepScore)}%</span>
            </div>
            <Progress value={sleepScore} className={`h-2 ${getProgressColor(sleepScore)}`} />
          </div>
        </CardContent>
      </Card>

      {/* Mental Wellness Widget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Mental Wellness</CardTitle>
          <CardDescription>
            {latestMetrics.mentalWellnessScore ? `${latestMetrics.mentalWellnessScore}/10` : "Not recorded"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-2">
            <motion.div
              animate={{ 
                y: [0, -3, 0],
                rotate: [0, 5, -5, 0] 
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <HealthCharacter 
                type={characters.mentalWellnessScore as any} 
                status={mentalScore >= 70 ? "happy" : mentalScore >= 40 ? "neutral" : "sad"}
                size={100} 
              />
            </motion.div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between mb-1 text-sm">
              <span>Health Score</span>
              <span className={getScoreColor(mentalScore)}>{Math.round(mentalScore)}%</span>
            </div>
            <Progress value={mentalScore} className={`h-2 ${getProgressColor(mentalScore)}`} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthProgressGrid;
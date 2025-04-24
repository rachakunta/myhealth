import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CharacterAnimation, { CharacterType } from "./CharacterAnimation";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface HealthProgressWidgetProps {
  title: string;
  description?: string;
  characterType: CharacterType;
  value: number;
  previousValue?: number;
  maxValue: number;
  unit?: string;
  threshold?: {
    low: number;
    high: number;
  };
  className?: string;
  color?: string;
  badgeText?: string;
}

export const HealthProgressWidget: React.FC<HealthProgressWidgetProps> = ({
  title,
  description,
  characterType,
  value,
  previousValue,
  maxValue,
  unit = "",
  threshold,
  className = "",
  color = "#FF5757",
  badgeText,
}) => {
  // Calculate percentage for progress bar
  const progressPercentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);
  
  // Determine character animation state based on value
  const [characterState, setCharacterState] = useState<"idle" | "happy" | "celebrate">("idle");
  
  // Determine if current value is in normal range, if thresholds are provided
  const getStatusColor = () => {
    if (!threshold) return "bg-primary";
    
    if (value < threshold.low) return "bg-yellow-500";
    if (value > threshold.high) return "bg-red-500";
    return "bg-green-500";
  };

  // Get trend from previous value
  const getTrend = () => {
    if (!previousValue) return null;
    
    const difference = value - previousValue;
    if (Math.abs(difference) < 0.01) return "neutral";
    return difference > 0 ? "up" : "down";
  };
  
  const trend = getTrend();
  
  // Animate character based on progress
  useEffect(() => {
    if (!previousValue) return;
    
    const difference = value - previousValue;
    if (difference > 0) {
      setCharacterState("celebrate");
    } else if (Math.abs(difference) < 0.01) {
      setCharacterState("idle");
    } else {
      setCharacterState("happy");
    }
    
    const timer = setTimeout(() => {
      setCharacterState("idle");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [value, previousValue]);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {badgeText && (
            <Badge variant="outline" className="ml-2">
              {badgeText}
            </Badge>
          )}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <CharacterAnimation 
              type={characterType} 
              state={characterState} 
              color={color}
              size={40}
              className="mr-3"
            />
            <div className="space-y-1">
              <div className="text-2xl font-bold">
                {value}
                {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
              </div>
              
              {trend && (
                <div className="flex items-center text-sm">
                  {trend === "up" && <ArrowUp className="w-4 h-4 mr-1 text-green-500" />}
                  {trend === "down" && <ArrowDown className="w-4 h-4 mr-1 text-red-500" />}
                  {trend === "neutral" && <Minus className="w-4 h-4 mr-1 text-gray-500" />}
                  
                  <span className={`
                    ${trend === "up" ? "text-green-500" : ""} 
                    ${trend === "down" ? "text-red-500" : ""} 
                    ${trend === "neutral" ? "text-gray-500" : ""}
                  `}>
                    {Math.abs(value - (previousValue || 0)).toFixed(1)} {unit} 
                    {trend === "up" ? " increase" : trend === "down" ? " decrease" : " no change"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="relative pt-1">
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${getStatusColor()}`} 
          />
          
          {threshold && (
            <>
              <motion.div 
                className="absolute h-4 w-0.5 bg-yellow-500 -top-1"
                style={{ left: `${(threshold.low / maxValue) * 100}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
              <motion.div 
                className="absolute h-4 w-0.5 bg-red-500 -top-1"
                style={{ left: `${(threshold.high / maxValue) * 100}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthProgressWidget;
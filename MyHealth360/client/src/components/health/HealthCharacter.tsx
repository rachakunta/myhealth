import React from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Activity, 
  Moon, 
  Droplets, 
  Brain, 
  Scale, 
  Ruler, 
  Footprints 
} from "lucide-react";

type CharacterType = "heart" | "energy" | "moon" | "runner" | "brain" | "scale" | "ruler" | "water";
type CharacterStatus = "happy" | "neutral" | "sad" | "idle";

interface HealthCharacterProps {
  type: CharacterType;
  status: CharacterStatus;
  size?: number;
}

const HealthCharacter: React.FC<HealthCharacterProps> = ({ 
  type, 
  status, 
  size = 80 
}) => {
  // Character color based on status
  const getStatusColor = () => {
    switch (status) {
      case "happy": return "text-green-500";
      case "neutral": return "text-yellow-500";
      case "sad": return "text-red-500";
      case "idle": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  // Background color based on status
  const getBackgroundColor = () => {
    switch (status) {
      case "happy": return "bg-green-100";
      case "neutral": return "bg-yellow-100";
      case "sad": return "bg-red-100";
      case "idle": return "bg-blue-100";
      default: return "bg-gray-100";
    }
  };

  // Get character icon based on type
  const getCharacterIcon = () => {
    switch (type) {
      case "heart": return <Heart size={size * 0.6} />;
      case "energy": return <Activity size={size * 0.6} />;
      case "moon": return <Moon size={size * 0.6} />;
      case "runner": return <Footprints size={size * 0.6} />;
      case "brain": return <Brain size={size * 0.6} />;
      case "scale": return <Scale size={size * 0.6} />;
      case "ruler": return <Ruler size={size * 0.6} />;
      case "water": return <Droplets size={size * 0.6} />;
      default: return <Activity size={size * 0.6} />;
    }
  };

  // Get face expression based on status
  const getFaceExpression = () => {
    switch (status) {
      case "happy":
        return (
          <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="1.5" fill="currentColor" />
            <circle cx="15" cy="9" r="1.5" fill="currentColor" />
            <path d="M9 15C9 15 10 17 12 17C14 17 15 15 15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "neutral":
        return (
          <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="1.5" fill="currentColor" />
            <circle cx="15" cy="9" r="1.5" fill="currentColor" />
            <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "sad":
        return (
          <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="1.5" fill="currentColor" />
            <circle cx="15" cy="9" r="1.5" fill="currentColor" />
            <path d="M9 15C9 15 10 13 12 13C14 13 15 15 15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "idle":
        return (
          <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="1.5" fill="currentColor" />
            <circle cx="15" cy="9" r="1.5" fill="currentColor" />
            <path d="M9 15C9 15 10 15 12 15C14 15 15 15 15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="relative inline-flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Character body */}
      <div 
        className={`rounded-full ${getBackgroundColor()} ${getStatusColor()} flex items-center justify-center`}
        style={{ 
          width: size, 
          height: size,
          transition: "all 0.3s ease"
        }}
      >
        {getCharacterIcon()}
      </div>
      
      {/* Character face */}
      <div 
        className="absolute" 
        style={{ 
          bottom: size * 0.1,
          transition: "all 0.3s ease"
        }}
      >
        {getFaceExpression()}
      </div>
    </div>
  );
};

export default HealthCharacter;
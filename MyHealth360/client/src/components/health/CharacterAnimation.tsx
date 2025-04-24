import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  ActivitySquare, 
  Apple, 
  Dumbbell, 
  Droplets,
  Moon
} from "lucide-react";

// Character states and animations
const characterStates = {
  idle: {
    scale: [1, 1.05, 1],
    transition: {
      repeat: Infinity,
      repeatType: "reverse" as const,
      duration: 2
    }
  },
  happy: {
    rotate: [0, -10, 10, -10, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut"
    }
  },
  celebrate: {
    y: [0, -15, 0],
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

// Character types
export type CharacterType = 
  | "heart" 
  | "activity" 
  | "nutrition" 
  | "strength" 
  | "hydration" 
  | "sleep";

interface CharacterAnimationProps {
  type: CharacterType;
  size?: number;
  state?: keyof typeof characterStates;
  color?: string;
  className?: string;
}

export const CharacterAnimation: React.FC<CharacterAnimationProps> = ({
  type,
  size = 50,
  state = "idle",
  color = "#FF5757", // default character color
  className = "",
}) => {
  const [currentState, setCurrentState] = useState<keyof typeof characterStates>(state);

  // Update animation state when prop changes
  useEffect(() => {
    setCurrentState(state);
    
    // Reset to idle after celebrate or happy animations
    if (state === "celebrate" || state === "happy") {
      const timer = setTimeout(() => {
        setCurrentState("idle");
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [state]);

  const renderCharacter = () => {
    const iconProps = {
      size: size,
      color: color,
      strokeWidth: 2,
    };

    switch (type) {
      case "heart":
        return <Heart {...iconProps} fill={color} fillOpacity={0.4} />;
      case "activity":
        return <ActivitySquare {...iconProps} />;
      case "nutrition":
        return <Apple {...iconProps} />;
      case "strength":
        return <Dumbbell {...iconProps} />;
      case "hydration":
        return <Droplets {...iconProps} fill={color} fillOpacity={0.4} />;
      case "sleep":
        return <Moon {...iconProps} fill={color} fillOpacity={0.4} />;
      default:
        return <Heart {...iconProps} fill={color} fillOpacity={0.4} />;
    }
  };

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      animate={characterStates[currentState]}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {renderCharacter()}
    </motion.div>
  );
};

export default CharacterAnimation;
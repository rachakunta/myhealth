import { useState } from "react";
import { MENTAL_WELLNESS_RESOURCES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";

const moods = [
  { emoji: "😊", label: "Happy", selected: false },
  { emoji: "😐", label: "Neutral", selected: false },
  { emoji: "😔", label: "Sad", selected: false }
];

interface MentalWellnessProps {
  onMoodSelect: (mood: string) => void;
}

const MentalWellness = ({ onMoodSelect }: MentalWellnessProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold">Mental Wellness</h3>
        <button className="text-primary text-sm">View Details</button>
      </div>
      
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-4">
          <i className="ri-mental-health-fill text-2xl text-primary"></i>
        </div>
        <div>
          <p className="font-medium text-lg">Your mood today</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-500">How are you feeling?</span>
            <div className="flex space-x-1">
              {moods.map((mood) => (
                <button 
                  key={mood.label} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedMood === mood.label 
                      ? "bg-primary bg-opacity-10" 
                      : "bg-gray-100"
                  }`}
                  onClick={() => handleMoodSelect(mood.label)}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium text-sm">Recommended for you</h4>
        <div className="grid grid-cols-2 gap-3">
          {MENTAL_WELLNESS_RESOURCES.map((resource, index) => (
            <div 
              key={index} 
              className="p-3 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer"
            >
              <div className="flex items-center mb-2">
                <i className={`${resource.icon} text-primary mr-2`}></i>
                <span className="text-sm font-medium">{resource.title}</span>
              </div>
              <p className="text-xs text-gray-500">{resource.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentalWellness;

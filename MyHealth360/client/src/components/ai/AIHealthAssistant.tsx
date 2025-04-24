import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AI_FEATURES } from "@/lib/constants";
import { Link } from "wouter";

const AIHealthAssistant = () => {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-2">AI-Powered Health Insights</h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Our intelligent system analyzes your health data to provide personalized recommendations and early warnings.
        </p>
        
        <div className="bg-primary bg-opacity-5 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start">
            <div className="rounded-full bg-primary bg-opacity-10 w-14 h-14 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
              <i className="ri-robot-fill text-2xl text-primary"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Your Health Assistant</h3>
              <p className="text-gray-600 mb-4">
                Based on your recent blood pressure readings and sleep patterns, I've noticed some potential concerns. Here are some personalized recommendations:
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <i className="ri-checkbox-circle-line text-green-500 mt-1 mr-2"></i>
                  <p>Consider reducing sodium intake to help manage blood pressure</p>
                </div>
                <div className="flex items-start">
                  <i className="ri-checkbox-circle-line text-green-500 mt-1 mr-2"></i>
                  <p>Try the 10-minute guided sleep meditation in our wellness section</p>
                </div>
                <div className="flex items-start">
                  <i className="ri-checkbox-circle-line text-green-500 mt-1 mr-2"></i>
                  <p>Your next blood pressure check should be within 7 days</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap space-x-3">
                <Button variant="default">
                  View Detailed Analysis
                </Button>
                <Button variant="outline">
                  Ask a Question
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AI_FEATURES.map((feature) => (
            <div key={feature.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <i className={`${feature.icon} text-primary text-xl mr-2`}></i>
                <h3 className="font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              <Link href={feature.link}>
                <div className="text-primary font-medium flex items-center cursor-pointer">
                  Learn More
                  <i className="ri-arrow-right-line ml-1"></i>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIHealthAssistant;

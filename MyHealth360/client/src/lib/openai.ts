import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
if (!process.env.OPENAI_API_KEY) {
  console.error("OpenAI API key not found. Please set OPENAI_API_KEY environment variable.");
}
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

// Generate health risk prediction based on user health data
export async function generateHealthRiskPrediction(healthData: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a healthcare AI specialized in risk assessment. Analyze the provided health metrics and return a JSON response with these fields:" +
            "1. overallRiskScore (number 1-100)" +
            "2. topRisks (array of 2-3 objects with name, description, riskLevel, and preventionTips)" +
            "3. summary (brief paragraph explaining overall assessment)" +
            "Make the assessment medically reasonable but not alarmist. Use clinical terms when appropriate."
        },
        {
          role: "user",
          content: `Please analyze these health metrics and provide a risk assessment: ${JSON.stringify(healthData)}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to generate health risk prediction:", error);
    throw new Error("Failed to generate health risk prediction. Please try again later.");
  }
}

// Generate personalized wellness tips based on user health data and preferences
export async function generateWellnessTips(userData: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a wellness coach AI that provides personalized, practical health tips. Return a JSON response with these fields:" +
            "1. dailyTip (object with title and description)" +
            "2. recommendations (array of 3-5 objects with category, title, and details)" +
            "3. message (encouraging personalized message)" +
            "Make recommendations specific, actionable, and based on the user's health data and preferences."
        },
        {
          role: "user",
          content: `Please generate personalized wellness recommendations based on my data: ${JSON.stringify(userData)}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to generate wellness tips:", error);
    throw new Error("Failed to generate wellness tips. Please try again later.");
  }
}
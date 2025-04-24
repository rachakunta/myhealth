import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import OpenAI from "openai";
import { 
  insertAppointmentSchema, 
  insertMedicationSchema, 
  insertLabTestSchema,
  insertHealthMetricsSchema,
  insertChatSessionSchema,
  insertChatMessageSchema
} from "@shared/schema";

// Initialize OpenAI client
if (!process.env.OPENAI_API_KEY) {
  console.error("OpenAI API key not found. Please set OPENAI_API_KEY environment variable.");
}
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Middleware to check authentication for protected routes
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Doctors API
  app.get("/api/doctors", requireAuth, async (req, res) => {
    try {
      const doctors = await storage.getDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });

  app.get("/api/doctors/:id", requireAuth, async (req, res) => {
    try {
      const doctor = await storage.getDoctor(Number(req.params.id));
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctor" });
    }
  });

  // Appointments API
  app.get("/api/appointments", requireAuth, async (req, res) => {
    try {
      const appointments = await storage.getAppointments(req.user!.id);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.post("/api/appointments", requireAuth, async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  app.put("/api/appointments/:id", requireAuth, async (req, res) => {
    try {
      // First check if the appointment exists and belongs to the user
      const appointment = await storage.getAppointment(Number(req.params.id));
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      if (appointment.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to modify this appointment" });
      }

      const updatedAppointment = await storage.updateAppointment(Number(req.params.id), req.body);
      res.json(updatedAppointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  app.delete("/api/appointments/:id", requireAuth, async (req, res) => {
    try {
      // First check if the appointment exists and belongs to the user
      const appointment = await storage.getAppointment(Number(req.params.id));
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      if (appointment.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to delete this appointment" });
      }

      await storage.deleteAppointment(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });

  // Medications API
  app.get("/api/medications", requireAuth, async (req, res) => {
    try {
      const medications = await storage.getMedications(req.user!.id);
      res.json(medications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medications" });
    }
  });

  app.post("/api/medications", requireAuth, async (req, res) => {
    try {
      const validatedData = insertMedicationSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const medication = await storage.createMedication(validatedData);
      res.status(201).json(medication);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid medication data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create medication" });
    }
  });

  app.put("/api/medications/:id", requireAuth, async (req, res) => {
    try {
      // First check if the medication exists and belongs to the user
      const medication = await storage.getMedication(Number(req.params.id));
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      if (medication.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to modify this medication" });
      }

      const updatedMedication = await storage.updateMedication(Number(req.params.id), req.body);
      res.json(updatedMedication);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid medication data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update medication" });
    }
  });

  app.delete("/api/medications/:id", requireAuth, async (req, res) => {
    try {
      // First check if the medication exists and belongs to the user
      const medication = await storage.getMedication(Number(req.params.id));
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      if (medication.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to delete this medication" });
      }

      await storage.deleteMedication(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete medication" });
    }
  });

  // Lab Tests API
  app.get("/api/lab-tests", requireAuth, async (req, res) => {
    try {
      const labTests = await storage.getLabTests(req.user!.id);
      res.json(labTests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lab tests" });
    }
  });

  app.post("/api/lab-tests", requireAuth, async (req, res) => {
    try {
      const validatedData = insertLabTestSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const labTest = await storage.createLabTest(validatedData);
      res.status(201).json(labTest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid lab test data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create lab test" });
    }
  });

  app.put("/api/lab-tests/:id", requireAuth, async (req, res) => {
    try {
      // First check if the lab test exists and belongs to the user
      const labTest = await storage.getLabTest(Number(req.params.id));
      if (!labTest) {
        return res.status(404).json({ message: "Lab test not found" });
      }
      if (labTest.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to modify this lab test" });
      }

      const updatedLabTest = await storage.updateLabTest(Number(req.params.id), req.body);
      res.json(updatedLabTest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid lab test data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update lab test" });
    }
  });

  // Health Metrics API
  app.get("/api/health-metrics", requireAuth, async (req, res) => {
    try {
      const metrics = await storage.getHealthMetrics(req.user!.id);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health metrics" });
    }
  });

  app.get("/api/health-metrics/latest", requireAuth, async (req, res) => {
    try {
      const metrics = await storage.getLatestHealthMetrics(req.user!.id);
      if (!metrics) {
        return res.status(404).json({ message: "No health metrics found" });
      }
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest health metrics" });
    }
  });

  app.post("/api/health-metrics", requireAuth, async (req, res) => {
    try {
      const validatedData = insertHealthMetricsSchema.parse({
        ...req.body,
        userId: req.user!.id,
        date: new Date(),
      });
      const metrics = await storage.createHealthMetrics(validatedData);
      res.status(201).json(metrics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid health metrics data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create health metrics" });
    }
  });

  // User Profile API
  app.patch("/api/user/onboarding", requireAuth, async (req, res) => {
    try {
      const { onboardingCompleted } = req.body;
      
      if (typeof onboardingCompleted !== 'boolean') {
        return res.status(400).json({ message: "Invalid request data. 'onboardingCompleted' must be a boolean." });
      }
      
      const updatedUser = await storage.updateUser(req.user!.id, { onboardingCompleted });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update onboarding status" });
    }
  });

  // Mental Wellness Resources API
  app.get("/api/mental-wellness-resources", async (req, res) => {
    try {
      const resources = await storage.getMentalWellnessResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mental wellness resources" });
    }
  });

  app.get("/api/mental-wellness-resources/:id", async (req, res) => {
    try {
      const resource = await storage.getMentalWellnessResource(Number(req.params.id));
      if (!resource) {
        return res.status(404).json({ message: "Mental wellness resource not found" });
      }
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mental wellness resource" });
    }
  });

  // Chat Sessions API
  app.get("/api/chat-sessions", requireAuth, async (req, res) => {
    try {
      const sessions = await storage.getChatSessions(req.user!.id);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat sessions" });
    }
  });

  app.get("/api/chat-sessions/:id", requireAuth, async (req, res) => {
    try {
      const session = await storage.getChatSession(Number(req.params.id));
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      
      // Check if user is part of this session
      if (session.userId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have access to this chat session" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat session" });
    }
  });

  app.post("/api/chat-sessions", requireAuth, async (req, res) => {
    try {
      const validatedData = insertChatSessionSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      
      const session = await storage.createChatSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid chat session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create chat session" });
    }
  });

  app.patch("/api/chat-sessions/:id", requireAuth, async (req, res) => {
    try {
      const session = await storage.getChatSession(Number(req.params.id));
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      
      // Check if user is part of this session
      if (session.userId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have access to this chat session" });
      }
      
      const updatedSession = await storage.updateChatSession(Number(req.params.id), req.body);
      res.json(updatedSession);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid chat session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update chat session" });
    }
  });

  // Chat Messages API
  app.get("/api/chat-sessions/:sessionId/messages", requireAuth, async (req, res) => {
    try {
      const session = await storage.getChatSession(Number(req.params.sessionId));
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      
      // Check if user is part of this session
      if (session.userId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have access to these chat messages" });
      }
      
      const messages = await storage.getChatMessages(Number(req.params.sessionId));
      
      // Mark messages as read
      await storage.markMessagesAsRead(Number(req.params.sessionId), req.user!.id);
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat-sessions/:sessionId/messages", requireAuth, async (req, res) => {
    try {
      const session = await storage.getChatSession(Number(req.params.sessionId));
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      
      // Check if user is part of this session
      if (session.userId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have access to this chat session" });
      }
      
      // Determine if message is from a doctor or patient
      const isFromDoctor = false; // User messages are never from doctors
      
      const validatedData = insertChatMessageSchema.parse({
        ...req.body,
        sessionId: Number(req.params.sessionId),
        senderId: req.user!.id,
        receiverId: session.doctorId, // Message is sent to the doctor
        isFromDoctor,
      });
      
      const message = await storage.createChatMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid chat message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create chat message" });
    }
  });

  // AI Health Risk Prediction API
  app.post("/api/health/risk-prediction", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      
      // Get the user's latest health metrics
      const healthMetrics = await storage.getLatestHealthMetrics(userId);
      if (!healthMetrics) {
        return res.status(404).json({ 
          message: "No health metrics found for risk prediction. Please enter your health data first." 
        });
      }

      // Generate risk prediction using OpenAI
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
            content: `Please analyze these health metrics and provide a risk assessment: ${JSON.stringify(healthMetrics)}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      });

      const content = response.choices[0].message.content || '{}';
      const riskPrediction = JSON.parse(content);
      res.json(riskPrediction);
    } catch (error) {
      console.error("AI Health Risk Prediction error:", error);
      res.status(500).json({ message: "Failed to generate health risk prediction" });
    }
  });

  // AI Wellness Tips API
  app.post("/api/health/wellness-tips", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      
      // Get user profile and latest health metrics
      const user = await storage.getUser(userId);
      const healthMetrics = await storage.getLatestHealthMetrics(userId);
      
      if (!user || !healthMetrics) {
        return res.status(404).json({ 
          message: "Insufficient data for personalized wellness tips. Please complete your profile and health data." 
        });
      }

      // Combine user data for personalized wellness tips
      const userData = {
        user: user,
        healthMetrics: healthMetrics,
        preferences: req.body.preferences || {}
      };

      // Generate wellness tips using OpenAI
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
      const wellnessTips = JSON.parse(content);
      res.json(wellnessTips);
    } catch (error) {
      console.error("AI Wellness Tips error:", error);
      res.status(500).json({ message: "Failed to generate wellness tips" });
    }
  });

  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time communication
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active connections mapped to user IDs
  const activeConnections = new Map<number, WebSocket>();
  
  wss.on('connection', (ws, req) => {
    console.log('WebSocket connection established');
    
    // Handle authentication and identify the user
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle authentication
        if (data.type === 'auth') {
          // In a real app, you'd verify the session cookie or token
          // For now, we'll just use the userId directly
          const userId = data.userId;
          
          if (userId) {
            // Map this connection to the user
            activeConnections.set(userId, ws);
            
            // Confirm authentication
            ws.send(JSON.stringify({
              type: 'auth_success',
              message: 'Authenticated successfully'
            }));
            
            console.log(`User ${userId} authenticated on WebSocket`);
          }
        }
        
        // Handle chat messages
        if (data.type === 'chat_message' && data.sessionId && data.content) {
          // Find the chat session
          const session = await storage.getChatSession(Number(data.sessionId));
          if (!session) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Chat session not found'
            }));
            return;
          }
          
          // Determine if the message is from a doctor or a patient
          const userId = data.userId;
          const isFromDoctor = data.isFromDoctor || false;
          
          // Create the message in the database
          const message = await storage.createChatMessage({
            sessionId: Number(data.sessionId),
            content: data.content,
            sentAt: new Date(),
            senderId: userId,
            // If from patient, receiver is doctor; if from doctor, receiver is patient
            receiverId: isFromDoctor ? session.userId : session.doctorId!,
            isFromDoctor,
            readAt: null
          });
          
          // Broadcast to the appropriate recipient
          const recipientId = isFromDoctor ? session.userId : session.doctorId;
          const recipientWs = activeConnections.get(recipientId!);
          
          if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
            recipientWs.send(JSON.stringify({
              type: 'new_message',
              sessionId: data.sessionId,
              message
            }));
          }
          
          // Also confirm back to the sender
          ws.send(JSON.stringify({
            type: 'message_sent',
            message
          }));
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'An error occurred processing your request'
        }));
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      // Remove from active connections
      Array.from(activeConnections.entries()).forEach(([userId, connection]) => {
        if (connection === ws) {
          activeConnections.delete(userId);
          console.log(`User ${userId} disconnected from WebSocket`);
        }
      });
    });
  });

  return httpServer;
}

import { users, doctors, appointments, medications, labTests, healthMetrics, mentalWellnessResources, chatSessions, chatMessages } from "@shared/schema";
import type { 
  User, Doctor, Appointment, Medication, LabTest, HealthMetrics, MentalWellnessResource, ChatSession, ChatMessage,
  InsertUser, InsertDoctor, InsertAppointment, InsertMedication, InsertLabTest, InsertHealthMetrics, InsertMentalWellnessResource,
  InsertChatSession, InsertChatMessage
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { eq, desc, and, asc, isNull } from "drizzle-orm";
import { db, pool } from "./db";
import { IStorage } from "./storage";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
    
    // Initialize mental wellness resources if needed
    this.initializeMentalWellnessResources();
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors);
  }

  async getDoctor(id: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor;
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const [doctor] = await db.insert(doctors).values(insertDoctor).returning();
    return doctor;
  }

  async getAppointments(userId: number): Promise<Appointment[]> {
    return await db.select()
      .from(appointments)
      .where(eq(appointments.userId, userId));
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select()
      .from(appointments)
      .where(eq(appointments.id, id));
    return appointment;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db.insert(appointments)
      .values(insertAppointment)
      .returning();
    return appointment;
  }

  async updateAppointment(id: number, appointmentData: Partial<Appointment>): Promise<Appointment | undefined> {
    const [appointment] = await db.update(appointments)
      .set(appointmentData)
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const result = await db.delete(appointments)
      .where(eq(appointments.id, id))
      .returning();
    return result.length > 0;
  }

  async getMedications(userId: number): Promise<Medication[]> {
    return await db.select()
      .from(medications)
      .where(eq(medications.userId, userId));
  }

  async getMedication(id: number): Promise<Medication | undefined> {
    const [medication] = await db.select()
      .from(medications)
      .where(eq(medications.id, id));
    return medication;
  }

  async createMedication(insertMedication: InsertMedication): Promise<Medication> {
    const [medication] = await db.insert(medications)
      .values(insertMedication)
      .returning();
    return medication;
  }

  async updateMedication(id: number, medicationData: Partial<Medication>): Promise<Medication | undefined> {
    const [medication] = await db.update(medications)
      .set(medicationData)
      .where(eq(medications.id, id))
      .returning();
    return medication;
  }

  async deleteMedication(id: number): Promise<boolean> {
    const result = await db.delete(medications)
      .where(eq(medications.id, id))
      .returning();
    return result.length > 0;
  }

  async getLabTests(userId: number): Promise<LabTest[]> {
    return await db.select()
      .from(labTests)
      .where(eq(labTests.userId, userId));
  }

  async getLabTest(id: number): Promise<LabTest | undefined> {
    const [labTest] = await db.select()
      .from(labTests)
      .where(eq(labTests.id, id));
    return labTest;
  }

  async createLabTest(insertLabTest: InsertLabTest): Promise<LabTest> {
    const [labTest] = await db.insert(labTests)
      .values(insertLabTest)
      .returning();
    return labTest;
  }

  async updateLabTest(id: number, labTestData: Partial<LabTest>): Promise<LabTest | undefined> {
    const [labTest] = await db.update(labTests)
      .set(labTestData)
      .where(eq(labTests.id, id))
      .returning();
    return labTest;
  }

  async getHealthMetrics(userId: number): Promise<HealthMetrics[]> {
    return await db.select()
      .from(healthMetrics)
      .where(eq(healthMetrics.userId, userId))
      .orderBy(desc(healthMetrics.date));
  }

  async getLatestHealthMetrics(userId: number): Promise<HealthMetrics | undefined> {
    const [metric] = await db.select()
      .from(healthMetrics)
      .where(eq(healthMetrics.userId, userId))
      .orderBy(desc(healthMetrics.date))
      .limit(1);
    return metric;
  }

  async createHealthMetrics(insertHealthMetrics: InsertHealthMetrics): Promise<HealthMetrics> {
    const [healthMetric] = await db.insert(healthMetrics)
      .values(insertHealthMetrics)
      .returning();
    return healthMetric;
  }

  async getMentalWellnessResources(): Promise<MentalWellnessResource[]> {
    return await db.select().from(mentalWellnessResources);
  }

  async getMentalWellnessResource(id: number): Promise<MentalWellnessResource | undefined> {
    const [resource] = await db.select()
      .from(mentalWellnessResources)
      .where(eq(mentalWellnessResources.id, id));
    return resource;
  }

  async createMentalWellnessResource(insertResource: InsertMentalWellnessResource): Promise<MentalWellnessResource> {
    const [resource] = await db.insert(mentalWellnessResources)
      .values(insertResource)
      .returning();
    return resource;
  }

  // Chat functionality
  async getChatSessions(userId: number): Promise<ChatSession[]> {
    return await db.select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.startedAt));
  }

  async getChatSession(id: number): Promise<ChatSession | undefined> {
    const [session] = await db.select()
      .from(chatSessions)
      .where(eq(chatSessions.id, id));
    return session;
  }

  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const [chatSession] = await db.insert(chatSessions)
      .values(session)
      .returning();
    return chatSession;
  }

  async updateChatSession(id: number, sessionData: Partial<ChatSession>): Promise<ChatSession | undefined> {
    const [updatedSession] = await db.update(chatSessions)
      .set(sessionData)
      .where(eq(chatSessions.id, id))
      .returning();
    return updatedSession;
  }

  async getChatMessages(sessionId: number): Promise<ChatMessage[]> {
    return await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(asc(chatMessages.sentAt));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db.insert(chatMessages)
      .values(message)
      .returning();
    return chatMessage;
  }

  async markMessagesAsRead(sessionId: number, userId: number): Promise<void> {
    const now = new Date();
    await db
      .update(chatMessages)
      .set({ readAt: now })
      .where(
        and(
          eq(chatMessages.sessionId, sessionId),
          eq(chatMessages.receiverId, userId),
          isNull(chatMessages.readAt)
        )
      );
  }

  private async initializeMentalWellnessResources() {
    // Check if we need to seed initial data
    const existingResources = await db.select().from(mentalWellnessResources);
    
    if (existingResources.length === 0) {
      const resources: InsertMentalWellnessResource[] = [
        {
          title: "Guided Meditation for Anxiety",
          type: "Meditation",
          description: "A calming guided meditation to help reduce anxiety and stress.",
          duration: "10 min",
        },
        {
          title: "Deep Breathing Exercise",
          type: "Breathing",
          description: "Simple breathing techniques to calm the mind and reduce stress.",
          duration: "5 min",
        },
        {
          title: "Calming Nature Sounds",
          type: "Sleep",
          description: "Soothing natural sounds to help you relax and fall asleep.",
          duration: "30 min",
        },
        {
          title: "Mindfulness Tips for Daily Life",
          type: "Reading",
          description: "Quick tips on practicing mindfulness in your daily life.",
          duration: "3 min read",
        },
        {
          title: "Gentle Yoga for Beginners",
          type: "Yoga",
          description: "Easy yoga poses for beginners to improve flexibility and mindfulness.",
          duration: "15 min",
        },
        {
          title: "Stress Relief Visualization",
          type: "Stress Relief",
          description: "Guided visualization to help release tension and stress from your body and mind.",
          duration: "8 min",
        },
        {
          title: "Healthy Eating Habits",
          type: "Nutrition",
          description: "Learn about balanced nutrition and develop healthier eating habits.",
          duration: "5 min read",
        },
        {
          title: "Quick Home Workout",
          type: "Exercise",
          description: "Simple exercises you can do at home without equipment.",
          duration: "12 min",
        }
      ];

      for (const resource of resources) {
        await this.createMentalWellnessResource(resource);
      }
    }
  }
}
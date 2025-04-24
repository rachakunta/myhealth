import { 
  users, doctors, appointments, medications, labTests, 
  healthMetrics, mentalWellnessResources, chatSessions, chatMessages 
} from "@shared/schema";
import type { 
  User, Doctor, Appointment, Medication, LabTest, HealthMetrics, MentalWellnessResource, 
  ChatSession, ChatMessage, InsertUser, InsertDoctor, InsertAppointment, InsertMedication, 
  InsertLabTest, InsertHealthMetrics, InsertMentalWellnessResource, 
  InsertChatSession, InsertChatMessage 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Doctors
  getDoctors(): Promise<Doctor[]>;
  getDoctor(id: number): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;

  // Appointments
  getAppointments(userId: number): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;

  // Medications
  getMedications(userId: number): Promise<Medication[]>;
  getMedication(id: number): Promise<Medication | undefined>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  updateMedication(id: number, medication: Partial<Medication>): Promise<Medication | undefined>;
  deleteMedication(id: number): Promise<boolean>;

  // Lab Tests
  getLabTests(userId: number): Promise<LabTest[]>;
  getLabTest(id: number): Promise<LabTest | undefined>;
  createLabTest(labTest: InsertLabTest): Promise<LabTest>;
  updateLabTest(id: number, labTest: Partial<LabTest>): Promise<LabTest | undefined>;

  // Health Metrics
  getHealthMetrics(userId: number): Promise<HealthMetrics[]>;
  getLatestHealthMetrics(userId: number): Promise<HealthMetrics | undefined>;
  createHealthMetrics(metrics: InsertHealthMetrics): Promise<HealthMetrics>;

  // Mental Wellness Resources
  getMentalWellnessResources(): Promise<MentalWellnessResource[]>;
  getMentalWellnessResource(id: number): Promise<MentalWellnessResource | undefined>;
  createMentalWellnessResource(resource: InsertMentalWellnessResource): Promise<MentalWellnessResource>;

  // Chat functionality
  getChatSessions(userId: number): Promise<ChatSession[]>;
  getChatSession(id: number): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: number, sessionData: Partial<ChatSession>): Promise<ChatSession | undefined>;
  getChatMessages(sessionId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  markMessagesAsRead(sessionId: number, userId: number): Promise<void>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private doctors: Map<number, Doctor>;
  private appointments: Map<number, Appointment>;
  private medications: Map<number, Medication>;
  private labTests: Map<number, LabTest>;
  private healthMetrics: Map<number, HealthMetrics>;
  private mentalWellnessResources: Map<number, MentalWellnessResource>;
  private chatSessions: Map<number, ChatSession>;
  private chatMessages: Map<number, ChatMessage>;
  
  sessionStore: session.Store;
  currentUserId: number;
  currentDoctorId: number;
  currentAppointmentId: number;
  currentMedicationId: number;
  currentLabTestId: number;
  currentHealthMetricsId: number;
  currentMentalWellnessResourceId: number;
  currentChatSessionId: number;
  currentChatMessageId: number;

  constructor() {
    this.users = new Map();
    this.doctors = new Map();
    this.appointments = new Map();
    this.medications = new Map();
    this.labTests = new Map();
    this.healthMetrics = new Map();
    this.mentalWellnessResources = new Map();
    this.chatSessions = new Map();
    this.chatMessages = new Map();
    
    this.currentUserId = 1;
    this.currentDoctorId = 1;
    this.currentAppointmentId = 1;
    this.currentMedicationId = 1;
    this.currentLabTestId = 1;
    this.currentHealthMetricsId = 1;
    this.currentMentalWellnessResourceId = 1;
    this.currentChatSessionId = 1;
    this.currentChatMessageId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Seed mental wellness resources
    this.initializeMentalWellnessResources();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Doctor methods
  async getDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async getDoctor(id: number): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = this.currentDoctorId++;
    const doctor: Doctor = { ...insertDoctor, id };
    this.doctors.set(id, doctor);
    return doctor;
  }

  // Appointment methods
  async getAppointments(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.userId === userId);
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentAppointmentId++;
    const appointment: Appointment = { ...insertAppointment, id };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: number, appointmentData: Partial<Appointment>): Promise<Appointment | undefined> {
    const appointment = await this.getAppointment(id);
    if (!appointment) return undefined;
    
    const updatedAppointment = { ...appointment, ...appointmentData };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }

  // Medication methods
  async getMedications(userId: number): Promise<Medication[]> {
    return Array.from(this.medications.values())
      .filter(medication => medication.userId === userId);
  }

  async getMedication(id: number): Promise<Medication | undefined> {
    return this.medications.get(id);
  }

  async createMedication(insertMedication: InsertMedication): Promise<Medication> {
    const id = this.currentMedicationId++;
    const medication: Medication = { ...insertMedication, id };
    this.medications.set(id, medication);
    return medication;
  }

  async updateMedication(id: number, medicationData: Partial<Medication>): Promise<Medication | undefined> {
    const medication = await this.getMedication(id);
    if (!medication) return undefined;
    
    const updatedMedication = { ...medication, ...medicationData };
    this.medications.set(id, updatedMedication);
    return updatedMedication;
  }

  async deleteMedication(id: number): Promise<boolean> {
    return this.medications.delete(id);
  }

  // Lab Test methods
  async getLabTests(userId: number): Promise<LabTest[]> {
    return Array.from(this.labTests.values())
      .filter(labTest => labTest.userId === userId);
  }

  async getLabTest(id: number): Promise<LabTest | undefined> {
    return this.labTests.get(id);
  }

  async createLabTest(insertLabTest: InsertLabTest): Promise<LabTest> {
    const id = this.currentLabTestId++;
    const labTest: LabTest = { ...insertLabTest, id };
    this.labTests.set(id, labTest);
    return labTest;
  }

  async updateLabTest(id: number, labTestData: Partial<LabTest>): Promise<LabTest | undefined> {
    const labTest = await this.getLabTest(id);
    if (!labTest) return undefined;
    
    const updatedLabTest = { ...labTest, ...labTestData };
    this.labTests.set(id, updatedLabTest);
    return updatedLabTest;
  }

  // Health Metrics methods
  async getHealthMetrics(userId: number): Promise<HealthMetrics[]> {
    return Array.from(this.healthMetrics.values())
      .filter(metrics => metrics.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getLatestHealthMetrics(userId: number): Promise<HealthMetrics | undefined> {
    const metrics = await this.getHealthMetrics(userId);
    return metrics.length > 0 ? metrics[0] : undefined;
  }

  async createHealthMetrics(insertHealthMetrics: InsertHealthMetrics): Promise<HealthMetrics> {
    const id = this.currentHealthMetricsId++;
    const healthMetric: HealthMetrics = { ...insertHealthMetrics, id };
    this.healthMetrics.set(id, healthMetric);
    return healthMetric;
  }

  // Mental Wellness Resources methods
  async getMentalWellnessResources(): Promise<MentalWellnessResource[]> {
    return Array.from(this.mentalWellnessResources.values());
  }

  async getMentalWellnessResource(id: number): Promise<MentalWellnessResource | undefined> {
    return this.mentalWellnessResources.get(id);
  }

  async createMentalWellnessResource(insertResource: InsertMentalWellnessResource): Promise<MentalWellnessResource> {
    const id = this.currentMentalWellnessResourceId++;
    const resource: MentalWellnessResource = { ...insertResource, id };
    this.mentalWellnessResources.set(id, resource);
    return resource;
  }

  // Chat Sessions methods
  async getChatSessions(userId: number): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }

  async getChatSession(id: number): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = this.currentChatSessionId++;
    const session: ChatSession = { 
      ...insertSession, 
      id,
      status: insertSession.status || 'active',
      startedAt: insertSession.startedAt || new Date(),
      endedAt: insertSession.endedAt || null
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: number, sessionData: Partial<ChatSession>): Promise<ChatSession | undefined> {
    const session = await this.getChatSession(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...sessionData };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }

  // Chat Messages methods
  async getChatMessages(sessionId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id,
      sentAt: insertMessage.sentAt || new Date(),
      readAt: null
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async markMessagesAsRead(sessionId: number, userId: number): Promise<void> {
    const messages = await this.getChatMessages(sessionId);
    
    // Only mark messages as read if they are from the doctor and sent to this user
    const unreadMessages = messages.filter(message => 
      message.isFromDoctor && 
      message.receiverId === userId && 
      !message.readAt
    );
    
    // Update the readAt timestamp for all unread messages
    for (const message of unreadMessages) {
      this.chatMessages.set(message.id, {
        ...message,
        readAt: new Date()
      });
    }
  }

  // Initialize sample wellness resources
  private initializeMentalWellnessResources() {
    const resources = [
      {
        title: "Guided Meditation",
        type: "meditation",
        description: "A calming guided meditation session to reduce stress and anxiety",
        duration: "10 min",
      },
      {
        title: "Breathing Exercise",
        type: "breathing",
        description: "Simple breathing techniques to calm the mind and reduce stress",
        duration: "5 min",
      },
      {
        title: "Calming Sounds",
        type: "sleep",
        description: "Soothing natural sounds to help you relax and fall asleep",
        duration: "30 min",
      },
      {
        title: "Mindfulness Tips",
        type: "reading",
        description: "Quick tips on practicing mindfulness in your daily life",
        duration: "3 min",
      }
    ];

    resources.forEach(resource => {
      const id = this.currentMentalWellnessResourceId++;
      this.mentalWellnessResources.set(id, { ...resource, id } as MentalWellnessResource);
    });
  }
}

import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();

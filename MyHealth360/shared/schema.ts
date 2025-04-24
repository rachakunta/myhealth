import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  avatar: text("avatar"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
});

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  specialization: text("specialization").notNull(),
  experience: integer("experience"),
  rating: integer("rating"),
  availability: text("availability"),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id),
  appointmentType: text("appointment_type").notNull(), // video, chat, in-person
  date: timestamp("date").notNull(),
  status: text("status").notNull(), // scheduled, completed, cancelled
  notes: text("notes"),
});

export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  instructions: text("instructions"),
  taken: boolean("taken").default(false),
});

export const labTests = pgTable("lab_tests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  testName: text("test_name").notNull(),
  date: timestamp("date").notNull(),
  location: text("location"),
  status: text("status").notNull(), // scheduled, completed, results-available
  results: jsonb("results"),
});

export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: timestamp("date").notNull(),
  bloodPressure: text("blood_pressure"),
  heartRate: integer("heart_rate"),
  bloodGlucose: integer("blood_glucose"),
  weight: integer("weight"),
  height: integer("height"),
  sleepHours: integer("sleep_hours"),
  steps: integer("steps"),
  mentalWellnessScore: integer("mental_wellness_score"),
});

export const mentalWellnessResources = pgTable("mental_wellness_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // meditation, breathing, sleep, reading
  description: text("description").notNull(),
  duration: text("duration"),
  url: text("url"),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  status: text("status").notNull().default('active'), // active, closed
  subject: text("subject").notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => chatSessions.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
  isFromDoctor: boolean("is_from_doctor").notNull(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users);
export const insertDoctorSchema = createInsertSchema(doctors);
export const insertAppointmentSchema = createInsertSchema(appointments);
export const insertMedicationSchema = createInsertSchema(medications);
export const insertLabTestSchema = createInsertSchema(labTests);
export const insertHealthMetricsSchema = createInsertSchema(healthMetrics);
export const insertMentalWellnessResourceSchema = createInsertSchema(mentalWellnessResources);
export const insertChatSessionSchema = createInsertSchema(chatSessions);
export const insertChatMessageSchema = createInsertSchema(chatMessages);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type InsertLabTest = z.infer<typeof insertLabTestSchema>;
export type InsertHealthMetrics = z.infer<typeof insertHealthMetricsSchema>;
export type InsertMentalWellnessResource = z.infer<typeof insertMentalWellnessResourceSchema>;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type User = typeof users.$inferSelect;
export type Doctor = typeof doctors.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type Medication = typeof medications.$inferSelect;
export type LabTest = typeof labTests.$inferSelect;
export type HealthMetrics = typeof healthMetrics.$inferSelect;
export type MentalWellnessResource = typeof mentalWellnessResources.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session3 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// server/storage.ts
import session2 from "express-session";
import createMemoryStore from "memorystore";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  appointments: () => appointments,
  chatMessages: () => chatMessages,
  chatSessions: () => chatSessions,
  doctors: () => doctors,
  healthMetrics: () => healthMetrics,
  insertAppointmentSchema: () => insertAppointmentSchema,
  insertChatMessageSchema: () => insertChatMessageSchema,
  insertChatSessionSchema: () => insertChatSessionSchema,
  insertDoctorSchema: () => insertDoctorSchema,
  insertHealthMetricsSchema: () => insertHealthMetricsSchema,
  insertLabTestSchema: () => insertLabTestSchema,
  insertMedicationSchema: () => insertMedicationSchema,
  insertMentalWellnessResourceSchema: () => insertMentalWellnessResourceSchema,
  insertUserSchema: () => insertUserSchema,
  labTests: () => labTests,
  medications: () => medications,
  mentalWellnessResources: () => mentalWellnessResources,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  avatar: text("avatar"),
  onboardingCompleted: boolean("onboarding_completed").default(false)
});
var doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  specialization: text("specialization").notNull(),
  experience: integer("experience"),
  rating: integer("rating"),
  availability: text("availability")
});
var appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id),
  appointmentType: text("appointment_type").notNull(),
  // video, chat, in-person
  date: timestamp("date").notNull(),
  status: text("status").notNull(),
  // scheduled, completed, cancelled
  notes: text("notes")
});
var medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  instructions: text("instructions"),
  taken: boolean("taken").default(false)
});
var labTests = pgTable("lab_tests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  testName: text("test_name").notNull(),
  date: timestamp("date").notNull(),
  location: text("location"),
  status: text("status").notNull(),
  // scheduled, completed, results-available
  results: jsonb("results")
});
var healthMetrics = pgTable("health_metrics", {
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
  mentalWellnessScore: integer("mental_wellness_score")
});
var mentalWellnessResources = pgTable("mental_wellness_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  // meditation, breathing, sleep, reading
  description: text("description").notNull(),
  duration: text("duration"),
  url: text("url")
});
var chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  status: text("status").notNull().default("active"),
  // active, closed
  subject: text("subject").notNull()
});
var chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => chatSessions.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
  isFromDoctor: boolean("is_from_doctor").notNull()
});
var insertUserSchema = createInsertSchema(users);
var insertDoctorSchema = createInsertSchema(doctors);
var insertAppointmentSchema = createInsertSchema(appointments);
var insertMedicationSchema = createInsertSchema(medications);
var insertLabTestSchema = createInsertSchema(labTests);
var insertHealthMetricsSchema = createInsertSchema(healthMetrics);
var insertMentalWellnessResourceSchema = createInsertSchema(mentalWellnessResources);
var insertChatSessionSchema = createInsertSchema(chatSessions);
var insertChatMessageSchema = createInsertSchema(chatMessages);

// server/database-storage.ts
import session from "express-session";
import connectPg from "connect-pg-simple";
import { eq, desc, and, asc, isNull } from "drizzle-orm";

// server/db.ts
import * as dotenv from "dotenv";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
dotenv.config();
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/database-storage.ts
var PostgresSessionStore = connectPg(session);
var DatabaseStorage = class {
  sessionStore;
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
    this.initializeMentalWellnessResources();
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, userData) {
    const [user] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return user;
  }
  async getDoctors() {
    return await db.select().from(doctors);
  }
  async getDoctor(id) {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor;
  }
  async createDoctor(insertDoctor) {
    const [doctor] = await db.insert(doctors).values(insertDoctor).returning();
    return doctor;
  }
  async getAppointments(userId) {
    return await db.select().from(appointments).where(eq(appointments.userId, userId));
  }
  async getAppointment(id) {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }
  async createAppointment(insertAppointment) {
    const [appointment] = await db.insert(appointments).values(insertAppointment).returning();
    return appointment;
  }
  async updateAppointment(id, appointmentData) {
    const [appointment] = await db.update(appointments).set(appointmentData).where(eq(appointments.id, id)).returning();
    return appointment;
  }
  async deleteAppointment(id) {
    const result = await db.delete(appointments).where(eq(appointments.id, id)).returning();
    return result.length > 0;
  }
  async getMedications(userId) {
    return await db.select().from(medications).where(eq(medications.userId, userId));
  }
  async getMedication(id) {
    const [medication] = await db.select().from(medications).where(eq(medications.id, id));
    return medication;
  }
  async createMedication(insertMedication) {
    const [medication] = await db.insert(medications).values(insertMedication).returning();
    return medication;
  }
  async updateMedication(id, medicationData) {
    const [medication] = await db.update(medications).set(medicationData).where(eq(medications.id, id)).returning();
    return medication;
  }
  async deleteMedication(id) {
    const result = await db.delete(medications).where(eq(medications.id, id)).returning();
    return result.length > 0;
  }
  async getLabTests(userId) {
    return await db.select().from(labTests).where(eq(labTests.userId, userId));
  }
  async getLabTest(id) {
    const [labTest] = await db.select().from(labTests).where(eq(labTests.id, id));
    return labTest;
  }
  async createLabTest(insertLabTest) {
    const [labTest] = await db.insert(labTests).values(insertLabTest).returning();
    return labTest;
  }
  async updateLabTest(id, labTestData) {
    const [labTest] = await db.update(labTests).set(labTestData).where(eq(labTests.id, id)).returning();
    return labTest;
  }
  async getHealthMetrics(userId) {
    return await db.select().from(healthMetrics).where(eq(healthMetrics.userId, userId)).orderBy(desc(healthMetrics.date));
  }
  async getLatestHealthMetrics(userId) {
    const [metric] = await db.select().from(healthMetrics).where(eq(healthMetrics.userId, userId)).orderBy(desc(healthMetrics.date)).limit(1);
    return metric;
  }
  async createHealthMetrics(insertHealthMetrics) {
    const [healthMetric] = await db.insert(healthMetrics).values(insertHealthMetrics).returning();
    return healthMetric;
  }
  async getMentalWellnessResources() {
    return await db.select().from(mentalWellnessResources);
  }
  async getMentalWellnessResource(id) {
    const [resource] = await db.select().from(mentalWellnessResources).where(eq(mentalWellnessResources.id, id));
    return resource;
  }
  async createMentalWellnessResource(insertResource) {
    const [resource] = await db.insert(mentalWellnessResources).values(insertResource).returning();
    return resource;
  }
  // Chat functionality
  async getChatSessions(userId) {
    return await db.select().from(chatSessions).where(eq(chatSessions.userId, userId)).orderBy(desc(chatSessions.startedAt));
  }
  async getChatSession(id) {
    const [session4] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
    return session4;
  }
  async createChatSession(session4) {
    const [chatSession] = await db.insert(chatSessions).values(session4).returning();
    return chatSession;
  }
  async updateChatSession(id, sessionData) {
    const [updatedSession] = await db.update(chatSessions).set(sessionData).where(eq(chatSessions.id, id)).returning();
    return updatedSession;
  }
  async getChatMessages(sessionId) {
    return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId)).orderBy(asc(chatMessages.sentAt));
  }
  async createChatMessage(message) {
    const [chatMessage] = await db.insert(chatMessages).values(message).returning();
    return chatMessage;
  }
  async markMessagesAsRead(sessionId, userId) {
    const now = /* @__PURE__ */ new Date();
    await db.update(chatMessages).set({ readAt: now }).where(
      and(
        eq(chatMessages.sessionId, sessionId),
        eq(chatMessages.receiverId, userId),
        isNull(chatMessages.readAt)
      )
    );
  }
  async initializeMentalWellnessResources() {
    const existingResources = await db.select().from(mentalWellnessResources);
    if (existingResources.length === 0) {
      const resources = [
        {
          title: "Guided Meditation for Anxiety",
          type: "Meditation",
          description: "A calming guided meditation to help reduce anxiety and stress.",
          duration: "10 min"
        },
        {
          title: "Deep Breathing Exercise",
          type: "Breathing",
          description: "Simple breathing techniques to calm the mind and reduce stress.",
          duration: "5 min"
        },
        {
          title: "Calming Nature Sounds",
          type: "Sleep",
          description: "Soothing natural sounds to help you relax and fall asleep.",
          duration: "30 min"
        },
        {
          title: "Mindfulness Tips for Daily Life",
          type: "Reading",
          description: "Quick tips on practicing mindfulness in your daily life.",
          duration: "3 min read"
        },
        {
          title: "Gentle Yoga for Beginners",
          type: "Yoga",
          description: "Easy yoga poses for beginners to improve flexibility and mindfulness.",
          duration: "15 min"
        },
        {
          title: "Stress Relief Visualization",
          type: "Stress Relief",
          description: "Guided visualization to help release tension and stress from your body and mind.",
          duration: "8 min"
        },
        {
          title: "Healthy Eating Habits",
          type: "Nutrition",
          description: "Learn about balanced nutrition and develop healthier eating habits.",
          duration: "5 min read"
        },
        {
          title: "Quick Home Workout",
          type: "Exercise",
          description: "Simple exercises you can do at home without equipment.",
          duration: "12 min"
        }
      ];
      for (const resource of resources) {
        await this.createMentalWellnessResource(resource);
      }
    }
  }
};

// server/storage.ts
var MemoryStore = createMemoryStore(session2);
var storage = new DatabaseStorage();

// server/auth.ts
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "integrahealth-session-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1e3 * 60 * 60 * 24,
      // 24 hours
      secure: process.env.NODE_ENV === "production"
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session3(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !await comparePasswords(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUsername = await storage.getUserByUsername(req.body.username);
      if (existingUsername) {
        return res.status(400).send("Username already exists");
      }
      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).send("Email already exists");
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      const { password, ...userWithoutPassword } = user;
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.status(200).json(userWithoutPassword);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}

// server/routes.ts
import { z } from "zod";
import OpenAI from "openai";
if (!process.env.OPENAI_API_KEY) {
  console.error("OpenAI API key not found. Please set OPENAI_API_KEY environment variable.");
}
var openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
async function registerRoutes(app2) {
  setupAuth(app2);
  const requireAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };
  app2.get("/api/doctors", requireAuth, async (req, res) => {
    try {
      const doctors2 = await storage.getDoctors();
      res.json(doctors2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });
  app2.get("/api/doctors/:id", requireAuth, async (req, res) => {
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
  app2.get("/api/appointments", requireAuth, async (req, res) => {
    try {
      const appointments2 = await storage.getAppointments(req.user.id);
      res.json(appointments2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });
  app2.post("/api/appointments", requireAuth, async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse({
        ...req.body,
        userId: req.user.id
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
  app2.put("/api/appointments/:id", requireAuth, async (req, res) => {
    try {
      const appointment = await storage.getAppointment(Number(req.params.id));
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      if (appointment.userId !== req.user.id) {
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
  app2.delete("/api/appointments/:id", requireAuth, async (req, res) => {
    try {
      const appointment = await storage.getAppointment(Number(req.params.id));
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      if (appointment.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to delete this appointment" });
      }
      await storage.deleteAppointment(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });
  app2.get("/api/medications", requireAuth, async (req, res) => {
    try {
      const medications2 = await storage.getMedications(req.user.id);
      res.json(medications2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medications" });
    }
  });
  app2.post("/api/medications", requireAuth, async (req, res) => {
    try {
      const validatedData = insertMedicationSchema.parse({
        ...req.body,
        userId: req.user.id
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
  app2.put("/api/medications/:id", requireAuth, async (req, res) => {
    try {
      const medication = await storage.getMedication(Number(req.params.id));
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      if (medication.userId !== req.user.id) {
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
  app2.delete("/api/medications/:id", requireAuth, async (req, res) => {
    try {
      const medication = await storage.getMedication(Number(req.params.id));
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      if (medication.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to delete this medication" });
      }
      await storage.deleteMedication(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete medication" });
    }
  });
  app2.get("/api/lab-tests", requireAuth, async (req, res) => {
    try {
      const labTests2 = await storage.getLabTests(req.user.id);
      res.json(labTests2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lab tests" });
    }
  });
  app2.post("/api/lab-tests", requireAuth, async (req, res) => {
    try {
      const validatedData = insertLabTestSchema.parse({
        ...req.body,
        userId: req.user.id
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
  app2.put("/api/lab-tests/:id", requireAuth, async (req, res) => {
    try {
      const labTest = await storage.getLabTest(Number(req.params.id));
      if (!labTest) {
        return res.status(404).json({ message: "Lab test not found" });
      }
      if (labTest.userId !== req.user.id) {
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
  app2.get("/api/health-metrics", requireAuth, async (req, res) => {
    try {
      const metrics = await storage.getHealthMetrics(req.user.id);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health metrics" });
    }
  });
  app2.get("/api/health-metrics/latest", requireAuth, async (req, res) => {
    try {
      const metrics = await storage.getLatestHealthMetrics(req.user.id);
      if (!metrics) {
        return res.status(404).json({ message: "No health metrics found" });
      }
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest health metrics" });
    }
  });
  app2.post("/api/health-metrics", requireAuth, async (req, res) => {
    try {
      const validatedData = insertHealthMetricsSchema.parse({
        ...req.body,
        userId: req.user.id,
        date: /* @__PURE__ */ new Date()
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
  app2.patch("/api/user/onboarding", requireAuth, async (req, res) => {
    try {
      const { onboardingCompleted } = req.body;
      if (typeof onboardingCompleted !== "boolean") {
        return res.status(400).json({ message: "Invalid request data. 'onboardingCompleted' must be a boolean." });
      }
      const updatedUser = await storage.updateUser(req.user.id, { onboardingCompleted });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update onboarding status" });
    }
  });
  app2.get("/api/mental-wellness-resources", async (req, res) => {
    try {
      const resources = await storage.getMentalWellnessResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mental wellness resources" });
    }
  });
  app2.get("/api/mental-wellness-resources/:id", async (req, res) => {
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
  app2.get("/api/chat-sessions", requireAuth, async (req, res) => {
    try {
      const sessions = await storage.getChatSessions(req.user.id);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat sessions" });
    }
  });
  app2.get("/api/chat-sessions/:id", requireAuth, async (req, res) => {
    try {
      const session4 = await storage.getChatSession(Number(req.params.id));
      if (!session4) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      if (session4.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to this chat session" });
      }
      res.json(session4);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat session" });
    }
  });
  app2.post("/api/chat-sessions", requireAuth, async (req, res) => {
    try {
      const validatedData = insertChatSessionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const session4 = await storage.createChatSession(validatedData);
      res.status(201).json(session4);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid chat session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create chat session" });
    }
  });
  app2.patch("/api/chat-sessions/:id", requireAuth, async (req, res) => {
    try {
      const session4 = await storage.getChatSession(Number(req.params.id));
      if (!session4) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      if (session4.userId !== req.user.id) {
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
  app2.get("/api/chat-sessions/:sessionId/messages", requireAuth, async (req, res) => {
    try {
      const session4 = await storage.getChatSession(Number(req.params.sessionId));
      if (!session4) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      if (session4.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to these chat messages" });
      }
      const messages = await storage.getChatMessages(Number(req.params.sessionId));
      await storage.markMessagesAsRead(Number(req.params.sessionId), req.user.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });
  app2.post("/api/chat-sessions/:sessionId/messages", requireAuth, async (req, res) => {
    try {
      const session4 = await storage.getChatSession(Number(req.params.sessionId));
      if (!session4) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      if (session4.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to this chat session" });
      }
      const isFromDoctor = false;
      const validatedData = insertChatMessageSchema.parse({
        ...req.body,
        sessionId: Number(req.params.sessionId),
        senderId: req.user.id,
        receiverId: session4.doctorId,
        // Message is sent to the doctor
        isFromDoctor
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
  app2.post("/api/health/risk-prediction", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const healthMetrics2 = await storage.getLatestHealthMetrics(userId);
      if (!healthMetrics2) {
        return res.status(404).json({
          message: "No health metrics found for risk prediction. Please enter your health data first."
        });
      }
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a healthcare AI specialized in risk assessment. Analyze the provided health metrics and return a JSON response with these fields:1. overallRiskScore (number 1-100)2. topRisks (array of 2-3 objects with name, description, riskLevel, and preventionTips)3. summary (brief paragraph explaining overall assessment)Make the assessment medically reasonable but not alarmist. Use clinical terms when appropriate."
          },
          {
            role: "user",
            content: `Please analyze these health metrics and provide a risk assessment: ${JSON.stringify(healthMetrics2)}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      });
      const content = response.choices[0].message.content || "{}";
      const riskPrediction = JSON.parse(content);
      res.json(riskPrediction);
    } catch (error) {
      console.error("AI Health Risk Prediction error:", error);
      res.status(500).json({ message: "Failed to generate health risk prediction" });
    }
  });
  app2.post("/api/health/wellness-tips", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      const healthMetrics2 = await storage.getLatestHealthMetrics(userId);
      if (!user || !healthMetrics2) {
        return res.status(404).json({
          message: "Insufficient data for personalized wellness tips. Please complete your profile and health data."
        });
      }
      const userData = {
        user,
        healthMetrics: healthMetrics2,
        preferences: req.body.preferences || {}
      };
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a wellness coach AI that provides personalized, practical health tips. Return a JSON response with these fields:1. dailyTip (object with title and description)2. recommendations (array of 3-5 objects with category, title, and details)3. message (encouraging personalized message)Make recommendations specific, actionable, and based on the user's health data and preferences."
          },
          {
            role: "user",
            content: `Please generate personalized wellness recommendations based on my data: ${JSON.stringify(userData)}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      });
      const content = response.choices[0].message.content || "{}";
      const wellnessTips = JSON.parse(content);
      res.json(wellnessTips);
    } catch (error) {
      console.error("AI Wellness Tips error:", error);
      res.status(500).json({ message: "Failed to generate wellness tips" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const activeConnections = /* @__PURE__ */ new Map();
  wss.on("connection", (ws2, req) => {
    console.log("WebSocket connection established");
    ws2.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "auth") {
          const userId = data.userId;
          if (userId) {
            activeConnections.set(userId, ws2);
            ws2.send(JSON.stringify({
              type: "auth_success",
              message: "Authenticated successfully"
            }));
            console.log(`User ${userId} authenticated on WebSocket`);
          }
        }
        if (data.type === "chat_message" && data.sessionId && data.content) {
          const session4 = await storage.getChatSession(Number(data.sessionId));
          if (!session4) {
            ws2.send(JSON.stringify({
              type: "error",
              message: "Chat session not found"
            }));
            return;
          }
          const userId = data.userId;
          const isFromDoctor = data.isFromDoctor || false;
          const message2 = await storage.createChatMessage({
            sessionId: Number(data.sessionId),
            content: data.content,
            sentAt: /* @__PURE__ */ new Date(),
            senderId: userId,
            // If from patient, receiver is doctor; if from doctor, receiver is patient
            receiverId: isFromDoctor ? session4.userId : session4.doctorId,
            isFromDoctor,
            readAt: null
          });
          const recipientId = isFromDoctor ? session4.userId : session4.doctorId;
          const recipientWs = activeConnections.get(recipientId);
          if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
            recipientWs.send(JSON.stringify({
              type: "new_message",
              sessionId: data.sessionId,
              message: message2
            }));
          }
          ws2.send(JSON.stringify({
            type: "message_sent",
            message: message2
          }));
        }
      } catch (error) {
        console.error("WebSocket error:", error);
        ws2.send(JSON.stringify({
          type: "error",
          message: "An error occurred processing your request"
        }));
      }
    });
    ws2.on("close", () => {
      console.log("WebSocket connection closed");
      Array.from(activeConnections.entries()).forEach(([userId, connection]) => {
        if (connection === ws2) {
          activeConnections.delete(userId);
          console.log(`User ${userId} disconnected from WebSocket`);
        }
      });
    });
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

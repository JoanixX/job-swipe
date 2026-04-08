import { pgTable, text, serial, integer, boolean, timestamp, json, date, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User type enum
export const UserType = {
  STUDENT: "student",
  BUSINESS: "business",
} as const;

export type UserTypeValue = typeof UserType[keyof typeof UserType];

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  userType: text("user_type").notNull(),
  profilePic: text("profile_pic"), // Puede ser null o undefined
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Students table - específico para Project Core
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  career: text("career").notNull(),
  academicCycle: integer("academic_cycle").notNull(),
  location: text("location").notNull(),
  mainMotivation: text("main_motivation").notNull(),
  description: text("description").notNull(),
  weeklyAvailability: integer("weekly_availability").notNull(),
  preferredModality: text("preferred_modality").notNull(), // presencial, remoto, híbrido
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Companies table - específico para Project Core
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  ruc: text("ruc").notNull().unique(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  industry: text("industry").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  companyCulture: text("company_culture").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Job areas table
export const jobAreas = pgTable("job_areas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

// Job offers table - específico para Project Core
export const jobOffers = pgTable("job_offers", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  areaId: integer("area_id").notNull().references(() => jobAreas.id),
  modality: text("modality").notNull(), // presencial, remoto, híbrido
  requiredHours: integer("required_hours").notNull(),
  duration: integer("duration").notNull(), // en semanas
  startDate: date("start_date").notNull(),
  approximatedSalary: decimal("approximated_salary", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// External links table (para CV/Portafolio)
export const externalLinks = pgTable("external_links", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  link: text("link").notNull(),
  type: text("type").notNull(), // cv, portfolio, linkedin, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Matches table - específico para Project Core
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  jobOfferId: integer("job_offer_id").notNull().references(() => jobOffers.id),
  compatibilityScore: decimal("compatibility_score", { precision: 5, scale: 2 }),
  matchText: text("match_text"), // texto descriptivo del match
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bio: text("bio"),
  education: json("education").default([]),
  experience: json("experience").default([]),
  completionPercentage: integer("completion_percentage").default(0),
});

export const interests = pgTable("interests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const userInterests = pgTable("user_interests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  interestId: integer("interest_id").notNull().references(() => interests.id),
});

export const swipes = pgTable("swipes", {
  id: serial("id").primaryKey(),
  swiperId: integer("swiper_id").notNull().references(() => users.id),
  swipedId: integer("swiped_id").notNull().references(() => users.id),
  direction: text("direction").notNull(), // "right" for like, "left" for dislike
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for insert operations
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertStudentSchema = createInsertSchema(students).omit({ id: true, createdAt: true });
export const insertCompanySchema = createInsertSchema(companies).omit({ id: true, createdAt: true });
export const insertJobOfferSchema = createInsertSchema(jobOffers).omit({ id: true, createdAt: true });
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true, createdAt: true });
export const insertExternalLinkSchema = createInsertSchema(externalLinks).omit({ id: true, createdAt: true });
export const insertProfileSchema = createInsertSchema(userProfiles).omit({ id: true });
export const insertInterestSchema = createInsertSchema(interests).omit({ id: true });
export const insertUserInterestSchema = createInsertSchema(userInterests).omit({ id: true });
export const insertSwipeSchema = createInsertSchema(swipes).omit({ id: true, createdAt: true });

// TypeScript types for the schema
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type JobOffer = typeof jobOffers.$inferSelect;
export type InsertJobOffer = z.infer<typeof insertJobOfferSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type ExternalLink = typeof externalLinks.$inferSelect;
export type InsertExternalLink = z.infer<typeof insertExternalLinkSchema>;

export type JobArea = typeof jobAreas.$inferSelect;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertProfileSchema>;

export type Interest = typeof interests.$inferSelect;
export type InsertInterest = z.infer<typeof insertInterestSchema>;

export type UserInterest = typeof userInterests.$inferSelect;
export type InsertUserInterest = z.infer<typeof insertUserInterestSchema>;

export type Swipe = typeof swipes.$inferSelect;
export type InsertSwipe = z.infer<typeof insertSwipeSchema>;

// Extended schemas for validation
export const registerUserSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const registerStudentSchema = insertStudentSchema.extend({
  confirmPassword: z.string(),
  username: z.string().min(3, "Username must be at least 3 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const registerCompanySchema = insertCompanySchema.extend({
  confirmPassword: z.string(),
  username: z.string().min(3, "Username must be at least 3 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterUser = z.infer<typeof registerUserSchema>;
export type RegisterStudent = z.infer<typeof registerStudentSchema>;
export type RegisterCompany = z.infer<typeof registerCompanySchema>;

// User with profile and interests
export type UserWithProfile = User & {
  profile: UserProfile | null;
  interests: Interest[];
};

// Job offer with company and area
export type JobOfferWithDetails = JobOffer & {
  company: Company;
  area: JobArea;
};

// Student with external links
export type StudentWithLinks = Student & {
  externalLinks: ExternalLink[];
};

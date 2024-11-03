import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users table
export const users = sqliteTable("users", {
  id: text("id", { length: 21 }).primaryKey(),
  discordId: text("discord_id", { length: 255 }).unique(),
  email: text("email", { length: 255 }).notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  hashedPassword: text("hashed_password", { length: 255 }),
  avatar: text("avatar", { length: 255 }),
  stripeSubscriptionId: text("stripe_subscription_id", { length: 191 }),
  stripePriceId: text("stripe_price_id", { length: 191 }),
  stripeCustomerId: text("stripe_customer_id", { length: 191 }),
  stripeCurrentPeriodEnd: integer("stripe_current_period_end", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(STRFTIME('%s', 'now') * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(STRFTIME('%s', 'now') * 1000)`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Sessions table
export const sessions = sqliteTable("sessions", {
  id: text("id", { length: 255 }).primaryKey(),
  userId: text("user_id", { length: 21 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

// Email verification codes
export const emailVerificationCodes = sqliteTable("email_verification_codes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id", { length: 21 })
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  email: text("email", { length: 255 }).notNull(),
  code: text("code", { length: 8 }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

// Password reset tokens
export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  id: text("id", { length: 40 }).primaryKey(),
  userId: text("user_id", { length: 21 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

// Studies table
export const studies = sqliteTable("studies", {
  id: text("id").primaryKey(),
  userId: text("user_id", { length: 21 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(STRFTIME('%s', 'now') * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(STRFTIME('%s', 'now') * 1000)`),
});

// Tree Testing Configuration
export const treeConfigs = sqliteTable("tree_configs", {
  id: text("id").primaryKey(),
  studyId: text("study_id")
    .notNull()
    .references(() => studies.id, { onDelete: "cascade" }),
  treeStructure: text("tree_structure").notNull(), // JSON string
  tasks: text("tasks").notNull(), // JSON array
  welcomeMessage: text("welcome_message"),
  completionMessage: text("completion_message"),
  maxTimePerTaskSeconds: integer("max_time_per_task_seconds"),
  requireConfidenceRating: integer("require_confidence_rating", { mode: "boolean" })
    .notNull()
    .default(true),
});

// Participants
export const participants = sqliteTable("participants", {
  id: text("id").primaryKey(),
  studyId: text("study_id")
    .notNull()
    .references(() => studies.id, { onDelete: "cascade" }),
  sessionId: text("session_id").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(STRFTIME('%s', 'now') * 1000)`),
});

// Task Results
export const taskResults = sqliteTable("task_results", {
  id: text("id").primaryKey(),
  participantId: text("participant_id")
    .notNull()
    .references(() => participants.id, { onDelete: "cascade" }),
  taskIndex: integer("task_index").notNull(),
  successful: integer("successful", { mode: "boolean" }).notNull(),
  directPathTaken: integer("direct_path_taken", { mode: "boolean" }).notNull(),
  completionTimeSeconds: integer("completion_time_seconds").notNull(),
  confidenceRating: integer("confidence_rating"), // 1-5 scale
  pathTaken: text("path_taken").notNull(), // JSON array of node IDs
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(STRFTIME('%s', 'now') * 1000)`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  studies: many(studies),
  sessions: many(sessions),
}));

export const studiesRelations = relations(studies, ({ one, many }) => ({
  user: one(users, { fields: [studies.userId], references: [users.id] }),
  treeConfig: one(treeConfigs),
  participants: many(participants),
}));

export const participantsRelations = relations(participants, ({ many, one }) => ({
  study: one(studies, { fields: [participants.studyId], references: [studies.id] }),
  taskResults: many(taskResults),
}));

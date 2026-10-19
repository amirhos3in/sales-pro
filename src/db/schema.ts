import { boolean, integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";

export const userRoles = ["learner", "admin"] as const;
export const subscriptionTiers = ["free", "lms", "pro_copilot", "enterprise"] as const;
export const lessonTracks = ["free", "paid"] as const;

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  role: text("role").notNull().default("learner"),
  createdAt: text("created_at").notNull(),
});

export const profiles = pgTable("profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id),
  jobTitle: text("job_title"),
  bio: text("bio"),
});

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  tier: text("tier").notNull().default("free"),
  active: boolean("active").notNull().default(true),
  quotaSeconds: integer("quota_seconds").notNull().default(0),
  usedSeconds: integer("used_seconds").notNull().default(0),
  periodEnd: text("period_end"),
});

export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  track: text("track").notNull(),
  position: integer("position").notNull(),
});

export const lessons = pgTable("lessons", {
  id: text("id").primaryKey(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id),
  title: text("title").notNull(),
  aparatId: text("aparat_id").notNull(),
  track: text("track").notNull(),
  position: integer("position").notNull(),
  minutes: integer("minutes").notNull(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: text("id").primaryKey(),
  lessonId: text("lesson_id")
    .notNull()
    .references(() => lessons.id),
  prompt: text("prompt").notNull(),
  position: integer("position").notNull(),
});

export const quizChoices = pgTable("quiz_choices", {
  id: text("id").primaryKey(),
  questionId: text("question_id")
    .notNull()
    .references(() => quizQuestions.id),
  label: text("label").notNull(),
  position: integer("position").notNull(),
  correct: boolean("correct").notNull(),
});

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id),
    attempts: integer("attempts").notNull().default(0),
    bestCorrect: integer("best_correct").notNull().default(0),
    passed: boolean("passed").notNull().default(false),
    unlocked: boolean("unlocked").notNull().default(false),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.lessonId] })],
);

export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at").notNull(),
});

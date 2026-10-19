export const DDL = `
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  phone text NOT NULL UNIQUE,
  name text NOT NULL,
  email text,
  role text NOT NULL DEFAULT 'learner',
  created_at text NOT NULL
);
CREATE TABLE IF NOT EXISTS profiles (
  user_id text PRIMARY KEY REFERENCES users(id),
  job_title text,
  bio text
);
CREATE TABLE IF NOT EXISTS subscriptions (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id),
  tier text NOT NULL DEFAULT 'free',
  active boolean NOT NULL DEFAULT true,
  quota_seconds integer NOT NULL DEFAULT 0,
  used_seconds integer NOT NULL DEFAULT 0,
  period_end text
);
CREATE TABLE IF NOT EXISTS courses (
  id text PRIMARY KEY,
  title text NOT NULL,
  track text NOT NULL,
  position integer NOT NULL
);
CREATE TABLE IF NOT EXISTS lessons (
  id text PRIMARY KEY,
  course_id text NOT NULL REFERENCES courses(id),
  title text NOT NULL,
  aparat_id text NOT NULL,
  track text NOT NULL,
  position integer NOT NULL,
  minutes integer NOT NULL
);
CREATE TABLE IF NOT EXISTS quiz_questions (
  id text PRIMARY KEY,
  lesson_id text NOT NULL REFERENCES lessons(id),
  prompt text NOT NULL,
  position integer NOT NULL
);
CREATE TABLE IF NOT EXISTS quiz_choices (
  id text PRIMARY KEY,
  question_id text NOT NULL REFERENCES quiz_questions(id),
  label text NOT NULL,
  position integer NOT NULL,
  correct boolean NOT NULL
);
CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id text NOT NULL REFERENCES users(id),
  lesson_id text NOT NULL REFERENCES lessons(id),
  attempts integer NOT NULL DEFAULT 0,
  best_correct integer NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  unlocked boolean NOT NULL DEFAULT false,
  updated_at text NOT NULL,
  PRIMARY KEY (user_id, lesson_id)
);
CREATE TABLE IF NOT EXISTS sessions (
  token text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id),
  created_at text NOT NULL
);
`;

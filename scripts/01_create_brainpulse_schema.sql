-- BrainPulse Mood Journal Database Schema
-- Create comprehensive schema for mood tracking, analytics, and AI coaching

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (enhanced from existing)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say')),
  date_of_birth DATE,
  timezone VARCHAR(50) DEFAULT 'UTC',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  theme_preference VARCHAR(20) DEFAULT 'auto' CHECK (theme_preference IN ('light', 'dark', 'auto')),
  notification_preferences JSONB DEFAULT '{"daily_reminder": true, "weekly_summary": true, "coaching_tips": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood categories and emotions
CREATE TABLE IF NOT EXISTS mood_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) NOT NULL, -- hex color
  icon VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood entries - core tracking
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  primary_emotion VARCHAR(100),
  secondary_emotions TEXT[], -- array of emotions
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  notes TEXT,
  tags TEXT[], -- array of custom tags
  weather VARCHAR(50),
  location VARCHAR(255),
  activities TEXT[], -- what they were doing
  triggers TEXT[], -- what might have influenced mood
  gratitude_notes TEXT[], -- things they're grateful for
  goals_progress JSONB, -- progress on personal goals
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood patterns and insights
CREATE TABLE IF NOT EXISTS mood_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pattern_type VARCHAR(50) NOT NULL, -- 'weekly', 'monthly', 'seasonal', 'trigger-based'
  pattern_data JSONB NOT NULL,
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  insights TEXT[],
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Coaching sessions
CREATE TABLE IF NOT EXISTS coaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type VARCHAR(50) NOT NULL, -- 'daily_checkin', 'crisis_support', 'goal_setting', 'reflection'
  conversation_data JSONB NOT NULL, -- stores the conversation history
  mood_context JSONB, -- mood data that triggered this session
  recommendations TEXT[],
  action_items TEXT[],
  follow_up_scheduled_at TIMESTAMP WITH TIME ZONE,
  session_rating INTEGER CHECK (session_rating >= 1 AND session_rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- User goals and habits
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'mental_health', 'physical_health', 'relationships', 'career', 'personal'
  target_value INTEGER,
  current_value INTEGER DEFAULT 0,
  unit VARCHAR(50), -- 'days', 'times', 'hours', etc.
  frequency VARCHAR(50), -- 'daily', 'weekly', 'monthly'
  start_date DATE NOT NULL,
  target_date DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goal progress tracking
CREATE TABLE IF NOT EXISTS goal_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES user_goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  progress_value INTEGER NOT NULL,
  notes TEXT,
  mood_entry_id UUID REFERENCES mood_entries(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics and insights
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analytics_type VARCHAR(50) NOT NULL, -- 'weekly_summary', 'monthly_report', 'trend_analysis'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  data JSONB NOT NULL, -- contains all the analytics data
  insights TEXT[],
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications and reminders
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'mood_reminder', 'coaching_tip', 'weekly_summary', 'goal_reminder'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url VARCHAR(500),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'read', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON mood_entries(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goal_progress_goal_id ON goal_progress(goal_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON user_notifications(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mood_entries_updated_at BEFORE UPDATE ON mood_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mood_patterns_updated_at BEFORE UPDATE ON mood_patterns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON user_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

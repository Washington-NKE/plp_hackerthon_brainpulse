-- Create sample user for testing (optional - remove in production)
INSERT INTO users (id, email, name, gender, onboarding_completed) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'demo@brainpulse.app', 'Demo User', 'prefer-not-to-say', true)
ON CONFLICT (email) DO NOTHING;

-- Sample mood entry
INSERT INTO mood_entries (
  user_id, 
  mood_score, 
  primary_emotion, 
  secondary_emotions, 
  energy_level, 
  stress_level, 
  sleep_quality,
  notes,
  tags,
  activities,
  gratitude_notes
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  7,
  'Joy',
  ARRAY['Excitement', 'Gratitude'],
  8,
  3,
  8,
  'Had a great day working on my projects. Feeling accomplished and energized.',
  ARRAY['productive', 'work', 'accomplishment'],
  ARRAY['coding', 'exercise', 'meditation'],
  ARRAY['Grateful for good health', 'Thankful for supportive friends', 'Appreciating beautiful weather']
);

-- Sample goal
INSERT INTO user_goals (
  user_id,
  title,
  description,
  category,
  target_value,
  frequency,
  start_date,
  target_date
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Daily Meditation',
  'Practice mindfulness meditation for better mental health',
  'mental_health',
  30,
  'daily',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days'
);

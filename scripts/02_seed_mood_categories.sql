-- Seed mood categories with psychology-informed emotions
INSERT INTO mood_categories (name, color, icon, description) VALUES
('Joy', '#FFD700', '😊', 'Feelings of happiness, contentment, and positive energy'),
('Sadness', '#4169E1', '😢', 'Feelings of sorrow, melancholy, or emotional pain'),
('Anger', '#DC143C', '😠', 'Feelings of frustration, irritation, or rage'),
('Fear', '#8A2BE2', '😰', 'Feelings of anxiety, worry, or apprehension'),
('Surprise', '#FF8C00', '😲', 'Unexpected feelings or reactions to events'),
('Disgust', '#228B22', '🤢', 'Feelings of revulsion or strong dislike'),
('Anticipation', '#FF69B4', '🤗', 'Feelings of excitement or expectation'),
('Trust', '#20B2AA', '🤝', 'Feelings of confidence and security'),
('Love', '#FF1493', '❤️', 'Feelings of affection, care, and connection'),
('Guilt', '#696969', '😔', 'Feelings of remorse or self-blame'),
('Shame', '#2F4F4F', '😳', 'Feelings of embarrassment or inadequacy'),
('Pride', '#DAA520', '😌', 'Feelings of accomplishment and self-worth'),
('Envy', '#9ACD32', '😒', 'Feelings of wanting what others have'),
('Gratitude', '#32CD32', '🙏', 'Feelings of thankfulness and appreciation'),
('Hope', '#87CEEB', '🌟', 'Feelings of optimism and positive expectation'),
('Loneliness', '#708090', '😞', 'Feelings of isolation or disconnection'),
('Excitement', '#FF4500', '🎉', 'Feelings of enthusiasm and high energy'),
('Calm', '#98FB98', '😌', 'Feelings of peace and tranquility'),
('Overwhelm', '#B22222', '😵', 'Feelings of being unable to cope'),
('Contentment', '#DDA0DD', '😊', 'Feelings of satisfaction and peace')
ON CONFLICT DO NOTHING;

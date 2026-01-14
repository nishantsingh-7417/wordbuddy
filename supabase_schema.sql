-- WordBuddy Database Schema for Supabase
-- Run this in Supabase SQL Editor after creating your project

-- Create the words table
CREATE TABLE words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  eli5 TEXT NOT NULL,
  example TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('normal', 'difficult')),
  correct_count INTEGER DEFAULT 0,
  wrong_count INTEGER DEFAULT 0,
  last_reviewed DATE,
  date_added DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate words per user
  UNIQUE(user_id, word)
);

-- Create indexes for better query performance
CREATE INDEX idx_words_user_id ON words(user_id);
CREATE INDEX idx_words_date_added ON words(date_added DESC);
CREATE INDEX idx_words_difficulty ON words(difficulty);

-- Enable Row Level Security (RLS)
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own words
CREATE POLICY "Users can view own words"
  ON words FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own words
CREATE POLICY "Users can insert own words"
  ON words FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own words
CREATE POLICY "Users can update own words"
  ON words FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policy: Users can delete their own words
CREATE POLICY "Users can delete own words"
  ON words FOR DELETE
  USING (auth.uid() = user_id);

-- Optional: Create a view for common statistics
CREATE OR REPLACE VIEW user_word_stats AS
SELECT 
  user_id,
  COUNT(*) as total_words,
  COUNT(*) FILTER (WHERE difficulty = 'difficult') as difficult_words,
  COUNT(*) FILTER (WHERE correct_count >= 3 AND 
                         (correct_count::float / NULLIF(correct_count + wrong_count, 0)) >= 0.7) as mastered_words,
  SUM(correct_count) as total_correct,
  SUM(wrong_count) as total_wrong,
  CASE 
    WHEN SUM(correct_count + wrong_count) > 0 
    THEN ROUND((SUM(correct_count)::float / SUM(correct_count + wrong_count)) * 100)
    ELSE 0 
  END as accuracy
FROM words
GROUP BY user_id;

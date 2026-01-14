import { supabase } from './supabase';

export interface WordEntry {
  word: string;
  meaning: string;
  eli5: string;
  exampleSentence: string;
  difficulty: 'normal' | 'difficult';
  correctCount: number;
  wrongCount: number;
  lastReviewed: string;
  dateAdded: string;
}

/**
 * Get user's vocabulary from Supabase
 * Returns empty array if user is not authenticated
 */
export const getVocabulary = async (): Promise<WordEntry[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('user_id', user.id)
      .order('date_added', { ascending: false });

    if (error) {
      console.error('Error fetching vocabulary:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      word: row.word,
      meaning: row.meaning,
      eli5: row.eli5,
      exampleSentence: row.example,
      difficulty: row.difficulty || 'normal',
      correctCount: row.correct_count || 0,
      wrongCount: row.wrong_count || 0,
      lastReviewed: row.last_reviewed || '',
      dateAdded: row.date_added || '',
    }));
  } catch (error) {
    console.error('Error in getVocabulary:', error);
    return [];
  }
};

/**
 * Save a word to Supabase
 * Silently returns if user is not authenticated
 * Prevents duplicates automatically
 */
export const saveWord = async (entry: WordEntry): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Silent return for unauthenticated users
    if (!user) {
      console.log('User not authenticated - word not saved');
      return false;
    }

    // Check if word already exists for this user
    const exists = await wordExists(entry.word);
    if (exists) {
      console.log('Word already exists - skipping duplicate');
      return false;
    }

    // Insert new word
    const { error } = await supabase
      .from('words')
      .insert({
        user_id: user.id,
        word: entry.word,
        meaning: entry.meaning,
        eli5: entry.eli5,
        example: entry.exampleSentence,
        difficulty: entry.difficulty,
        correct_count: entry.correctCount,
        wrong_count: entry.wrongCount,
        last_reviewed: entry.lastReviewed || null,
        date_added: entry.dateAdded || new Date().toISOString().split('T')[0],
      });

    if (error) {
      console.error('Error saving word:', error);
      return false;
    }

    console.log('Word saved successfully:', entry.word);
    return true;
  } catch (error) {
    console.error('Error in saveWord:', error);
    return false;
  }
};

/**
 * Update word difficulty
 */
export const updateWordDifficulty = async (
  word: string,
  difficulty: 'normal' | 'difficult'
): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('User not authenticated - difficulty not updated');
      return;
    }

    const { error } = await supabase
      .from('words')
      .update({ difficulty })
      .eq('user_id', user.id)
      .eq('word', word);

    if (error) {
      console.error('Error updating word difficulty:', error);
    }
  } catch (error) {
    console.error('Error in updateWordDifficulty:', error);
  }
};

/**
 * Update word statistics (correct/wrong counts)
 */
export const updateWordStats = async (word: string, correct: boolean): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('User not authenticated - stats not updated');
      return;
    }

    // First, get current stats
    const { data: currentWord, error: fetchError } = await supabase
      .from('words')
      .select('correct_count, wrong_count')
      .eq('user_id', user.id)
      .eq('word', word)
      .single();

    if (fetchError || !currentWord) {
      console.error('Error fetching word stats:', fetchError);
      return;
    }

    const updateData: {
      correct_count?: number;
      wrong_count?: number;
      last_reviewed: string;
    } = {
      last_reviewed: new Date().toISOString().split('T')[0],
    };

    if (correct) {
      updateData.correct_count = (currentWord.correct_count || 0) + 1;
    } else {
      updateData.wrong_count = (currentWord.wrong_count || 0) + 1;
    }

    const { error } = await supabase
      .from('words')
      .update(updateData)
      .eq('user_id', user.id)
      .eq('word', word);

    if (error) {
      console.error('Error updating word stats:', error);
    }
  } catch (error) {
    console.error('Error in updateWordStats:', error);
  }
};

/**
 * Delete a word from user's vocabulary
 */
export const deleteWord = async (word: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('User not authenticated - word not deleted');
      return;
    }

    const { error } = await supabase
      .from('words')
      .delete()
      .eq('user_id', user.id)
      .eq('word', word);

    if (error) {
      console.error('Error deleting word:', error);
    }
  } catch (error) {
    console.error('Error in deleteWord:', error);
  }
};

/**
 * Get words for testing (smart selection based on difficulty and performance)
 */
export const getWordsForTest = async (count: number = 5): Promise<WordEntry[]> => {
  const vocabulary = await getVocabulary();
  if (vocabulary.length === 0) return [];

  // Smart selection: prioritize difficult and frequently wrong words
  const scored = vocabulary.map((word) => {
    let score = 0;
    // Difficult words get higher priority
    if (word.difficulty === 'difficult') score += 10;
    // More wrong answers = higher priority
    score += word.wrongCount * 3;
    // Less correct answers = higher priority
    score -= word.correctCount;
    // Recently reviewed words get lower priority
    const daysSinceReview = word.lastReviewed
      ? Math.floor((Date.now() - new Date(word.lastReviewed).getTime()) / (1000 * 60 * 60 * 24))
      : 30;
    score += Math.min(daysSinceReview, 30);
    
    return { word, score };
  });

  // Sort by score (highest first) and add some randomness
  scored.sort((a, b) => b.score - a.score + (Math.random() - 0.5) * 5);

  return scored.slice(0, Math.min(count, vocabulary.length)).map((s) => s.word);
};

/**
 * Get progress statistics for the user
 */
export const getProgressStats = async () => {
  const vocabulary = await getVocabulary();
  const totalWords = vocabulary.length;
  const difficultWords = vocabulary.filter((w) => w.difficulty === 'difficult').length;
  
  const totalCorrect = vocabulary.reduce((sum, w) => sum + w.correctCount, 0);
  const totalWrong = vocabulary.reduce((sum, w) => sum + w.wrongCount, 0);
  const totalAttempts = totalCorrect + totalWrong;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Words are "mastered" if they have 3+ correct and accuracy > 70%
  const masteredWords = vocabulary.filter((w) => {
    const attempts = w.correctCount + w.wrongCount;
    const wordAccuracy = attempts > 0 ? w.correctCount / attempts : 0;
    return w.correctCount >= 3 && wordAccuracy >= 0.7;
  }).length;

  // Weak words: difficulty is "difficult" or wrong > correct
  const weakWords = vocabulary.filter(
    (w) => w.difficulty === 'difficult' || w.wrongCount > w.correctCount
  ).length;

  return {
    totalWords,
    masteredWords,
    weakWords,
    difficultWords,
    accuracy,
    totalCorrect,
    totalWrong,
  };
};

/**
 * Check if a word already exists in user's vocabulary
 */
export const wordExists = async (word: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('words')
      .select('word')
      .eq('user_id', user.id)
      .ilike('word', word)
      .limit(1);

    if (error) {
      console.error('Error checking word existence:', error);
      return false;
    }

    return (data || []).length > 0;
  } catch (error) {
    console.error('Error in wordExists:', error);
    return false;
  }
};

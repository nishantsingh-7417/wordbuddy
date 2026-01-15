/**
 * Relevance AI Integration for WordBuddy
 * Provides strict JSON word data from AI mentor agent
 */

// Strict JSON schema types matching the AI agent contract
export interface AIWordResponse {
  word: string;
  level: 'beginner' | 'intermediate';
  core: {
    simple_meaning: string;
    hindi_meaning: string;
    short_meaning: string;
    examples: string[];
  };
  thinking: {
    hindi_thought: string;
    english_thought: string;
  };
  practice: {
    type: 'fill_blank';
    prompt: string;
  };
  advanced: {
    confusion: string;
    related_words: string[];
    opposites: string[];
    memory_trick: string;
  };
}

// API configuration - update these values in .env.local
const RELEVANCE_API_URL = import.meta.env.VITE_RELEVANCE_API_URL || '';
const RELEVANCE_API_KEY = import.meta.env.VITE_RELEVANCE_API_KEY || '';

/**
 * Validates that a parsed object matches the AIWordResponse schema
 */
function isValidAIResponse(data: unknown): data is AIWordResponse {
  if (!data || typeof data !== 'object') return false;
  
  const obj = data as Record<string, unknown>;
  
  // Check required top-level keys
  if (typeof obj.word !== 'string') return false;
  if (obj.level !== 'beginner' && obj.level !== 'intermediate') return false;
  
  // Check core object
  const core = obj.core as Record<string, unknown> | undefined;
  if (!core || typeof core !== 'object') return false;
  if (typeof core.simple_meaning !== 'string') return false;
  if (typeof core.hindi_meaning !== 'string') return false;
  if (typeof core.short_meaning !== 'string') return false;
  if (!Array.isArray(core.examples)) return false;
  
  // Check thinking object
  const thinking = obj.thinking as Record<string, unknown> | undefined;
  if (!thinking || typeof thinking !== 'object') return false;
  if (typeof thinking.hindi_thought !== 'string') return false;
  if (typeof thinking.english_thought !== 'string') return false;
  
  // Check practice object
  const practice = obj.practice as Record<string, unknown> | undefined;
  if (!practice || typeof practice !== 'object') return false;
  if (practice.type !== 'fill_blank') return false;
  if (typeof practice.prompt !== 'string') return false;
  
  // Check advanced object
  const advanced = obj.advanced as Record<string, unknown> | undefined;
  if (!advanced || typeof advanced !== 'object') return false;
  if (typeof advanced.confusion !== 'string') return false;
  if (!Array.isArray(advanced.related_words)) return false;
  if (!Array.isArray(advanced.opposites)) return false;
  if (typeof advanced.memory_trick !== 'string') return false;
  
  return true;
}

/**
 * Fetches AI-enhanced word data from Relevance AI agent
 * Returns null on any error (network, timeout, invalid JSON)
 */
export async function fetchAIWordData(word: string): Promise<AIWordResponse | null> {
  // Skip if API not configured
  if (!RELEVANCE_API_URL || !RELEVANCE_API_KEY) {
    console.warn('[RelevanceAI] API not configured. Set VITE_RELEVANCE_API_URL and VITE_RELEVANCE_API_KEY in .env.local');
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(RELEVANCE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': RELEVANCE_API_KEY,
      },
      body: JSON.stringify({
        message: `Explain the word: ${word}`,
        conversation_id: null, // New conversation each time
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[RelevanceAI] API error:', response.status, response.statusText);
      return null;
    }

    const rawResponse = await response.json();
    
    // Relevance AI typically returns { answer: "..." } or { output: "..." }
    // The answer should be the strict JSON string
    let jsonString: string | null = null;
    
    if (typeof rawResponse === 'string') {
      jsonString = rawResponse;
    } else if (rawResponse?.answer && typeof rawResponse.answer === 'string') {
      jsonString = rawResponse.answer;
    } else if (rawResponse?.output && typeof rawResponse.output === 'string') {
      jsonString = rawResponse.output;
    } else if (rawResponse?.message && typeof rawResponse.message === 'string') {
      jsonString = rawResponse.message;
    }

    if (!jsonString) {
      console.error('[RelevanceAI] Unexpected response format:', rawResponse);
      return null;
    }

    // Parse the JSON string
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('[RelevanceAI] Failed to parse JSON:', parseError, '\nRaw:', jsonString);
      return null;
    }

    // Validate against schema
    if (!isValidAIResponse(parsed)) {
      console.error('[RelevanceAI] Response does not match schema:', parsed);
      return null;
    }

    return parsed;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[RelevanceAI] Request timed out');
    } else {
      console.error('[RelevanceAI] Fetch error:', error);
    }
    return null;
  }
}

/**
 * Empty/default AI response for fallback scenarios
 */
export function getEmptyAIResponse(word: string): AIWordResponse {
  return {
    word,
    level: 'beginner',
    core: {
      simple_meaning: '',
      hindi_meaning: '',
      short_meaning: '',
      examples: [],
    },
    thinking: {
      hindi_thought: '',
      english_thought: '',
    },
    practice: {
      type: 'fill_blank',
      prompt: '',
    },
    advanced: {
      confusion: '',
      related_words: [],
      opposites: [],
      memory_trick: '',
    },
  };
}

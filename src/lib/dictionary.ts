interface DictionaryResponse {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }[];
    synonyms?: string[];
    antonyms?: string[];
  }[];
}

export interface WordDefinition {
  word: string;
  partOfSpeech: string;
  partOfSpeechExplanation: string;
  simpleMeaning: string;
  eli5Explanation: string;
  exampleSentences: string[];
  wordForms: {
    adjective?: string;
    noun?: string;
    verb?: string;
    adverb?: string;
  };
  usagePatterns: string[];
  synonyms: string[];
  opposites: string[];
}

const getPartOfSpeechExplanation = (pos: string): string => {
  const explanations: Record<string, string> = {
    'noun': 'A word that names a person, place, thing, or idea',
    'verb': 'A word that shows an action or what something does',
    'adjective': 'A word that describes a person, place, or thing',
    'adverb': 'A word that describes how, when, or where something happens',
    'pronoun': 'A word that takes the place of a noun (like he, she, it)',
    'preposition': 'A word that shows position or relationship (like in, on, under)',
    'conjunction': 'A word that connects other words or sentences (like and, but, or)',
    'interjection': 'A word that expresses emotion or surprise (like wow, ouch)',
  };
  return explanations[pos.toLowerCase()] || 'A type of word';
};

const generateSimpleMeaning = (definition: string): string => {
  // Simplify complex definitions
  let simple = definition
    .replace(/\\b(pertaining to|relating to|characterized by)\\b/gi, 'about')
    .replace(/\\b(utilize|employ)\\b/gi, 'use')
    .replace(/\\b(commence|initiate)\\b/gi, 'start')
    .replace(/\\b(terminate|conclude)\\b/gi, 'end')
    .replace(/\\b(sufficient)\\b/gi, 'enough')
    .replace(/\\b(subsequently)\\b/gi, 'then')
    .replace(/\\b(approximately)\\b/gi, 'about')
    .replace(/\\b(numerous)\\b/gi, 'many')
    .replace(/\\b(obtain|acquire)\\b/gi, 'get')
    .replace(/\\b(possess)\\b/gi, 'have');

  // Take first sentence if too long
  if (simple.length > 120) {
    const sentences = simple.split(/[.!?]+/);
    simple = sentences[0].trim() + '.';
  }

  return simple;
};

const generateELI5 = (word: string, meaning: string, pos: string): string => {
  const simple = generateSimpleMeaning(meaning);
  
  // Add context based on part of speech
  const contexts: Record<string, string> = {
    'noun': `This is a thing or idea. ${simple}`,
    'verb': `This is something you do. ${simple}`,
    'adjective': `This describes how something is. ${simple}`,
    'adverb': `This tells you more about how something happens. ${simple}`,
  };

  return contexts[pos.toLowerCase()] || simple;
};

const generateExamples = (word: string, apiExample?: string, pos?: string): string[] => {
  const examples: string[] = [];
  
  // Use API example if available
  if (apiExample) {
    examples.push(apiExample);
  }

  // Generate 2-3 examples based on part of speech
  const templates: Record<string, string[]> = {
    'adjective': [
      `She feels ${word} today.`,
      `The ${word} children are playing outside.`,
      `I am ${word} when I see my friends.`
    ],
    'noun': [
      `The ${word} is very important.`,
      `I saw a ${word} yesterday.`,
      `Everyone needs ${word} in their life.`
    ],
    'verb': [
      `I ${word} every day.`,
      `She likes to ${word}.`,
      `They ${word} together.`
    ],
  };

  const posExamples = templates[pos?.toLowerCase() || ''] || [
    `I learned about ${word}.`,
    `${word.charAt(0).toUpperCase() + word.slice(1)} is interesting.`,
    `People often talk about ${word}.`
  ];

  // Add examples until we have 3
  while (examples.length < 3) {
    const index = examples.length;
    if (posExamples[index]) {
      examples.push(posExamples[index]);
    } else {
      examples.push(`This is an example with ${word}.`);
    }
  }

  return examples.slice(0, 3);
};

const generateWordForms = (word: string, pos: string): Record<string, string | undefined> => {
  // This is a simplified version - in real app you'd use a proper morphology library
  const forms: Record<string, string | undefined> = {};

  if (pos === 'adjective') {
    forms.adjective = word;
    forms.adverb = word.endsWith('y') ? word.slice(0, -1) + 'ily' : word + 'ly';
    forms.noun = word + 'ness';
  } else if (pos === 'noun') {
    forms.noun = word;
  } else if (pos === 'verb') {
    forms.verb = word;
    forms.noun = word + 'ing';
  }

  return forms;
};

const generateUsagePatterns = (word: string, pos: string): string[] => {
  const patterns: Record<string, string[]> = {
    'adjective': [
      `(something) is ${word}`,
      `feel ${word}`,
      `a ${word} (thing)`
    ],
    'noun': [
      `the ${word} of (something)`,
      `a ${word}`,
      `(someone)'s ${word}`
    ],
    'verb': [
      `(someone) ${word}s`,
      `to ${word} (something)`,
      `${word}ing`
    ],
  };

  return patterns[pos.toLowerCase()] || [
    `use ${word}`,
    `talk about ${word}`,
    `${word} is important`
  ];
};

export const searchWord = async (word: string): Promise<WordDefinition | null> => {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase().trim())}`
    );

    if (!response.ok) {
      return null;
    }

    const data: DictionaryResponse[] = await response.json();
    
    if (!data || data.length === 0) {
      return null;
    }

    const firstResult = data[0];
    const firstMeaning = firstResult.meanings[0];
    const firstDefinition = firstMeaning?.definitions[0];

    if (!firstDefinition) {
      return null;
    }

    const partOfSpeech = firstMeaning.partOfSpeech;
    const definition = firstDefinition.definition;
    
    // Collect all synonyms and antonyms
    const allSynonyms = [
      ...(firstDefinition.synonyms || []),
      ...(firstMeaning.synonyms || [])
    ].filter(Boolean).slice(0, 4);
    
    const allAntonyms = [
      ...(firstDefinition.antonyms || []),
      ...(firstMeaning.antonyms || [])
    ].filter(Boolean).slice(0, 2);

    return {
      word: firstResult.word.charAt(0).toUpperCase() + firstResult.word.slice(1),
      partOfSpeech: partOfSpeech,
      partOfSpeechExplanation: getPartOfSpeechExplanation(partOfSpeech),
      simpleMeaning: generateSimpleMeaning(definition),
      eli5Explanation: generateELI5(word, definition, partOfSpeech),
      exampleSentences: generateExamples(word, firstDefinition.example, partOfSpeech),
      wordForms: generateWordForms(word, partOfSpeech),
      usagePatterns: generateUsagePatterns(word, partOfSpeech),
      synonyms: allSynonyms.length > 0 ? allSynonyms : ['No common synonyms found'],
      opposites: allAntonyms.length > 0 ? allAntonyms : ['No common opposites found'],
    };
  } catch (error) {
    console.error('Error fetching word definition:', error);
    return null;
  }
};

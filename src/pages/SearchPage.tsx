import { useState } from 'react';
import { Search, BookOpen, Lightbulb, MessageSquare, Check, Loader2, Tag, Repeat, ThumbsUp, ThumbsDown, Brain, Languages, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Layout } from '@/components/Layout';
import { searchWord, WordDefinition } from '@/lib/dictionary';
import { fetchAIWordData, AIWordResponse } from '@/lib/relevanceAI';
import { saveWord, wordExists } from '@/lib/vocabulary';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [result, setResult] = useState<WordDefinition | null>(null);
  const [aiData, setAiData] = useState<AIWordResponse | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Auth state is now managed by AuthContext
  const isAuthenticated = !!user;

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setAiData(null);
    setShowAdvanced(false);
    setSaved(false);

    const definition = await searchWord(query);

    if (definition) {
      setResult(definition);
      setIsLoading(false);
      
      // Fetch AI-enhanced data in parallel (non-blocking)
      setIsAILoading(true);
      fetchAIWordData(definition.word.toLowerCase())
        .then((aiResponse) => {
          if (aiResponse) {
            setAiData(aiResponse);
          }
        })
        .catch((err) => {
          console.error('[SearchPage] AI fetch failed:', err);
          // Silent failure - dictionary results remain visible
        })
        .finally(() => {
          setIsAILoading(false);
        });
      
      // Auto-save the word if user is authenticated
      if (isAuthenticated) {
        const alreadyExists = await wordExists(definition.word);
        const saved = await saveWord({
          word: definition.word,
          meaning: definition.simpleMeaning,
          eli5: definition.eli5Explanation,
          exampleSentence: definition.exampleSentences[0],
          difficulty: 'normal',
          correctCount: 0,
          wrongCount: 0,
          lastReviewed: new Date().toISOString().split('T')[0],
          dateAdded: new Date().toISOString().split('T')[0],
        });

        if (saved) {
          setSaved(true);
          toast({
            title: 'Word Saved!',
            description: `"${definition.word}" has been added to your vocabulary.`,
          });
        } else if (alreadyExists) {
          // Word already exists, show feedback
          setSaved(true);
          toast({
            title: 'Already Saved',
            description: `"${definition.word}" is already in your vocabulary.`,
          });
        }
      }
      // Unauthenticated users: no save, no toast, no errors
    } else {
      setError("Couldn't find this word. Please check the spelling and try again.");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Search a Word</h1>
          <p className="text-muted-foreground">
            Type any English word to learn its meaning
          </p>
        </div>

        {/* Search Input */}
        <Card variant="elevated" className="mb-6 animate-fade-up">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Type a word (e.g., happy, curious, adventure)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-14 text-lg rounded-xl"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isLoading || !query.trim()}
                variant="hero"
                size="lg"
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card variant="destructive" className="mb-6 animate-scale-in">
            <CardContent className="p-4 text-center">
              <p className="text-destructive font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4 animate-fade-up">
            {/* Word Header */}
            <Card variant="elevated">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-4xl text-gradient capitalize mb-2">
                      {result.word}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-semibold">{result.partOfSpeech}</span>
                      <span className="mx-2">•</span>
                      <span>{result.partOfSpeechExplanation}</span>
                    </div>
                  </div>
                  {isAuthenticated && saved && (
                    <div className="flex items-center gap-2 text-success">
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-medium">Saved</span>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Simple Meaning */}
            <Card variant="interactive">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Simple Meaning</h3>
                    <p className="text-muted-foreground">{result.simpleMeaning}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ELI5 */}
            <Card variant="interactive">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">ELI5 Explanation</h3>
                    <p className="text-muted-foreground">{result.eli5Explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example Sentences */}
            <Card variant="interactive">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-3">Example Sentences</h3>
                    <ul className="space-y-2">
                      {result.exampleSentences.map((sentence, idx) => (
                        <li key={idx} className="text-muted-foreground italic">
                          {idx + 1}. "{sentence}"
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Word Forms */}
            {Object.keys(result.wordForms).some(key => result.wordForms[key as keyof typeof result.wordForms]) && (
              <Card variant="interactive">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Tag className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-3">Word Forms</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {result.wordForms.adjective && (
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Adjective</span>
                            <p className="font-medium">{result.wordForms.adjective}</p>
                          </div>
                        )}
                        {result.wordForms.noun && (
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Noun</span>
                            <p className="font-medium">{result.wordForms.noun}</p>
                          </div>
                        )}
                        {result.wordForms.verb && (
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Verb</span>
                            <p className="font-medium">{result.wordForms.verb}</p>
                          </div>
                        )}
                        {result.wordForms.adverb && (
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Adverb</span>
                            <p className="font-medium">{result.wordForms.adverb}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Usage Patterns */}
            <Card variant="interactive">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                    <Repeat className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-3">Common Usage Patterns</h3>
                    <ul className="space-y-2">
                      {result.usagePatterns.map((pattern, idx) => (
                        <li key={idx} className="text-muted-foreground font-mono text-sm bg-muted px-3 py-2 rounded-lg">
                          {pattern}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Synonyms and Opposites */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card variant="interactive">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                      <ThumbsUp className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">Synonyms</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.synonyms.map((syn, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                            {syn}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="interactive">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                      <ThumbsDown className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">Opposite Words</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.opposites.map((opp, idx) => (
                          <span key={idx} className="px-3 py-1 bg-red-500/10 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                            {opp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI-Enhanced Content */}
            {isAILoading && (
              <Card variant="interactive">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading AI insights...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {aiData && (
              <>
                {/* Hindi Meaning - Always Visible */}
                {aiData.core.hindi_meaning && (
                  <Card variant="interactive">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                          <Languages className="w-6 h-6 text-violet-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">Hindi Meaning</h3>
                          <p className="text-muted-foreground">{aiData.core.hindi_meaning}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Thinking Section - Always Visible */}
                {(aiData.thinking.hindi_thought || aiData.thinking.english_thought) && (
                  <Card variant="interactive">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                          <Brain className="w-6 h-6 text-amber-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-3">Think About It</h3>
                          {aiData.thinking.hindi_thought && (
                            <p className="text-muted-foreground mb-2 italic">
                              "{aiData.thinking.hindi_thought}"
                            </p>
                          )}
                          {aiData.thinking.english_thought && (
                            <p className="text-muted-foreground text-sm">
                              → {aiData.thinking.english_thought}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Practice Prompt - Always Visible */}
                {aiData.practice.prompt && (
                  <Card variant="interactive" className="border-2 border-dashed border-primary/30">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">Practice Time!</h3>
                          <p className="text-muted-foreground font-medium">
                            {aiData.practice.prompt}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Show More Toggle */}
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show more about this word
                    </>
                  )}
                </Button>

                {/* Advanced Section - Expanded View Only */}
                {showAdvanced && (
                  <div className="space-y-4 animate-fade-up">
                    {/* Common Confusion */}
                    {aiData.advanced.confusion && (
                      <Card variant="interactive">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                              <Lightbulb className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg mb-1">Common Mistake</h3>
                              <p className="text-muted-foreground">{aiData.advanced.confusion}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Related Words from AI */}
                    {aiData.advanced.related_words.length > 0 && (
                      <Card variant="interactive">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
                              <Tag className="w-6 h-6 text-teal-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-2">Related Words</h3>
                              <div className="flex flex-wrap gap-2">
                                {aiData.advanced.related_words.map((word, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-teal-500/10 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium">
                                    {word}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Memory Trick */}
                    {aiData.advanced.memory_trick && (
                      <Card variant="interactive" className="bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                              <Brain className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg mb-1">Memory Trick</h3>
                              <p className="text-muted-foreground">{aiData.advanced.memory_trick}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Empty State */}
        {!result && !error && !isLoading && (
          <div className="text-center py-12 animate-fade-up">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Search for any English word above. We'll show you a comprehensive breakdown including meaning, examples, word forms, and more!            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;

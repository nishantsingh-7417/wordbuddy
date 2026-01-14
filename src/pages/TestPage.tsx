import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, CheckCircle2, XCircle, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { Progress } from '@/components/ui/progress';
import { getWordsForTest, updateWordStats, getVocabulary, WordEntry } from '@/lib/vocabulary';

interface Question {
  word: WordEntry;
  options: string[];
  correctAnswer: string;
}

type TestState = 'start' | 'testing' | 'result';

const TestPage = () => {
  const [testState, setTestState] = useState<TestState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<{ word: string; correct: boolean }[]>([]);
  const [vocabulary, setVocabulary] = useState<WordEntry[]>([]);

  // Load vocabulary on mount
  useEffect(() => {
    const loadVocabulary = async () => {
      const words = await getVocabulary();
      setVocabulary(words);
    };
    loadVocabulary();
  }, []);

  const generateQuestions = async () => {
    const testWords = await getWordsForTest(5);
    if (testWords.length === 0) return [];

    const allMeanings = vocabulary.map((w) => w.meaning);

    return testWords.map((word) => {
      // Get 3 random wrong answers
      const wrongMeanings = allMeanings
        .filter((m) => m !== word.meaning)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      // Combine and shuffle options
      const options = [...wrongMeanings, word.meaning].sort(() => Math.random() - 0.5);

      return {
        word,
        options,
        correctAnswer: word.meaning,
      };
    });
  };

  const startTest = async () => {
    const newQuestions = await generateQuestions();
    if (newQuestions.length < 2) return;
    
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setResults([]);
    setTestState('testing');
  };

  const handleSelectAnswer = async (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    // Update word stats
    await updateWordStats(currentQuestion.word.word, isCorrect);

    // Record result
    setResults((prev) => [...prev, { word: currentQuestion.word.word, correct: isCorrect }]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setTestState('result');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const correctCount = results.filter((r) => r.correct).length;
  const score = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

  if (vocabulary.length < 4) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Build Your Vocabulary First</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            You need at least 4 words in your vocabulary to take a test. Start by searching and saving some words!
          </p>
          <Button asChild variant="hero" size="lg">
            <Link to="/search">
              Search Words
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Start Screen */}
        {testState === 'start' && (
          <div className="text-center py-12 animate-fade-up">
            <div className="w-24 h-24 rounded-full gradient-hero flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Ready to Test?</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Match words with their meanings. Wrong answers will appear more often to help you learn!
            </p>
            <Button onClick={startTest} variant="hero" size="lg">
              Start Test
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Testing Screen */}
        {testState === 'testing' && currentQuestion && (
          <div className="animate-fade-up">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Question */}
            <Card variant="elevated" className="mb-6">
              <CardHeader className="text-center pb-2">
                <p className="text-sm text-muted-foreground mb-2">What does this word mean?</p>
                <CardTitle className="text-4xl text-gradient capitalize">
                  {currentQuestion.word.word}
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Options */}
            <div className="grid gap-3 mb-6">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                
                let variant: 'default' | 'success' | 'destructive' = 'default';
                if (showResult) {
                  if (isCorrect) variant = 'success';
                  else if (isSelected) variant = 'destructive';
                }

                return (
                  <Card
                    key={index}
                    variant={showResult ? (isCorrect ? 'success' : isSelected ? 'destructive' : 'flat') : 'interactive'}
                    className={`cursor-pointer transition-all ${!showResult && 'hover:border-primary'}`}
                    onClick={() => handleSelectAnswer(option)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold ${
                        showResult && isCorrect
                          ? 'bg-success text-success-foreground'
                          : showResult && isSelected
                          ? 'bg-destructive text-destructive-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {showResult && isCorrect && <CheckCircle2 className="w-5 h-5" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                        {!showResult && String.fromCharCode(65 + index)}
                      </div>
                      <p className="text-base">{option}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Next Button */}
            {showResult && (
              <div className="text-center animate-scale-in">
                <Button onClick={handleNext} variant="hero" size="lg">
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Results Screen */}
        {testState === 'result' && (
          <div className="text-center py-8 animate-fade-up">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              score >= 80 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-destructive'
            }`}>
              <span className="text-4xl font-bold text-primary-foreground">{score}%</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {score >= 80 ? 'Excellent!' : score >= 50 ? 'Good Job!' : 'Keep Practicing!'}
            </h1>
            <p className="text-muted-foreground mb-8">
              You got {correctCount} out of {results.length} correct
            </p>

            {/* Results Breakdown */}
            <Card variant="elevated" className="mb-8 text-left">
              <CardHeader>
                <CardTitle className="text-lg">Results Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {result.correct ? (
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive shrink-0" />
                    )}
                    <span className="capitalize font-medium">{result.word}</span>
                    <span className={`text-sm ml-auto ${result.correct ? 'text-success' : 'text-destructive'}`}>
                      {result.correct ? 'Correct' : 'Wrong'}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={startTest} variant="hero" size="lg">
                <RotateCcw className="w-5 h-5" />
                Try Again
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to="/progress">
                  View Progress
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TestPage;

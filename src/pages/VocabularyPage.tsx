import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, AlertTriangle, Trash2, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getVocabulary, updateWordDifficulty, deleteWord, WordEntry } from '@/lib/vocabulary';
import { useToast } from '@/hooks/use-toast';

const VocabularyPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'normal' | 'difficult'>('all');
  const [vocabulary, setVocabulary] = useState<WordEntry[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null);
  const [wordToDelete, setWordToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const refreshVocabulary = async () => {
    const words = await getVocabulary();
    setVocabulary(words);
  };

  // Load vocabulary on mount
  useEffect(() => {
    refreshVocabulary();
  }, []);

  const filteredWords = useMemo(() => {
    return vocabulary.filter((word) => {
      const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.meaning.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'all' || word.difficulty === filter;
      return matchesSearch && matchesFilter;
    });
  }, [vocabulary, searchQuery, filter]);

  const handleToggleDifficulty = async (word: WordEntry) => {
    const newDifficulty = word.difficulty === 'normal' ? 'difficult' : 'normal';
    await updateWordDifficulty(word.word, newDifficulty);
    await refreshVocabulary();
    toast({
      title: newDifficulty === 'difficult' ? 'Marked as Difficult' : 'Marked as Normal',
      description: `"${word.word}" difficulty has been updated.`,
    });
  };

  const handleDelete = async () => {
    if (wordToDelete) {
      await deleteWord(wordToDelete);
      await refreshVocabulary();
      setWordToDelete(null);
      toast({
        title: 'Word Deleted',
        description: 'The word has been removed from your vocabulary.',
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">My Vocabulary</h1>
            <p className="text-muted-foreground">
              {vocabulary.length} words saved
            </p>
          </div>
          <Button asChild variant="hero">
            <Link to="/search">
              <Plus className="w-4 h-4" />
              Add Word
            </Link>
          </Button>
        </div>

        {/* Search and Filter */}
        <Card variant="elevated" className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search words..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'secondary'}
                  onClick={() => setFilter('all')}
                  className="flex-1 sm:flex-none"
                >
                  All
                </Button>
                <Button
                  variant={filter === 'normal' ? 'default' : 'secondary'}
                  onClick={() => setFilter('normal')}
                  className="flex-1 sm:flex-none"
                >
                  Normal
                </Button>
                <Button
                  variant={filter === 'difficult' ? 'warning' : 'secondary'}
                  onClick={() => setFilter('difficult')}
                  className="flex-1 sm:flex-none"
                >
                  Difficult
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Word List */}
        {filteredWords.length > 0 ? (
          <div className="grid gap-4">
            {filteredWords.map((word) => (
              <Card key={word.word} variant="interactive">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold capitalize truncate">
                          {word.word}
                        </h3>
                        <Badge variant={word.difficulty === 'difficult' ? 'difficult' : 'normal'}>
                          {word.difficulty === 'difficult' ? (
                            <>
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Difficult
                            </>
                          ) : (
                            'Normal'
                          )}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground line-clamp-2">
                        {word.meaning}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>✓ {word.correctCount} correct</span>
                        <span>✗ {word.wrongCount} wrong</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedWord(word)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleDifficulty(word)}
                      >
                        <AlertTriangle className={`w-4 h-4 ${word.difficulty === 'difficult' ? 'text-warning' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setWordToDelete(word.word)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {vocabulary.length === 0 ? 'No Words Yet' : 'No Results Found'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {vocabulary.length === 0
                ? 'Start building your vocabulary by searching for words.'
                : 'Try adjusting your search or filter.'}
            </p>
            {vocabulary.length === 0 && (
              <Button asChild variant="hero">
                <Link to="/search">Search Your First Word</Link>
              </Button>
            )}
          </div>
        )}

        {/* Word Detail Dialog */}
        <Dialog open={!!selectedWord} onOpenChange={() => setSelectedWord(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl capitalize">
                {selectedWord?.word}
              </DialogTitle>
              <DialogDescription>
                Added on {selectedWord?.dateAdded}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="font-semibold mb-1">Meaning</h4>
                <p className="text-muted-foreground">{selectedWord?.meaning}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Simple Explanation</h4>
                <p className="text-muted-foreground">{selectedWord?.eli5}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Example</h4>
                <p className="text-muted-foreground italic">"{selectedWord?.exampleSentence}"</p>
              </div>
              <div className="flex gap-4 pt-2">
                <Badge variant={selectedWord?.difficulty === 'difficult' ? 'difficult' : 'normal'}>
                  {selectedWord?.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ✓ {selectedWord?.correctCount} | ✗ {selectedWord?.wrongCount}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!wordToDelete} onOpenChange={() => setWordToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Word?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{wordToDelete}" from your vocabulary? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default VocabularyPage;

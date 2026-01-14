import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BookOpen, Trophy, AlertTriangle, Target, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { Progress } from '@/components/ui/progress';
import { getProgressStats, getVocabulary } from '@/lib/vocabulary';

const ProgressPage = () => {
  const [stats, setStats] = useState({
    totalWords: 0,
    masteredWords: 0,
    weakWords: 0,
    difficultWords: 0,
    accuracy: 0,
    totalCorrect: 0,
    totalWrong: 0,
  });
  const [vocabulary, setVocabulary] = useState<any[]>([]);

  // Load vocabulary and stats on mount
  useEffect(() => {
    const loadData = async () => {
      const words = await getVocabulary();
      setVocabulary(words);
      const progressStats = await getProgressStats();
      setStats(progressStats);
    };
    loadData();
  }, []);

  const statCards = [
    {
      title: 'Total Words',
      value: stats.totalWords,
      icon: BookOpen,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Mastered',
      value: stats.masteredWords,
      icon: Trophy,
      color: 'bg-success/10 text-success',
    },
    {
      title: 'Need Practice',
      value: stats.weakWords,
      icon: AlertTriangle,
      color: 'bg-warning/10 text-warning',
    },
    {
      title: 'Accuracy',
      value: `${stats.accuracy}%`,
      icon: Target,
      color: 'bg-accent/10 text-accent',
    },
  ];

  if (vocabulary.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">No Progress Yet</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Start learning words and taking tests to see your progress here!
          </p>
          <Button asChild variant="hero" size="lg">
            <Link to="/search">Start Learning</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const masteryPercentage = stats.totalWords > 0 
    ? Math.round((stats.masteredWords / stats.totalWords) * 100) 
    : 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your vocabulary learning journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} variant="elevated">
                <CardContent className="p-4 md:p-6">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mastery Progress */}
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning" />
              Mastery Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {stats.masteredWords} of {stats.totalWords} words mastered
                </span>
                <span className="font-semibold">{masteryPercentage}%</span>
              </div>
              <Progress value={masteryPercentage} className="h-4" />
              <p className="text-sm text-muted-foreground">
                Words are considered mastered when you answer them correctly 3+ times with 70%+ accuracy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Stats */}
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Test Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 rounded-xl bg-success/10">
                <p className="text-3xl font-bold text-success">{stats.totalCorrect}</p>
                <p className="text-sm text-muted-foreground">Correct Answers</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-destructive/10">
                <p className="text-3xl font-bold text-destructive">{stats.totalWrong}</p>
                <p className="text-sm text-muted-foreground">Wrong Answers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="hero" size="lg">
            <Link to="/test">
              <GraduationCap className="w-5 h-5" />
              Take a Test
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link to="/vocabulary">
              <BookOpen className="w-5 h-5" />
              Review Words
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ProgressPage;

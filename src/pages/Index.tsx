import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, GraduationCap, BarChart3, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { LexiAIModal } from '@/components/LexiAIModal';

const steps = [
  {
    icon: Search,
    title: 'Search',
    description: 'Look up any English word instantly',
  },
  {
    icon: BookOpen,
    title: 'Save',
    description: 'Words are saved automatically to your list',
  },
  {
    icon: GraduationCap,
    title: 'Revise',
    description: 'Take fun quizzes to remember words',
  },
  {
    icon: BarChart3,
    title: 'Improve',
    description: 'Track your progress and master vocabulary',
  },
];

const Index = () => {
  const [isLexiModalOpen, setIsLexiModalOpen] = useState(false);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="text-center py-8 md:py-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Your vocabulary learning companion</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Learn English vocabulary
            <span className="text-gradient block">daily, without stress.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Build your English vocabulary one word at a time. Search, save, revise, and track your progress — all in one simple app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/search">
                <Search className="w-5 h-5" />
                Search a Word
              </Link>
            </Button>
            <Button asChild variant="accent" size="lg">
              <Link to="/test">
                <GraduationCap className="w-5 h-5" />
                Start Revision
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setIsLexiModalOpen(true)}
              className="border-2 border-purple-500/50 hover:bg-purple-500/10 hover:border-purple-500"
            >
              <MessageCircle className="w-5 h-5 text-purple-500" />
              Talk with Lexi AI
            </Button>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            How WordBuddy Works
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card 
                  key={step.title} 
                  variant="interactive"
                  className="relative overflow-hidden group"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8">
          <Card variant="elevated" className="overflow-hidden">
            <div className="gradient-hero p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Ready to expand your vocabulary?
              </h2>
              <p className="text-primary-foreground/90 mb-6 max-w-md mx-auto">
                Start by searching for any word you want to learn. Your journey to better English begins now!
              </p>
              <Button asChild variant="secondary" size="lg">
                <Link to="/search">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </Card>
        </section>
      </div>

      {/* Lexi AI Modal */}
      <LexiAIModal 
        isOpen={isLexiModalOpen} 
        onClose={() => setIsLexiModalOpen(false)} 
      />
    </Layout>
  );
};

export default Index;

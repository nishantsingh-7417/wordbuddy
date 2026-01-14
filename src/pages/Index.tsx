import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, GraduationCap, BarChart3, ArrowRight, Sparkles, MessageCircle, Brain, Target, Heart, HelpCircle, Check, X, Quote, Shield, Code, Lightbulb } from 'lucide-react';
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

const faqs = [
  {
    question: "Who is WordBuddy for?",
    answer: "Anyone who wants to think and speak in English naturally — students, professionals, job seekers, or anyone preparing for interviews and exams."
  },
  {
    question: "Is this for beginners?",
    answer: "Yes! Whether you're starting fresh or already know some English, WordBuddy helps you build real understanding, not just memorization."
  },
  {
    question: "Do I need good grammar first?",
    answer: "Not at all. WordBuddy focuses on vocabulary and thinking patterns. Grammar comes naturally when you understand words deeply."
  },
  {
    question: "Is it free?",
    answer: "The core features are free. We believe everyone deserves access to quality English learning tools."
  },
  {
    question: "How is it different from Duolingo?",
    answer: "Duolingo gamifies language learning. WordBuddy focuses on deep word understanding, context, and building the ability to think in English — not just translate."
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

        {/* ==================== NEW SECTIONS BELOW ==================== */}

        {/* Why WordBuddy Section */}
        <section className="py-16 border-t">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why WordBuddy?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              English learning in India is broken. Here's what nobody tells you.
            </p>
          </div>

          <div className="space-y-8">
            <Card variant="interactive" className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                  <X className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Memorization Doesn't Work</h3>
                  <p className="text-muted-foreground">
                    We've all tried mugging up word lists before exams. But ask yourself — how many do you actually remember? 
                    Rote learning gives you short-term recall, not real understanding. That's why you forget most words within weeks.
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="interactive" className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Brain className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Thinking in Hindi, Speaking in English</h3>
                  <p className="text-muted-foreground">
                    Most of us think in Hindi and translate to English while speaking. This creates a delay, makes us nervous, 
                    and limits our fluency. Real English confidence comes when you start <strong>thinking</strong> in English directly.
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="interactive" className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">The Hidden Barrier in Indian Education</h3>
                  <p className="text-muted-foreground">
                    Lakhs of talented students crack competitive exams every year, but struggle in interviews. 
                    They know the concepts, but can't express them. English isn't just a language — it's a confidence barrier 
                    that holds back brilliant minds from reaching their potential.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* How WordBuddy Is Different */}
        <section className="py-16 border-t">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How WordBuddy Is Different
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're not another dictionary or flashcard app. Here's our approach.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-2 border-red-200 bg-red-50/30 dark:bg-red-950/10 dark:border-red-900/30">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <X className="w-5 h-5 text-red-500" />
                What WordBuddy is NOT
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                  <span>Not just a dictionary with definitions</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                  <span>Not another boring textbook approach</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                  <span>Not gamified streaks without real learning</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                  <span>Not translation-based learning</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-2 border-green-200 bg-green-50/30 dark:bg-green-950/10 dark:border-green-900/30">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                What WordBuddy IS
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                  <span><strong>Psychology-based:</strong> Learn how your brain actually remembers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                  <span><strong>Thinking-first:</strong> Understand words in context, not isolation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                  <span><strong>AI Mentor:</strong> Get personalized help from Lexi AI</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                  <span><strong>Progress tracking:</strong> See your real improvement over time</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 border-t">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <HelpCircle className="w-8 h-8 text-primary" />
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} variant="interactive" className="p-5">
                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Founder's Desk */}
        <section className="py-16 border-t">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              From the Founder's Desk
            </h2>
          </div>

          <Card variant="elevated" className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                <span className="text-2xl font-bold text-white">NS</span>
              </div>
              
              <div className="flex-1">
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Hi, I'm <strong className="text-foreground">Nishant Singh</strong>.
                  </p>
                  
                  <p>
                    I cracked JEE using numerical and logical learning — patterns, formulas, problem-solving. 
                    It worked. I got into <strong className="text-foreground">NIT Jalandhar</strong>.
                  </p>
                  
                  <p>
                    But when I got there, I realized something that nobody had prepared me for: 
                    <strong className="text-foreground"> the communication gap</strong>. 
                    I could solve complex engineering problems, but I struggled to express my ideas clearly in English. 
                    And I wasn't alone — so many of my batchmates felt the same way.
                  </p>
                  
                  <p>
                    We had cracked one of the toughest exams in the country. We understood physics, chemistry, 
                    and mathematics at advanced levels. But in group discussions, interviews, and presentations — 
                    we would freeze. Not because we didn't know the answer, but because we couldn't find the right words.
                  </p>
                  
                  <p>
                    That's when I understood: <strong className="text-foreground">English is a hidden barrier in Indian education</strong>. 
                    Brilliant minds are held back, not by ability, but by the inability to express themselves.
                  </p>
                  
                  <p>
                    I built WordBuddy to change that. Not to teach grammar rules, but to build 
                    <strong className="text-foreground"> real vocabulary, real understanding, and real confidence</strong>. 
                    So that the next generation of students don't just crack exams — they own the room when they speak.
                  </p>
                  
                  <p className="text-foreground font-medium">
                    This isn't just an app. It's a mission to unlock potential.
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <p className="font-bold text-foreground">Nishant Singh</p>
                  <p className="text-sm text-muted-foreground">Founder, WordBuddy • NIT Jalandhar</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Credibility & Trust Section */}
        <section className="py-16 border-t">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built by Engineers, for Learners
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              WordBuddy is crafted with expertise, empathy, and a long-term vision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="interactive" className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">NIT Jalandhar Team</h3>
              <p className="text-sm text-muted-foreground">
                Architected and built by engineers from one of India's premier technical institutions.
              </p>
            </Card>

            <Card variant="interactive" className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Code className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Modern Tech Stack</h3>
              <p className="text-sm text-muted-foreground">
                Built with AI systems, learning psychology insights, and full-stack expertise.
              </p>
            </Card>

            <Card variant="interactive" className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Long-term Vision</h3>
              <p className="text-sm text-muted-foreground">
                Not a quick hack or weekend project. Built with a mission to transform English learning.
              </p>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 border-t">
          <Card variant="elevated" className="overflow-hidden">
            <div className="gradient-hero p-8 md:p-12 text-center">
              <Heart className="w-12 h-12 text-primary-foreground mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Ready to Start Thinking in English?
              </h2>
              <p className="text-primary-foreground/90 mb-6 max-w-lg mx-auto">
                Join thousands of learners who are building real vocabulary and real confidence. 
                Your first word is waiting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="secondary" size="lg">
                  <Link to="/search">
                    Start Learning
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setIsLexiModalOpen(true)}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  Talk to Lexi AI
                </Button>
              </div>
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

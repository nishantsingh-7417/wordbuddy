import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LexiAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LexiAIModal({ isOpen, onClose }: LexiAIModalProps) {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full h-full md:w-[90%] md:h-[90%] md:max-w-4xl md:rounded-2xl overflow-hidden bg-background shadow-2xl">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-background to-transparent">
          <h2 className="text-lg font-bold text-foreground">Talk with Lexi AI</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="rounded-full bg-background/80 hover:bg-background"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Iframe Container */}
        <div className="w-full h-full pt-14">
          <iframe 
            src="https://app.relevanceai.com/agents/d7b62b/568f70f3-b109-47f4-97d0-6253e4bb9654/5d41bf38-6f4d-40a6-a406-40bbb552b438/embed-chat?hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=false" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            allow="microphone"
            title="Lexi AI Mentor"
            className="border-0"
          />
        </div>
      </div>
    </div>
  );
}

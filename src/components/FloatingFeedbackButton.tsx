import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const FloatingFeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedback.trim()) {
      toast({
        title: 'Feedback Required',
        description: 'Please enter your feedback before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-feedback-email', {
        body: {
          customerEmail: customerEmail || '',
          feedback: feedback,
        },
      });

      if (error) throw error;

      toast({
        title: 'Feedback Sent',
        description: 'Thank you for your feedback! We appreciate your input.',
      });

      setFeedback('');
      setCustomerEmail('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: 'Error',
        description: 'There was an issue sending your feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-50 rounded-full bg-[#00063d] hover:bg-[#0a1854] shadow-lg px-5 py-3 h-auto"
          aria-label="Send feedback"
        >
          <MessageSquare className="h-5 w-5 text-white mr-2" />
          <span className="text-white font-medium">Feedback</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#0a1854] border-slate-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">Send Us Feedback</DialogTitle>
          <DialogDescription className="text-slate-300">
            Share your experience and suggestions to help us improve.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="feedback-email" className="text-slate-200">
              Your Email (Optional)
            </Label>
            <Input
              id="feedback-email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          <div>
            <Label htmlFor="feedback-text" className="text-slate-200">
              Your Feedback
            </Label>
            <Textarea
              id="feedback-text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience, suggestions, or any issues..."
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 min-h-[120px] resize-none"
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00063d] hover:bg-[#0a1854] text-white"
            >
              {isSubmitting ? 'Sending...' : 'Send Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FloatingFeedbackButton;

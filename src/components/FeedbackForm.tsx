
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FeedbackFormProps {
  isSelected: boolean;
  onToggle: () => void;
}

const FeedbackForm = ({ isSelected, onToggle }: FeedbackFormProps) => {
  const [feedback, setFeedback] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please enter your feedback before submitting.",
        variant: "destructive"
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
        title: "Feedback Sent Successfully",
        description: "Thank you for your feedback! We'll review it and get back to you soon.",
      });

      // Reset form
      setFeedback('');
      setCustomerEmail('');
      onToggle(); // Deselect the feedback option
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: "Error",
        description: "There was an issue sending your feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-900/20 border-blue-500' 
          : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
      }`}
      onClick={onToggle}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600' : 'bg-slate-700'}`}>
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Customer Feedback</h3>
            <p className="text-slate-300 text-sm font-normal">
              Share your experience and suggestions to help us improve our services
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      {isSelected && (
        <CardContent className="pt-0" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="customer-email" className="text-slate-200">
                Your Email (Optional)
              </Label>
              <Input
                id="customer-email"
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
                placeholder="Please share your experience, suggestions, or any issues you've encountered..."
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 min-h-[120px] resize-none"
                required
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onToggle}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      )}
      
      <CardContent className="pt-0">
        <div className="flex justify-between items-center text-sm">
          <span className="text-green-400 font-semibold">Free</span>
          <span className="text-slate-400">Immediate</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;

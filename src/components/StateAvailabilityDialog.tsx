
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import WaitlistCount from './WaitlistCount';

interface StateAvailabilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedState: string;
}

const StateAvailabilityDialog = ({ isOpen, onClose, selectedState }: StateAvailabilityDialogProps) => {
  const [email, setEmail] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [hasSignedUp, setHasSignedUp] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsSigningUp(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            email: email.trim(),
            state: selectedState
          }
        ]);

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - user already signed up for this state
          toast({
            title: "Already Signed Up",
            description: `You're already on the waitlist for this state.`,
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        setHasSignedUp(true);
        toast({
          title: "Successfully Added to Waitlist!",
          description: `You'll be notified when this state becomes available.`,
        });
      }
    } catch (error) {
      console.error('Error signing up for waitlist:', error);
      toast({
        title: "Signup Failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setHasSignedUp(false);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            {selectedState} Coming Soon
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="text-sm text-slate-300 mb-6">
            <div className="font-medium text-green-400 mb-2 flex items-center gap-2">
              ✅ Currently Available:
            </div>
            <div className="text-white">Washington State</div>
          </div>

          {!hasSignedUp ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 text-amber-400 mb-2">
                  <Users className="w-6 h-6" />
                  <span className="text-xl font-bold">Join the Waitlist</span>
                </div>
                <p className="text-slate-300 text-sm">Limited to 100 spots</p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 h-12 text-lg"
                  disabled={isSigningUp}
                />
              </div>

              <Button
                type="submit"
                disabled={isSigningUp || !email.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold"
              >
                {isSigningUp ? 'Signing up...' : 'Join Waitlist'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="text-green-400 font-medium mb-2 text-xl">🎉 You're on the list!</div>
              <div className="text-slate-300 text-sm">
                We'll notify you as soon as {selectedState} becomes available.
              </div>
            </div>
          )}
        </div>
        
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={handleClose}
            className="bg-slate-600 hover:bg-slate-700 text-white"
          >
            {hasSignedUp ? 'Close' : 'Maybe Later'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StateAvailabilityDialog;

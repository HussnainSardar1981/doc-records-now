
import React from 'react';
import { User, LogOut, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (!user) {
    return (
      <Link to="/login">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white"
        >
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
          <User className="h-4 w-4 mr-2" />
          Account
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-slate-900 border-slate-700">
        <SheetHeader>
          <SheetTitle className="text-white">Account</SheetTitle>
          <SheetDescription className="text-slate-400">
            Manage your account settings
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-sm text-slate-400">Email</p>
            <p className="text-white font-medium">{user.email}</p>
          </div>

          <Link to="/my-records">
            <Button
              variant="outline"
              className="w-full border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
            >
              <FileText className="h-4 w-4 mr-2" />
              My Records
            </Button>
          </Link>

          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserMenu;

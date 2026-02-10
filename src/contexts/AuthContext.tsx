
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useInactivityTimer } from '@/hooks/useInactivityTimer';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithOAuth: (provider: 'google' | 'facebook') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const signUp = async (email: string, password: string, fullName: string) => {
    // Enhanced validation
    if (!email || !password || !fullName) {
      return { error: { message: 'All fields are required' } };
    }

    if (password.length < 8) {
      return { error: { message: 'Password must be at least 8 characters long' } };
    }

    if (fullName.length < 2 || fullName.length > 100) {
      return { error: { message: 'Full name must be between 2-100 characters' } };
    }

    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName.trim()
        }
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    // Enhanced validation
    if (!email || !password) {
      return { error: { message: 'Email and password are required' } };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signInWithOAuth = async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const handleInactivityTimeout = React.useCallback(async () => {
    await signOut();
    toast({
      title: "Session Expired",
      description: "You've been signed out due to inactivity for security reasons",
      variant: "destructive",
      duration: 3000,
    });
  }, [toast]);

  // Extended inactivity timer to 30 minutes (1800000ms) for better user experience
  useInactivityTimer({
    timeout: 1800000, // 30 minutes
    onTimeout: handleInactivityTimeout,
    enabled: !!user // Only enable timer when user is logged in
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

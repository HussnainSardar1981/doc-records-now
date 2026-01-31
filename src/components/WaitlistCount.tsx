
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users } from 'lucide-react';

interface WaitlistCountProps {
  state: string;
}

const WaitlistCount = ({ state }: WaitlistCountProps) => {
  console.log('WaitlistCount component rendering for state:', state);
  
  const { data: count, isLoading, error } = useQuery({
    queryKey: ['waitlist-count', state],
    queryFn: async () => {
      console.log('Fetching waitlist count for state:', state);
      const { count, error } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('state', state);

      if (error) {
        console.error('Error fetching waitlist count:', error);
        throw error;
      }

      console.log('Waitlist count fetched:', count);
      return count || 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (error) {
    console.error('Query error:', error);
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <Users className="w-4 h-4" />
        <span>Loading...</span>
      </div>
    );
  }

  const spotsRemaining = Math.max(0, 100 - (count || 0));

  return (
    <div className="flex items-center gap-2 text-slate-300 text-sm">
      <Users className="w-4 h-4" />
      <span>
        {count || 0} people signed up • {spotsRemaining} spots remaining
      </span>
    </div>
  );
};

export default WaitlistCount;

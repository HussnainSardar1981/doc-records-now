
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users } from 'lucide-react';

const TotalWaitlistCount = () => {
  console.log('TotalWaitlistCount component rendering');
  
  const { data: count, isLoading, error } = useQuery({
    queryKey: ['total-waitlist-count'],
    queryFn: async () => {
      console.log('Fetching total waitlist count');
      const { count, error } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching total waitlist count:', error);
        throw error;
      }

      console.log('Total waitlist count fetched:', count);
      return count || 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (error) {
    console.error('Total waitlist query error:', error);
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <Users className="w-4 h-4" />
        <span>Loading waitlist...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-slate-300 text-sm">
      <Users className="w-4 h-4" />
      <span>
        {count || 0} people on waitlist nationwide
      </span>
    </div>
  );
};

export default TotalWaitlistCount;

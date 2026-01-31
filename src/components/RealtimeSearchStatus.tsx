
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SearchActivity {
  id: string;
  state: string;
  doc_number: string;
  success: boolean;
  search_timestamp: string;
}

const RealtimeSearchStatus = () => {
  const [recentSearches, setRecentSearches] = useState<SearchActivity[]>([]);
  const [activeSearches, setActiveSearches] = useState(0);

  useEffect(() => {
    // Subscribe to real-time search activity
    const channel = supabase
      .channel('live-search-activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'search_logs'
        },
        (payload) => {
          console.log('New search activity:', payload);
          const newSearch = payload.new as SearchActivity;
          
          setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)]); // Keep last 5 searches
          
          // Simulate active search counter
          setActiveSearches(prev => prev + 1);
          setTimeout(() => {
            setActiveSearches(prev => Math.max(0, prev - 1));
          }, 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (recentSearches.length === 0 && activeSearches === 0) {
    return null;
  }

  return (
    <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-white text-sm font-medium">Live Search Activity</span>
          {activeSearches > 0 && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              {activeSearches} active
            </Badge>
          )}
        </div>
        
        {recentSearches.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Users className="w-3 h-3" />
              Recent searches across all states:
            </div>
            {recentSearches.slice(0, 3).map((search) => (
              <div key={search.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Search className="w-3 h-3 text-slate-500" />
                  <span className="text-slate-300">DOC #{search.doc_number}</span>
                  <span className="text-slate-500">in {search.state}</span>
                </div>
                <Badge 
                  variant={search.success ? "default" : "secondary"}
                  className={`text-xs ${
                    search.success 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {search.success ? "Found" : "No results"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimeSearchStatus;

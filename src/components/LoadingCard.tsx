import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingCardProps {
  rows?: number;
}

export const LoadingCard = ({ rows = 3 }: LoadingCardProps) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Card key={i} className="bg-gradient-to-br from-white/5 to-white/10 border-white/20 animate-pulse">
          <CardContent className="p-3 sm:p-4 md:p-5 space-y-4">
            {/* Name and badge */}
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-48 bg-white/10" />
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-20 bg-white/10" />
                  <Skeleton className="h-4 w-36 bg-white/10" />
                  <Skeleton className="h-4 w-16 bg-white/10" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
            </div>
            {/* Records section */}
            <div className="border-t border-white/10 pt-4">
              <Skeleton className="h-4 w-32 bg-white/10 mb-3" />
              <div className="flex flex-col md:flex-row gap-2">
                <Skeleton className="h-28 flex-1 rounded-lg bg-white/5" />
                <Skeleton className="h-28 flex-1 rounded-lg bg-white/5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

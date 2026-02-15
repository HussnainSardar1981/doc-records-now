import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingCardProps {
  title?: string;
  rows?: number;
}

export const LoadingCard = ({ title, rows = 3 }: LoadingCardProps) => {
  return (
    <Card className="bg-white/5 border-white/10 animate-in fade-in duration-200">
      <CardHeader>
        {title ? (
          <Skeleton className="h-6 w-48" />
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  );
};

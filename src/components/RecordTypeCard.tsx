
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecordType } from '@/types';

interface RecordTypeCardProps {
  record: RecordType;
  isSelected: boolean;
  onToggle: (recordId: string) => void;
}

const RecordTypeCard = ({ record, isSelected, onToggle }: RecordTypeCardProps) => {
  const Icon = record.icon;

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
        isSelected
          ? 'bg-blue-900/50 border-blue-500 ring-2 ring-blue-500/50'
          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
      } backdrop-blur-sm touch-manipulation`}
      onClick={() => onToggle(record.id)}
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start space-x-3 md:space-x-4 flex-1">
            <div className={`p-2.5 md:p-3 rounded-lg flex-shrink-0 ${
              isSelected ? 'bg-blue-600' : 'bg-slate-700'
            }`}>
              <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-semibold text-white mb-1">
                {record.title}
              </h3>
              <p className="text-slate-300 text-xs md:text-sm">
                {record.description}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right gap-2">
            <div className="text-xl md:text-2xl font-bold text-white">
              {record.price}
            </div>
            {isSelected && (
              <Badge className="bg-blue-600 text-white text-xs md:text-sm px-3 py-1">
                Selected
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordTypeCard;

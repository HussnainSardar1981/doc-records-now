
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RecordTypeCard from './RecordTypeCard';
import FeedbackForm from './FeedbackForm';
import { recordTypes } from '@/data/recordTypes';

interface RecordTypeSelectionProps {
  selectedRecords: string[];
  onToggleRecord: (recordId: string) => void;
}

const RecordTypeSelection = ({ selectedRecords, onToggleRecord }: RecordTypeSelectionProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Available Records</CardTitle>
        <CardDescription className="text-slate-300">
          Select the type of records you need
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {recordTypes.map((record) => {
            if (record.id === 'feedback') {
              return (
                <FeedbackForm
                  key={record.id}
                  isSelected={selectedRecords.includes(record.id)}
                  onToggle={() => onToggleRecord(record.id)}
                />
              );
            }
            
            return (
              <RecordTypeCard
                key={record.id}
                record={record}
                isSelected={selectedRecords.includes(record.id)}
                onToggle={onToggleRecord}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordTypeSelection;

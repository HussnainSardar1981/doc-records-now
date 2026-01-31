
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatesList from './StatesList';

interface MapSectionProps {
  onStateSelect: (state: string) => void;
  selectedState: string | null;
}

const MapSection = ({ onStateSelect, selectedState }: MapSectionProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-center">
          State Coverage
        </CardTitle>
        <CardDescription className="text-slate-300 text-center">
          Inmate records available nationwide
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StatesList onStateSelect={onStateSelect} selectedState={selectedState} />
      </CardContent>
    </Card>
  );
};

export default MapSection;

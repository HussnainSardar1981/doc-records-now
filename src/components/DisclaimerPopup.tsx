import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const DISCLAIMER_KEY = 'disclaimer_accepted';

const DisclaimerPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(DISCLAIMER_KEY);
    if (!accepted) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(DISCLAIMER_KEY, 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="bg-[#0a1854] border-slate-700 text-white max-w-lg [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white text-center">
            Disclaimer
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-base leading-relaxed mt-4">
            This website is <strong className="text-white">not affiliated with, endorsed by, or connected to</strong> the
            Washington State Department of Corrections (WA DOC) or any government agency.
            All records and information provided through this service are obtained from
            publicly available sources. This is an independent, privately operated service.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button
            onClick={handleAccept}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerPopup;

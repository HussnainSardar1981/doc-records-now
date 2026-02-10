import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

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
        className="bg-[#0a1854] border-slate-700 text-white w-[calc(100%-2rem)] max-w-lg p-4 sm:p-6 rounded-lg [&>button]:hidden"
        aria-describedby={undefined}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-white text-center">
            Disclaimer & Terms of Use
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] sm:max-h-[60vh] pr-2 sm:pr-4">
          <div className="text-slate-300 text-xs sm:text-sm leading-relaxed space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <p>
              By accessing and using Inmate Insights, you agree to the following terms:
            </p>

            <div>
              <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">1. Lawful Use Only</h3>
              <p>
                This service is intended for legal and legitimate purposes only, including but not
                limited to background checks, legal proceedings, journalism, and personal safety.
                You agree not to use any information obtained through this site for any unlawful purpose.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">2. No Harassment or Targeting</h3>
              <p>
                You may not use the information provided to stalk, harass, intimidate, threaten,
                or make harmful contact with any individual listed in our records. Any such use is
                strictly prohibited and may be reported to law enforcement.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">3. No Doxxing or Public Exposure</h3>
              <p>
                You agree not to publicly share, post, or distribute personal information obtained
                through this site with the intent to harm, shame, or endanger any individual.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">4. User Responsibility</h3>
              <p>
                Inmate Insights provides publicly available information as a convenience. We do not
                verify the accuracy of records and are not responsible for how users choose to use
                the data. By proceeding, you accept full responsibility for your use of this service.
              </p>
            </div>

            <p className="text-slate-400 text-[10px] sm:text-xs mt-2">
              By clicking "I Agree," you confirm that you have read and accept these terms.
            </p>
          </div>
        </ScrollArea>
        <div className="mt-3 sm:mt-4">
          <Button
            onClick={handleAccept}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
          >
            I Agree
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerPopup;

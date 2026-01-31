
import { Phone, Users, MessageSquare } from 'lucide-react';
import { RecordType } from '@/types';
import { RECORD_PRICES, PROCESSING_TIMES } from '@/constants';

export const recordTypes: RecordType[] = [
  {
    id: 'telephone',
    title: 'Telephone Records',
    description: 'Complete phone call history with total count of approved phone numbers on the contact list',
    icon: Phone,
    price: `$${RECORD_PRICES.telephone.toFixed(2)}`,
    processingTime: PROCESSING_TIMES.telephone
  },
  {
    id: 'visitor',
    title: 'Visitor Records',
    description: 'Full visitor history showing total number of approved visitors on the visiting list',
    icon: Users,
    price: `$${RECORD_PRICES.visitor.toFixed(2)}`,
    processingTime: PROCESSING_TIMES.visitor
  },
  {
    id: 'feedback',
    title: 'Customer Feedback',
    description: 'Share your experience and suggestions to help us improve our services',
    icon: MessageSquare,
    price: 'Free',
    processingTime: 'Immediate'
  }
];

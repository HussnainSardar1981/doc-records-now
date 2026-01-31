
import { StateUrlData } from '../stateUrls';

export const southStates: { [key: string]: StateUrlData } = {
  'Arkansas': { 
    general: 'https://adc.arkansas.gov/inmatesearch',
    status: 'active'
  },
  'Oklahoma': { 
    general: 'https://www.ok.gov/doc/Offender_Info/',
    status: 'active'
  },
  'Texas': { 
    general: 'https://offender.tdcj.texas.gov/OffenderSearch/',
    status: 'active'
  }
};

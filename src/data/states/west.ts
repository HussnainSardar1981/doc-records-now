
import { StateUrlData } from '../stateUrls';

export const westStates: { [key: string]: StateUrlData } = {
  'Alaska': { 
    general: 'https://doc.alaska.gov/',
    status: 'active'
  },
  'Arizona': { 
    general: 'https://corrections.az.gov/inmate-datasearch',
    status: 'active'
  },
  'California': { 
    general: 'https://ciris.mt.cdcr.ca.gov/',
    status: 'active'
  },
  'Colorado': { 
    general: 'https://www.doc.state.co.us/oss',
    status: 'active'
  },
  'Hawaii': { 
    general: 'https://vinelink.vineapps.com/search/HI/Person',
    status: 'active'
  },
  'Idaho': { 
    general: 'https://www.idoc.idaho.gov/content/prisons/offender_search',
    status: 'active'
  },
  'Montana': { 
    general: 'https://app.mt.gov/conweb/',
    status: 'active'
  },
  'Nevada': { 
    general: 'https://ofdsearch.doc.nv.gov/',
    status: 'active'
  },
  'New Mexico': { 
    general: 'https://cd.nm.gov/incarcerated-individual-search/',
    status: 'active'
  },
  'Oregon': { 
    general: 'https://www.oregon.gov/doc/TRANS/AOIC/pages/inmate_search.aspx',
    status: 'active'
  },
  'Utah': { 
    general: 'https://www.offender.utah.gov/',
    status: 'active'
  },
  'Washington': { 
    docSearch: 'https://www.doc.wa.gov/information/inmate-search/default.aspx?docnumber=',
    general: 'https://www.doc.wa.gov/information/inmate-search/default.aspx',
    status: 'active'
  },
  'Wyoming': { 
    general: 'https://corrections.wyo.gov/divisions-of-corrections/prisons/inmate-information',
    status: 'active'
  }
};


import { StateUrlData } from '../stateUrls';

export const midwestStates: { [key: string]: StateUrlData } = {
  'Illinois': { 
    general: 'https://www.illinois.gov/idoc/Offender/Pages/InmateSearch.aspx',
    status: 'active'
  },
  'Indiana': { 
    general: 'https://offenderlocator.idoc.in.gov/idoc-ofs-1.0.2/ofsindiana',
    status: 'active'
  },
  'Iowa': { 
    general: 'https://doc.iowa.gov/offender-information',
    status: 'active'
  },
  'Kansas': { 
    general: 'https://www.doc.ks.gov/kdoc-public-inmate-locator',
    status: 'active'
  },
  'Michigan': { 
    general: 'https://mdocweb.state.mi.us/otis2/otis2.aspx',
    status: 'active'
  },
  'Minnesota': { 
    general: 'https://coms.doc.state.mn.us/publicviewer/',
    status: 'active'
  },
  'Missouri': { 
    general: 'https://web.mo.gov/doc/offSearchWeb/',
    status: 'active'
  },
  'Nebraska': { 
    general: 'https://www.corrections.nebraska.gov/offender-information',
    status: 'active'
  },
  'North Dakota': { 
    general: 'https://www.docr.nd.gov/adult-facilities/inmate-search',
    status: 'active'
  },
  'Ohio': { 
    docSearch: 'https://appgateway.drc.ohio.gov/OffenderSearch?docNumber=',
    general: 'https://appgateway.drc.ohio.gov/OffenderSearch',
    status: 'active'
  },
  'South Dakota': { 
    general: 'https://doc.sd.gov/incarcerated-adults/locating-inmates/',
    status: 'active'
  },
  'Wisconsin': { 
    general: 'https://appsdoc.wi.gov/public/offenderdetails',
    status: 'active'
  }
};

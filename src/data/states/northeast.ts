
import { StateUrlData } from '../stateUrls';

export const northeastStates: { [key: string]: StateUrlData } = {
  'Connecticut': { 
    general: 'https://www.ctinmateinfo.state.ct.us/searchop.asp',
    status: 'active'
  },
  'Maine': { 
    general: 'https://www.maine.gov/corrections/prisoner-records',
    status: 'active'
  },
  'Massachusetts': { 
    general: 'https://www.mass.gov/service-details/inmate-locator',
    status: 'active'
  },
  'New Hampshire': { 
    general: 'https://www.nh.gov/nhdoc/offender/',
    status: 'active'
  },
  'New Jersey': { 
    general: 'https://www-doc.state.nj.us/DOC_Inmate/inmatesearch',
    status: 'active'
  },
  'New York': { 
    general: 'http://nysdoccslookup.doccs.ny.gov/',
    status: 'active'
  },
  'Pennsylvania': { 
    general: 'https://inmatelocator.cor.pa.gov/',
    status: 'active'
  },
  'Rhode Island': { 
    general: 'http://www.doc.ri.gov/administration/planning/inmate_search.php',
    status: 'limited'
  },
  'Vermont': { 
    general: 'https://doc.vermont.gov/offender-search',
    status: 'active'
  }
};

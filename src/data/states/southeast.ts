import { StateUrlData } from '../stateUrls';

export const southeastStates: { [key: string]: StateUrlData } = {
  'Alabama': { 
    general: 'https://doc.alabama.gov/inmatesearch.aspx',
    status: 'active'
  },
  'Delaware': { 
    general: 'http://www.doc.delaware.gov/information/inmate_locator.shtml',
    status: 'limited'
  },
  'Florida': { 
    general: 'http://www.dc.state.fl.us/OffenderSearch/',
    status: 'active'
  },
  'Georgia': { 
    general: 'https://services.gdc.ga.gov/GDC/OffenderQuery/jsp/OffQryForm.jsp?Institution=',
    status: 'active'
  },
  'Kentucky': { 
    general: 'http://kool.corrections.ky.gov/KOOL/AdvancedSearch',
    status: 'active'
  },
  'Louisiana': { 
    general: 'https://www.doc.la.gov/offender-search/',
    status: 'active'
  },
  'Maryland': { 
    general: 'https://dpscs.maryland.gov/services/inmate-locator.shtml',
    status: 'active'
  },
  'Mississippi': { 
    general: 'http://www.mdoc.state.ms.us/Inmate_Search/default.htm',
    status: 'limited'
  },
  'North Carolina': { 
    general: 'https://webapps.doc.state.nc.us/opi/',
    status: 'active'
  },
  'South Carolina': { 
    general: 'http://scdc.sc.gov/inmatesearch/',
    status: 'active'
  },
  'Tennessee': { 
    general: 'https://apps.tn.gov/foil/',
    status: 'active'
  },
  'Virginia': { 
    general: 'https://vadoc.virginia.gov/offenders/locator/',
    status: 'active'
  },
  'West Virginia': { 
    general: 'https://www.wvdoc.com/wvdoc-offender-search/',
    status: 'active'
  }
};

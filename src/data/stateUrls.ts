
export interface StateUrlData {
  docSearch?: string;
  nameSearch?: string;
  general: string;
  requiresParams?: boolean;
  status: 'active' | 'limited' | 'unavailable';
}

import { northeastStates } from './states/northeast';
import { southeastStates } from './states/southeast';
import { midwestStates } from './states/midwest';
import { westStates } from './states/west';
import { southStates } from './states/south';

export const stateUrls: { [key: string]: StateUrlData } = {
  ...northeastStates,
  ...southeastStates,
  ...midwestStates,
  ...westStates,
  ...southStates
};

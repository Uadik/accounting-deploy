import { combineReducers } from 'redux';

import authentication from './auth';
import alert from './alert';
import profile from './profile';
import company from './company';
import employees from './employees';
import documents from './documents';
import positions from './positions';

const rootReducer = combineReducers({
  authentication,
  alert,
  profile,
  company,
  employees,
  documents,
  positions,
});

export default rootReducer;

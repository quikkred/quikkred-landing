import { combineReducers } from '@reduxjs/toolkit';
import customerReducer from './customerReducer';
import applicationReducer from './applicationReducer';
import loanReducer from './loanReducer';
import bankReducer from './bankReducer';
import documentReducer from './documentReducer';
import notificationReducer from './notificationReducer';
import supportReducer from './supportReducer';
import dashboardReducer from './dashboardReducer';
import profileReducer from './profileReducer';
import productReducer from './productReducer';

const rootReducer = combineReducers({
  customer: customerReducer,
  application: applicationReducer,
  loan: loanReducer,
  bank: bankReducer,
  document: documentReducer,
  notification: notificationReducer,
  support: supportReducer,
  dashboard: dashboardReducer,
  profile: profileReducer,
  product: productReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

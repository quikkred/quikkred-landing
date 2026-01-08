import { combineReducers } from '@reduxjs/toolkit';
import customerReducer from './customerReducer';

const rootReducer = combineReducers({
  customer: customerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

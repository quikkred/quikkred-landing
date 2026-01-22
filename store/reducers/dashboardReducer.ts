// Dashboard Reducer
import {
  FETCH_DASHBOARD_REQUEST,
  FETCH_DASHBOARD_SUCCESS,
  FETCH_DASHBOARD_FAILURE,
  CLEAR_DASHBOARD,
} from '../actionTypes/dashboardActionTypes';

export interface DashboardState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

const dashboardReducer = (state = initialState, action: any): DashboardState => {
  switch (action.type) {
    case FETCH_DASHBOARD_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_DASHBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case FETCH_DASHBOARD_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CLEAR_DASHBOARD:
      return initialState;

    default:
      return state;
  }
};

export default dashboardReducer;

// Application Reducer
import {
  FETCH_APPLICATIONS_REQUEST,
  FETCH_APPLICATIONS_SUCCESS,
  FETCH_APPLICATIONS_FAILURE,
  FETCH_NEW_APPLICATIONS_REQUEST,
  FETCH_NEW_APPLICATIONS_SUCCESS,
  FETCH_NEW_APPLICATIONS_FAILURE,
  CLEAR_APPLICATIONS,
} from '../actionTypes/applicationActionTypes';

export interface ApplicationState {
  applications: any[];
  newApplications: any[];
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  loading: boolean;
  newApplicationsLoading: boolean;
  error: string | null;
  newApplicationsError: string | null;
}

const initialState: ApplicationState = {
  applications: [],
  newApplications: [],
  pagination: {
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  },
  loading: false,
  newApplicationsLoading: false,
  error: null,
  newApplicationsError: null,
};

const applicationReducer = (state = initialState, action: any): ApplicationState => {
  switch (action.type) {
    case FETCH_APPLICATIONS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_APPLICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        applications: action.payload.data,
        pagination: action.payload.pagination,
        error: null,
      };
    case FETCH_APPLICATIONS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_NEW_APPLICATIONS_REQUEST:
      return { ...state, newApplicationsLoading: true, newApplicationsError: null };
    case FETCH_NEW_APPLICATIONS_SUCCESS:
      return {
        ...state,
        newApplicationsLoading: false,
        newApplications: action.payload,
        newApplicationsError: null,
      };
    case FETCH_NEW_APPLICATIONS_FAILURE:
      return { ...state, newApplicationsLoading: false, newApplicationsError: action.payload };

    case CLEAR_APPLICATIONS:
      return initialState;

    default:
      return state;
  }
};

export default applicationReducer;

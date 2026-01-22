// Profile Reducer
import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  CLEAR_PROFILE,
} from '../actionTypes/profileActionTypes';

export interface ProfileState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
};

const profileReducer = (state = initialState, action: any): ProfileState => {
  switch (action.type) {
    case FETCH_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case FETCH_PROFILE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CLEAR_PROFILE:
      return initialState;

    default:
      return state;
  }
};

export default profileReducer;

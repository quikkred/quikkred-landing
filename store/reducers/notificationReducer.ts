// Notification Reducer
import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  CLEAR_NOTIFICATIONS,
} from '../actionTypes/notificationActionTypes';

export interface NotificationState {
  notifications: any[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationReducer = (state = initialState, action: any): NotificationState => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
        error: null,
      };
    case FETCH_NOTIFICATIONS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CLEAR_NOTIFICATIONS:
      return initialState;

    default:
      return state;
  }
};

export default notificationReducer;

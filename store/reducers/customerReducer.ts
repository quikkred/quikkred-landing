import * as actionTypes from '../actionTypes/customerActionTypes';

export interface CustomerState {
  // Customer data
  customer: any | null;
  customerLoading: boolean;
  customerError: string | null;

  // Aadhaar status
  aadhaarStatus: any | null;
  aadhaarStatusLoading: boolean;
  aadhaarStatusError: string | null;

  // eSign status
  eSignStatus: any | null;
  eSignStatusLoading: boolean;
  eSignStatusError: string | null;

  // BRE data
  breData: any | null;
  breLoading: boolean;
  breError: string | null;

  // BSA data
  bsaData: any | null;
  bsaLoading: boolean;
  bsaError: string | null;

  // Loan products
  loanProducts: any[];
  loanProductsLoading: boolean;
  loanProductsError: string | null;

  // Finfactor data
  finfactorData: any | null;
  finfactorLoading: boolean;
  finfactorError: string | null;

  // eSign Initialize data
  eSignInitData: any | null;
  eSignInitLoading: boolean;
  eSignInitError: string | null;
}

const initialState: CustomerState = {
  // Customer
  customer: null,
  customerLoading: false,
  customerError: null,

  // Aadhaar
  aadhaarStatus: null,
  aadhaarStatusLoading: false,
  aadhaarStatusError: null,

  // eSign
  eSignStatus: null,
  eSignStatusLoading: false,
  eSignStatusError: null,

  // BRE
  breData: null,
  breLoading: false,
  breError: null,

  // BSA
  bsaData: null,
  bsaLoading: false,
  bsaError: null,

  // Loan Products
  loanProducts: [],
  loanProductsLoading: false,
  loanProductsError: null,

  // Finfactor
  finfactorData: null,
  finfactorLoading: false,
  finfactorError: null,

  // eSign Initialize
  eSignInitData: null,
  eSignInitLoading: false,
  eSignInitError: null,
};

type CustomerAction = {
  type: string;
  payload?: any;
};

const customerReducer = (state = initialState, action: CustomerAction): CustomerState => {
  switch (action.type) {
    // ==================== Customer ====================
    case actionTypes.FETCH_CUSTOMER_REQUEST:
      return { ...state, customerLoading: true, customerError: null };
    case actionTypes.FETCH_CUSTOMER_SUCCESS:
      return { ...state, customerLoading: false, customer: action.payload };
    case actionTypes.FETCH_CUSTOMER_FAILURE:
      return { ...state, customerLoading: false, customerError: action.payload };

    // ==================== Aadhaar Status ====================
    case actionTypes.FETCH_AADHAAR_STATUS_REQUEST:
      return { ...state, aadhaarStatusLoading: true, aadhaarStatusError: null };
    case actionTypes.FETCH_AADHAAR_STATUS_SUCCESS:
      return { ...state, aadhaarStatusLoading: false, aadhaarStatus: action.payload };
    case actionTypes.FETCH_AADHAAR_STATUS_FAILURE:
      return { ...state, aadhaarStatusLoading: false, aadhaarStatusError: action.payload };

    // ==================== eSign Status ====================
    case actionTypes.FETCH_ESIGN_STATUS_REQUEST:
      return { ...state, eSignStatusLoading: true, eSignStatusError: null };
    case actionTypes.FETCH_ESIGN_STATUS_SUCCESS:
      return { ...state, eSignStatusLoading: false, eSignStatus: action.payload };
    case actionTypes.FETCH_ESIGN_STATUS_FAILURE:
      return { ...state, eSignStatusLoading: false, eSignStatusError: action.payload };

    // ==================== BRE ====================
    case actionTypes.BRE_INITIALIZE_REQUEST:
      return { ...state, breLoading: true, breError: null };
    case actionTypes.BRE_INITIALIZE_SUCCESS:
      return { ...state, breLoading: false, breData: action.payload };
    case actionTypes.BRE_INITIALIZE_FAILURE:
      return { ...state, breLoading: false, breError: action.payload };

    // ==================== BSA ====================
    case actionTypes.BSA_UPDATE_REQUEST:
      return { ...state, bsaLoading: true, bsaError: null };
    case actionTypes.BSA_UPDATE_SUCCESS:
      return { ...state, bsaLoading: false, bsaData: action.payload };
    case actionTypes.BSA_UPDATE_FAILURE:
      return { ...state, bsaLoading: false, bsaError: action.payload };

    // ==================== Loan Products ====================
    case actionTypes.FETCH_LOAN_PRODUCTS_REQUEST:
      return { ...state, loanProductsLoading: true, loanProductsError: null };
    case actionTypes.FETCH_LOAN_PRODUCTS_SUCCESS:
      return { ...state, loanProductsLoading: false, loanProducts: action.payload };
    case actionTypes.FETCH_LOAN_PRODUCTS_FAILURE:
      return { ...state, loanProductsLoading: false, loanProductsError: action.payload };

    // ==================== Finfactor ====================
    case actionTypes.FETCH_FINFACTOR_REQUEST:
      return { ...state, finfactorLoading: true, finfactorError: null };
    case actionTypes.FETCH_FINFACTOR_SUCCESS:
      return { ...state, finfactorLoading: false, finfactorData: action.payload };
    case actionTypes.FETCH_FINFACTOR_FAILURE:
      return { ...state, finfactorLoading: false, finfactorError: action.payload };

    // ==================== eSign Initialize ====================
    case actionTypes.ESIGN_INITIALIZE_REQUEST:
      return { ...state, eSignInitLoading: true, eSignInitError: null };
    case actionTypes.ESIGN_INITIALIZE_SUCCESS:
      return { ...state, eSignInitLoading: false, eSignInitData: action.payload };
    case actionTypes.ESIGN_INITIALIZE_FAILURE:
      return { ...state, eSignInitLoading: false, eSignInitError: action.payload };

    // ==================== Clear ====================
    case actionTypes.CLEAR_CUSTOMER_DATA:
      return initialState;
    case actionTypes.CLEAR_ERRORS:
      return {
        ...state,
        customerError: null,
        aadhaarStatusError: null,
        eSignStatusError: null,
        breError: null,
        bsaError: null,
        loanProductsError: null,
        finfactorError: null,
        eSignInitError: null,
      };

    default:
      return state;
  }
};

export default customerReducer;

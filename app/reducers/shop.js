import * as actionType from './../actions/constants';
import * as _ from 'lodash';
import { act } from 'react-test-renderer';

const initialState = {
  loadingData: false,
  success: false,
  error: null,
  errorFilter: null,
  errorList: null,
  errorPurchase: null,
  errorDetail: null,
  shopListLoading: false,
  shops: [],
  shopsData: {},
  options: {},
  purchasedBundles: [],
  orderList: [],
  buyerPurchase: [],
  historyData: [],
  getDetailData: [],
  historyDataLoading: false,
  finishedCheckout: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.FINISH_CHECKOUT: {
      return { ...state, finishedCheckout: action.payload.status };
    }
    case actionType.HISTORY_DATA: {
      const { historyData } = state;
      return {
        ...state,
        historyData: action.payload.data,
        error: null,
        success: true,
      };
    }

    case actionType.CLEAR_HISTORY_DATA: {
      return {
        ...state,
        historyData: action.payload.data,
        error: null,
        success: true,
      };
    }

    case actionType.HISTORY_DATA_LOADING: {
      return { ...state, historyDataLoading: action.payload.loading };
    }

    case actionType.GET_FILTER_DATA: {
      return {
        ...state,
        shopsData: action.payload.data,
        shops:
          action.payload.data.previous === null
            ? action.payload.data.results
            : [...state.shops, ...action.payload.data.results],
        error: null,
        success: true,
      };
    }

    case actionType.GET_FILTER_DATA_ERROR: {
      return { ...state, success: false, error: action.payload.error };
    }

    case actionType.APPLY_FILTER_SUCCESS: {
      return {
        ...state,
        options: action.payload.data,
        errorFilter: null,
        success: true,
      };
    }
    case actionType.APPLY_FILTERERROR: {
      return { ...state, success: false, error: action.payload.error };
    }
    case actionType.GET_SHOP_LIST_LOADING: {
      return { ...state, shopListLoading: action.payload.loading };
    }
    case actionType.GET_SHOP_LIST_SUCCESS: {
      return {
        ...state,
        shopsData: action.payload.data,
        shops:
          action.payload.data.previous === null
            ? action.payload.data.results
            : [...state.shops, ...action.payload.data.results],
        error: null,
        success: true,
      };
    }
    case actionType.GET_SHOP_LIST_ERROR: {
      return { ...state, success: false, errorList: action.payload.error };
    }
    case actionType.GET_PURCHASED_LIST_SUCCESS: {
      return {
        ...state,
        purchasedBundles: action.payload.data.results,
        error: null,
        success: true,
      };
    }
    case actionType.GET_PURCHASED_LIST_ERROR: {
      return { ...state, success: false, errorPurchase: action.payload.error };
    }
    default:
      return state;
    case actionType.GET_ORDER_DETAIL_LIST_SUCCESS: {
      return {
        ...state,
        orderList: action.payload.data.results,
        error: null,
        success: true,
      };
    }
    case actionType.GET_ORDER_DETAIL_LIST_ERROR: {
      return {
        ...state,
        success: false,
        errorDetail: action.payload.error,
      };
    }
    case actionType.GET_BUYER_ORDER_DETAIL_LIST_SUCCESS: {
      return {
        ...state,
        buyerPurchase: action.payload.data.results,
        error: null,
        success: true,
      };
    }
    case actionType.GET_BUYER_ORDER_DETAIL_LIST_ERROR: {
      return {
        ...state,
        success: false,
        errorBuyerDetail: action.payload.error,
      };
    }
    case actionType.GET_LISTING_DETAILS_SUCCESS: {
      return {
        ...state,
        getDetailData: action.payload.data,
        error: null,
        success: true,
      };
    }
    case actionType.GET_LISTING_DETAILS_ERROR: {
      return {
        ...state,
        success: false,
        error: action.payload.error,
      };
    }
    case actionType.USER_LOGOUT:
      return initialState
  }
};

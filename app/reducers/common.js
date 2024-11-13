import * as actionType from './../actions/constants';

const initialState = {
  loadingData: false,
  navIndex:0
};

export default (state=initialState, action) => {
  switch (action.type){
    // this case would expect payload of { loading: true } or { loading: false }
    case actionType.LOADING_DATA: {
      return { ...state, loadingData: action.payload.loading }
    }
    case actionType.NAV_INDEX: {
      return { ...state, navIndex: action.value }
    }
    case actionType.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
}

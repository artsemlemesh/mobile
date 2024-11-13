import * as actionType from '../actions/constants';
import * as _ from "lodash";

const initialState = {
  success: false,
  error: null,
  favorites: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.ADD_NEW_FAVORITE_ITEM: {
      let { favorites } = state;
      let product = action.payload.item;
    
      return {
        ...state,
        favorites: [
          ...favorites, {...product}
        ]
      };
    }
    case actionType.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
}

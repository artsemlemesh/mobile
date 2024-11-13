import * as actionType from '../actions/constants';
import * as _ from 'lodash';

const initState = {
  RemoveBSucess: false,
  RemoveBError: null,
  imageLoader: false,
  imageCLoading: null,
  RemoveBCSucess: false,
  RemoveBCError: null,
  imageIDLoading: null,
  imageIDSucess: null,
  imageIDError: null,
  imageIDData: null
};

export default (state = initState, action) => {
  switch (action.type) {

    case actionType.REMOVE_BACKGROUND_LOADING: {
      return {
        ...state,
        imageLoader: action.payload.loading,
        RemoveBSucess: false,
        RemoveBError: null,
      };
    }

    case actionType.REMOVE_BACKGROUND_SUCCESS: {
      return {
        ...state,
        RemoveBError: null,
        RemoveBSucess: true,
        image_id: action.payload.data.id,
        imageLoader: false,
      };
    }
    
    case actionType.REMOVE_BACKGROUND_ERROR: {
    
      return {
        ...state,
        RemoveBError: action.payload.error,
        RemoveBSucess: false,
        imageLoader: false
      };
    }

    case actionType.IMAGE_PROGRESS_LOADING: {
      return {
        ...state,
        imageCLoading: action.payload.loading,
        RemoveBCSucess: false,
        RemoveBCError: null,
      };
    }

    case actionType.IMAGE_PROGRESS_SUCCESS: {
      return {
        ...state,
        imageCLoading: false,
        RemoveBCSucess: true,
        RemoveBCError: null,
      };
    }
    
    case actionType.IMAGE_PROGRESS_ERROR: {
    
      return {
        ...state,
        imageCLoading: false,
        RemoveBCSucess: false,
        RemoveBCError: action.payload.error,
      };
    }

    case actionType.IMAGE_ID_LOADING: {
      return {
        ...state,
        imageIDLoading: true,
        imageIDSucess: false,
        imageIDError: null,
      };
    }

    case actionType.IMAGE_ID_SUCCESS: {
      return {
        ...state,
        imageIDLoading: false,
        imageIDSucess: true,
        imageIDError: false,
        imageIDData: action.payload.data
      };
    }
    
    case actionType.IMAGE_ID_ERROR: {
    
      return {
        ...state,
        imageIDLoading: false,
        imageIDSucess: false,
        imageIDError: true,
      };
    }

    case actionType.RESET_BACKGROUNDIMAGE_STATE: 
      return initState;
    
    case actionType.USER_LOGOUT:
        return initState;
        
    default: 
      return state
  }
}

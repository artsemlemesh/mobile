import * as actionType from '../actions/constants';
import * as _ from 'lodash';

const initialState = {
  success: false,
  error: null,
  bundles: [],
  bundleData: {},
  sellingListLoading: false,
  orderListLoading: false,
  selectedSelling: null,
  bundlePublished: false,
  bundlePublishError: null,
  initialBundle: null,
  bundlesDetails: {},
  orderDetails: {},
};

export default (state = initialState, action) => {
  let filteredData;

  switch (action.type) {
    case actionType.GET_SELLING_LIST_LOADING: {
      return {
        ...state,
        sellingListLoading: action.payload.loading,
        bundlePublished: false,
        bundlePublishError: null,
        success: false,
        error: null,
      };
    }
    case actionType.GET_SELLING_LIST_SUCCESS: {
      return {
        ...state,
        bundleData: action.payload.data,
        bundles:
          action.payload.data.previous === null
            ? action.payload.data.results
            : [...state.bundles, ...action.payload.data.results],

        error: null,
        success: true,
        initialBundle: null,
      };
    }

    case actionType.GET_SELLING_ITEM_DETAIL_SUCCESS: {
      return {
        ...state,
        bundlesDetails: action.payload.data,
        error: null,
        success: true,
        initialBundle: null,
      };
    }

    case actionType.GET_SELLING_ITEM_DETAIL_LOADING: {
      return { ...state, sellingListLoading: action.payload.loading };
    }
    case actionType.GET_ORDER_DETAIL_LIST_SUCCESS: {
      return {
        ...state,
        orderDetails: action.payload.data,
        error: null,
        success: true,
        initialBundle: null,
      };
    }
    case actionType.GET_ORDER_DETAIL_LIST_ERROR: {
      return { ...state, orderListLoading: action.payload.loading };
    }
    case actionType.GET_ORDER_DETAIL_SUCCESS: {
      return {
        ...state,
        orderDetails: action.payload.data,
        error: null,
        success: true,
        initialBundle: null,
      };
    }
    case actionType.GET_ORDER_DETAIL_SUCCESS: {
      return { ...state, orderListLoading: action.payload.loading };
    }
    case actionType.ADD_NEW_BUNNDLE: {
      let { bundles, bundlesDetails } = state;
      let { data } = action.payload.data;
      let { id } = data;

      return {
        ...state,
        bundles: [{ ...data, pk: id, status: 'draft' }, ...bundles],
        initialBundle: { ...data, items: [], pk: id },
        bundlesDetails: { ...data, items: [], pk: id, status: 'draft' },
        error: null,
        success: true,
      };
    }
    case actionType.UPDATE_BUNDLE_ITEM: {
      let { bundles } = state;
      let updateBundle = { ...action.payload.data };

      let list = bundles.map((item, index) => {
        if (item.pk === updateBundle.pk) {
          let temp = {
            ...item,
            ...updateBundle,
          };
          return temp;
        } else {
          return item;
        }
      });
      return {
        ...state,
        bundles: list,
        error: null,
        success: true,
        bundlesDetails: updateBundle,
      };
    }

    case actionType.PUBLISH_BUNDLE_ERROR: {
      return {
        ...state,
        bundlePublished: false,
        bundlePublishError: action.payload.error,
      };
    }

    case actionType.UNPUBLISH_BUNDLE: {
      let { bundles, bundlesDetails } = state;
      let unpublishData = {
        ...bundlesDetails,
        status: 'draft',
      };

      let list = bundles.map((item, index) => {
        if (item.pk === unpublishData.pk) {
          let temp = {
            ...item,
            ...unpublishData,
          };
          return temp;
        } else {
          return item;
        }
      });

      return {
        ...state,
        bundlesDetails: { ...bundlesDetails, ...unpublishData },
        bundles: list,
      };
    }

    case actionType.PUBLISH_BUNDLE: {
      let { bundles, bundlesDetails } = state;
      let publishData = {
        ...bundlesDetails,
        status: 'published',
      };

      let list = bundles.map((item, index) => {
        if (item.pk === publishData.pk) {
          let temp = {
            ...item,
            ...publishData,
            items: item.items,
          };
          return temp;
        } else {
          return item;
        }
      });

      return {
        ...state,
        bundlesDetails: { ...bundlesDetails, ...publishData },
        bundles: list,
      };
    }

    case actionType.DELETE_BUNDLE_ITEM: {
      let { bundles } = state;
      const id = action.payload.data;

      filteredData = bundles.filter((item) => item.pk !== id);
      return {
        ...state,
        bundles: filteredData,
      };
    }
    case actionType.ADD_PENDING_ITEM: {
      const { bundles } = state;
      const { pk } = action.payload.data;
      const { ...itemArgs } = action.payload.data.data;
      const list = bundles.map((bundle) => {
        if (bundle.pk == pk) {
          const items = bundle['items'];
          items.push({
            ...itemArgs,
            processingRequest: true,
            id: pk,
          });
          return {
            ...bundle,
            items,
          };
        } else {
          return bundle;
        }
      });
      return {
        ...state,
        bundles: list,
        error: null,
        success: true,
        initialBundle: null,
      };
    }
    case actionType.ADD_NEW_ITEM_ERROR: {
      const { bundles } = state;
      const list = bundles.map((bundle) => {
        const items = bundle['items']?.filter(
          (element) => !element?.processingRequest
        );
        return {
          ...bundle,
          items,
        };
      });
      return {
        ...state,
        bundles: list,
        error: null,
        success: true,
        initialBundle: null,
      };
    }
    case actionType.ADD_NEW_ITEM: {
      const { bundles } = state;
      const { pk, listing_id, ...itemArgs } = action.payload.data.data;
      const list = bundles.map((bundle) => {
        if (bundle.pk == listing_id) {
          const items = bundle['items']?.filter(
            (element) => !element?.processingRequest
          );
          items.push({
            ...itemArgs,
            id: pk,
          });
          return {
            ...bundle,
            items,
          };
        } else {
          return bundle;
        }
      });
      return {
        ...state,
        bundles: list,
        error: null,
        success: true,
        initialBundle: null,
      };
    }
    case actionType.UPDATE_LISTING_ITEM: {
      let { bundles } = state;
      let updateBundle = action.payload.data;
      let list = bundles.map((item, index) => {
        if (item.pk == updateBundle.listing) {
          let items = item['items'].map((sItem, index) => {
            if (sItem.id == updateBundle.id) {
              return updateBundle;
            } else {
              return sItem;
            }
          });
          let bTemp = {
            ...item,
            items,
          };
          return bTemp;
        } else {
          return item;
        }
      });
      return {
        ...state,
        bundles: list,
        error: null,
        success: true,
      };
    }
    case actionType.DELETE_LISTING_ITEM: {
      let { bundles } = state;
      let { listingId, id } = action.payload.data;
      let list = bundles.map((item, index) => {
        if (item.pk == listingId) {
          let items = item['items'].filter((sItem) => sItem.id !== id);
          let bTemp = {
            ...item,
            items,
          };
          return bTemp;
        } else {
          return item;
        }
      });
      return {
        ...state,
        bundles: list,
        error: null,
        success: true,
      };
    }
    case actionType.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

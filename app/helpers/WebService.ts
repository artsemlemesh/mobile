import Config from '@app/config';
import NetworkHelper from './NetworkHelper';
import { loadToken } from '@app/utils/reduxStore';

const WebService = (() => {
  const BASE_URL = Config.api_base_url;
  const __makeUrl = (path: string) => {
    return `${BASE_URL}${path}`;
  };

  const __getToken = async () => {
    try {
      const token = await loadToken();
      return token;
    } catch (Err) {
      return '';
    }
  };

  const signIn = (email: string, password: string) => {
    return NetworkHelper.requestPost(__makeUrl('/auth/login'), {
      email,
      password,
    });
  };

  const socialSignIn = (provider: string, access_token: string) => {
    return NetworkHelper.requestPost(__makeUrl('/auth/oauth2/login'), {
      provider,
      access_token,
    });
  };

  const signUp = (data: any) => {
    return NetworkHelper.requestPost(__makeUrl('/auth/register'), data);
  };

  const refreshAuthToken = async () => {
    const token = await __getToken();
    return NetworkHelper.requestPut(
      __makeUrl('/auth/token/refresh'),
      {},
      token
    );
  };

  const connectStripe = async (data: any) => {
    const token = await __getToken();
    return NetworkHelper.requestPost(
      __makeUrl('/profile/account'),
      data,
      token
    );
  };
  const confirmCode = async (item: any) => {
    return NetworkHelper.requestPut(__makeUrl('/auth/confirm'), item, null);
  };
  const resendOtp = async (item: any) => {
    return NetworkHelper.requestPost(__makeUrl('/auth/resend'), item, null);
  };

  const disconnectStripe = async () => {
    const token = await __getToken();
    return NetworkHelper.requestDelete(
      __makeUrl('/profile/account'),
      {},
      token
    );
  };

  const getListings = async (url: any) => {
    let apiURL = __makeUrl(`/listings/`);
    if (url) {
      apiURL = url;
    }
    return NetworkHelper.requestGet(apiURL);
  };

  const getListingsPurchasedBy = async () => {
    const token = await __getToken();
    return NetworkHelper.requestGet(
      __makeUrl(`/listings/purchased_by/`),
      token
    );
  };

  const getListingDetail = async (id: number) => {
    const token = await __getToken();
    return NetworkHelper.requestGet(__makeUrl(`/listings/${id}/`), token);
  };

  const confirmOrder = async (id: number) => {
    const token = await __getToken();
    return NetworkHelper.requestPatch(
      __makeUrl(`/sales/${id}/confirm_to_ship/`),
      {},
      token
    );
  };

  const cancelOrder = async (id: number, reason: string) => {
    const token = await __getToken();

    const data = {
      reason: reason,
    };
    return NetworkHelper.requestPatch(
      __makeUrl(`/sales/${id}/cancel/`),
      data,
      token
    );
  };

  const buyerCancelOrder = async (id: number, reason: string) => {
    const token = await __getToken();

    const data = {
      reason: reason,
    };
    return NetworkHelper.requestPatch(
      __makeUrl(`/buyerorder/${id}/buyer_cancel_order/`),
      data,
      token
    );
  };

  const markListingRecieved = async (id: number) => {
    const token = await __getToken();
    return NetworkHelper.requestPatch(
      __makeUrl(`/listings/${id}/receive/`),
      {},
      token
    );
  };

  const updateProfile = async (item: any) => {
    const token = await __getToken();
    return NetworkHelper.requestPatch(__makeUrl(`/profile`), item, token);
  };

  const deleteProfile = async () => {
    const token = await __getToken();
    return NetworkHelper.requestDelete(__makeUrl(`/profile/delete`), {}, token);
  };

  const getUserProfile = async () => {
    const token = await __getToken();
    return NetworkHelper.requestGet(__makeUrl(`/profile`), token);
  };

  const getBundleList = async (url: any) => {
    const token = await __getToken();
    let apiURL = __makeUrl('/sellings/');
    if (url) {
      apiURL = url;
    }
    return NetworkHelper.requestGet(apiURL, token);
  };

  const getBundleDetail = async (id: number) => {
    const token = await __getToken();
    return NetworkHelper.requestGet(__makeUrl(`/sellings/${id}/`), token);
  };

  const orderDetail = async (id: number) => {
    const token = await __getToken();
    return NetworkHelper.requestGet(__makeUrl(`/sales/${id}/`), token);
  };

  const orderDetailList = async () => {
    const token = await __getToken();
    return NetworkHelper.requestGet(__makeUrl(`/sales/`), token);
  };

  const buyerOrderDetailList = async () => {
    const token = await __getToken();
    return NetworkHelper.requestGet(__makeUrl(`/buyerorder/`), token);
  };

  const buyerOrderDetail = async (id: number) => {
    const token = await __getToken();
    return NetworkHelper.requestGet(__makeUrl(`/buyerorder/${id}`), token);
  };

  const createNewBundle = async (
    title: string,
    tags: string[],
    description: string,
    seller_price: number
  ) => {
    const token = await __getToken();
    return NetworkHelper.requestPost(
      __makeUrl(`/sellings/`),
      { title, tags, description, seller_price },
      token
    );
  };

  const updateBundle = async (item: any) => {
    const token = await __getToken();
    const {
      pk,
      title,
      tags,
      description,
      seller_price,
      shipping_type,
      shipping_boxes,
    } = item;
    return NetworkHelper.requestPut(
      __makeUrl(`/sellings/${pk}/`),
      {
        title,
        tags: [],
        description,
        seller_price,
        shipping_type,
        shipping_boxes,
      },
      token
    );
  };

  const publishBundle = async (id: number) => {
    const token = await __getToken();
    return NetworkHelper.requestPatch(
      __makeUrl(`/sellings/${id}/publish/`),
      {},
      token
    );
  };

  const unpublishBundle = async (id: number) => {
    const token = await __getToken();
    return NetworkHelper.requestPatch(
      __makeUrl(`/sellings/${id}/unpublish/`),
      {},
      token
    );
  };

  const deleteBundle = async (id: number) => {
    const token = await __getToken();
    return NetworkHelper.requestDelete(
      __makeUrl(`/sellings/${id}/`),
      { id },
      token
    );
  };

  const orderSupplies = async (data) => {
    const token = await __getToken();
    return NetworkHelper.requestPost(
      __makeUrl(`/sellings/supplies/`),
      data,
      token
    );
  };

  const addItem = async (id: number, item: any) => {
    const token = await __getToken();
    return NetworkHelper.requestHttp(
      'POST',
      __makeUrl(`/sellings/${id}/items/`),
      item,
      token
    );
  };

  // const addItem = async (id: number, item: any) => {
  //   const token = await __getToken();
  //   return NetworkHelper.requestPost(
  //     __makeUrl(`/sellings/${id}/items/`),
  //     item,
  //     token
  //   );
  // };

  const updateItem = async (listingId: number, id: number, item: any) => {
    const token = await __getToken();

    return NetworkHelper.requestHttp(
      'PATCH',
      __makeUrl(`/sellings/${listingId}/items/${id}/`),
      item,
      token
    );

    // return NetworkHelper.requestPatch(
    //   __makeUrl(`/sellings/${listingId}/items/${id}/`),
    //   item,
    //   token
    // );
  };

  const deleteItem = async (listingId: number, id: number) => {
    const token = await __getToken();
    return NetworkHelper.requestDelete(
      __makeUrl(`/sellings/${listingId}/items/${id}/`),
      {},
      token
    );
  };

  const clearImage = async (listingId: number, id: number) => {
    const token = await __getToken();
    return NetworkHelper.requestGet(
      __makeUrl(`/sellings/${listingId}/items/${id}/progress/`),
      token
    );
  };
  const addSuggestBrand = async (brands: any) => {
    const token = await __getToken();
    return NetworkHelper.requestPost(
      __makeUrl(`/item/options/brands/suggest`),
      brands,
      token
    );
  };

  const applyFilter = () => {
    return NetworkHelper.requestGet(__makeUrl(`/item/options/`));
  };

  const getCart = async () => {
    const token = await __getToken();
    return NetworkHelper.requestGet(__makeUrl(`/cart`), token);
  };

  const addToCart = async (item: any) => {
    const token = await __getToken();
    return NetworkHelper.requestPost(__makeUrl(`/cart/items`), item, token);
  };

  const deleteFromCart = async (itemID: number) => {
    const token = await __getToken();
    return NetworkHelper.requestDelete(
      __makeUrl(`/cart/items/${itemID}`),
      {},
      token
    );
  };

  const filterData = async (url: any) => {
    let token = null;
    try {
      token = await __getToken();
    } catch (ex) {}
    return NetworkHelper.requestGet(__makeUrl(url), token);
  };
  const review = async (item) => {
    const token = await __getToken();
    return NetworkHelper.requestPost(
      __makeUrl('/listing-ratings/'),
      item,
      token
    );
  };
  // const cartCheckout = async () => {
  //   const token = await __getToken();
  //   return NetworkHelper.requestPatch(__makeUrl(`/cart/checkout`), {}, token);
  // };
  const cartCheckout = async (obj: any) => {
    let token = null;
    try {
      token = await __getToken();
    } catch (ex) {}
    return NetworkHelper.requestPost(
      __makeUrl(`/cart/checkout/v2`),
      obj,
      token
    );
  };

  const expressDashboard = async () => {
    const token = await __getToken();
    return NetworkHelper.requestPost(__makeUrl(`/profile/express`), {}, token);
  };

  const stripeAccountLink = async () => {
    const token = await __getToken();
    return NetworkHelper.requestGet(
      __makeUrl(`/profile/stripe-account-link`),
      token
    );
  };

  const stripeBalance = async () => {
    const token = await __getToken();
    return NetworkHelper.requestGet(
      __makeUrl(`/profile/stripe-balance`),
      token
    );
  };

  const socialApple = async (params: any) => {
    return NetworkHelper.requestPost(
      __makeUrl(`/auth/social/apple/mobile`),
      params
    );
  };

  const forgotPass = (email: string) => {
    return NetworkHelper.requestPost(__makeUrl('/auth/forgot'), {
      email,
    });
  };

  const expoPushToken = async (data: any) => {
    return NetworkHelper.requestPost(__makeUrl('/notification/'), data);
  };

  const imageProgress = async (pk: number) => {
    const token = await __getToken();
    return NetworkHelper.requestPost(
      __makeUrl(`/listing-image/progress/${pk}/`),
      null,
      token
    );
  };

  const removeBackground = async (listingImage: any) => {
    const token = await __getToken();
    return NetworkHelper.requestPut(
      __makeUrl('/listing-image/remove-background/'),
      listingImage,
      token
    );
  };

  const listingImageID = async (pk: number) => {
    const token = await __getToken();
    return NetworkHelper.requestGet(__makeUrl(`/listing-image/${pk}`), token);
  };

  // Feedback
  const sendFeedback = async (data: any) => {
    const token = await __getToken();
    return NetworkHelper.requestPost(__makeUrl('/feedback/'), data, token);
  };

  return {
    signIn,
    socialSignIn,
    signUp,
    refreshAuthToken,
    updateProfile,
    deleteProfile,
    connectStripe,
    disconnectStripe,
    getUserProfile,
    getListings,
    getListingsPurchasedBy,
    getListingDetail,
    markListingRecieved,
    getBundleList,
    getBundleDetail,
    createNewBundle,
    orderDetail,
    orderDetailList,
    buyerOrderDetail,
    buyerOrderDetailList,
    updateBundle,
    deleteBundle,
    publishBundle,
    addItem,
    updateItem,
    deleteItem,
    applyFilter,
    getCart,
    addToCart,
    deleteFromCart,
    cartCheckout,
    filterData,
    unpublishBundle,
    clearImage,
    review,
    expressDashboard,
    stripeAccountLink,
    stripeBalance,
    confirmCode,
    addSuggestBrand,
    resendOtp,
    socialApple,
    forgotPass,
    expoPushToken,
    imageProgress,
    removeBackground,
    listingImageID,
    confirmOrder,
    cancelOrder,
    buyerCancelOrder,
    orderSupplies,
    sendFeedback,
  };
})();

export default WebService;

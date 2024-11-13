import WebService from '../helpers/WebService';

export const getListings = (url: any) => {
  return new Promise((resolve, reject) => {
    WebService.getListings(url)
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};

export const orderDetailList = () => {
  return new Promise((resolve, reject) => {
    WebService.orderDetailList()
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};

export const buyerOrderDetailList = () => {
  return new Promise((resolve, reject) => {
    WebService.buyerOrderDetailList()
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};

export const getListingsPurchasedBy = () => {
  return new Promise((resolve, reject) => {
    WebService.getListingsPurchasedBy()
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};

export const getListingDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    WebService.getListingDetail(id)
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};

export const confirmOrder = (id: number) => {
  return new Promise((resolve, reject) => {
    WebService.confirmOrder(id)
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};

export const cancelOrder = (id: number, reason: string) => {
  return new Promise((resolve, reject) => {
    WebService.cancelOrder(id, reason)
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};

export const BuyerCancelOrder = (id: number, reason: string) => {
  return new Promise((resolve, reject) => {
    WebService.buyerCancelOrder(id, reason)
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};

export const applyFilter = () => {
  return new Promise((resolve, reject) => {
    WebService.applyFilter()
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response.body);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};

export const filterData = (url: any) => {
  return new Promise((resolve, reject) => {
    WebService.filterData(url)
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};

export const review = (item) => {
  return new Promise((resolve, reject) => {
    WebService.review(item)
      .then((response) => {
        if (response.statusCode === 201) {
          resolve(response);
        } else if (response.statusCode === 400) {
          resolve(response);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};

export const receive = (listing_id) => {
  return new Promise((resolve, reject) => {
    WebService.markListingRecieved(listing_id)
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};

import { AnyAction } from 'redux';
import WebService from '../helpers/WebService';

export const getBundleList = (url: any) => {
  return new Promise((resolve, reject) => {
    WebService.getBundleList(url)
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

// export const orderDetailList = () => {
//   return new Promise((resolve, reject) => {
//     WebService.orderDetailList(url)
//       .then((response) => {
//         if (response.statusCode === 200 || response.statusCode === 201) {
//           resolve(response.body);
//         } else {
//           reject(new Error(response.body));
//         }
//       })
//       .catch(reject);
//   });
// };

export const orderDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    WebService.orderDetail(id)
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

export const getBundleDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    WebService.getBundleDetail(id)
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

export const createNewBundle = (
  title: string,
  tags: string[],
  description: string,
  seller_price: number
) => {
  return new Promise((resolve, reject) => {
    WebService.createNewBundle(title, tags, description, seller_price)
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

export const updateBundle = (item: any) => {
  return new Promise((resolve, reject) => {
    WebService.updateBundle(item)
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

export const publishBundle = (id: number) => {
  return new Promise((resolve, reject) => {
    WebService.publishBundle(id)
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

export const unpublishBundle = (id: number) => {
  return new Promise((resolve, reject) => {
    WebService.unpublishBundle(id)
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

export const deleteBundle = (pk: number) => {
  return new Promise((resolve, reject) => {
    WebService.deleteBundle(pk)
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

export const orderSupplies = (data: any) => {
  return new Promise((resolve, reject) => {
    WebService.orderSupplies(data)
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

export const addItem = (id: number, item: any) => {
  return new Promise((resolve, reject) => {
    WebService.addItem(id, item)
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

export const updateItem = (listingId: number, id: number, item: any) => {
  return new Promise((resolve, reject) => {
    WebService.updateItem(listingId, id, item)
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

export const deleteItem = (listingId: number, id: number) => {
  return new Promise((resolve, reject) => {
    WebService.deleteItem(listingId, id)
      .then((response) => {
        if (response.statusCode === 204) {
          resolve(response.body);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};

export const clearImage = (listingId: number, id: number) => {
  return new Promise((resolve, reject) => {
    WebService.clearImage(listingId, id)
      .then((response) => {
        if (response) {
          resolve(response);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};
export const addSuggestBrand = (brands: any) => {
  return new Promise((resolve, reject) => {
    WebService.addSuggestBrand(brands)
      .then((response) => {
        if (response) {
          resolve(response);
        } else {
          reject(new Error(response.body));
        }
      })
      .catch(reject);
  });
};

export const imageProgress = (Id: number) => {
  return new Promise((resolve, reject) => {
    WebService.imageProgress(Id)
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body);
        } else if (response.statusCode === 409) {
          reject(response);
        } else {
          reject(response.body);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const removeBackground = (listingImage: any) => {
  return new Promise((resolve, reject) => {
    WebService.removeBackground(listingImage)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 202) {
          resolve(response.body);
        } else {
          reject(response.body);
        }
      })
      .catch(reject);
  });
};

export const listingImageID = (pk: number) => {
  return new Promise((resolve, reject) => {
    WebService.listingImageID(pk)
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body);
        } else {
          reject(response.body);
        }
      })
      .catch(reject);
  });
};

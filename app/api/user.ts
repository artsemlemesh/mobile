import WebService from '../helpers/WebService';

export const signIn = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    WebService.signIn(email, password)
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body);
        } else {
          reject(response);
        }
      })
      .catch(reject);
  });
};

export const socialLogin = (provider: string, accessToken: string) => {
  return new Promise((resolve, reject) => {
    WebService.socialSignIn(provider, accessToken)
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body);
        } else {
          reject(response.body.phone);
        }
      })
      .catch(reject);
  });
};

export const refreshAuthToken = () => {
  return new Promise((resolve, reject) => {
    WebService.refreshAuthToken()
      .then((response) => resolve(response.body))
      .catch(reject);
  });
};

export const signUp = (data) => {
  return new Promise((resolve, reject) => {
    WebService.signUp(data)
      .then((response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(response.body);
        } else {
          reject(response.body);
        }
      })
      .catch(reject);
  });
};

export const connectStripe = (data) => {
  return new Promise((resolve, reject) => {
    WebService.connectStripe(data)
      .then((response) => {
        if (response.statusCode === 201 || response.statusCode === 200) {
          resolve(response.body);
        } else {
          reject(response.body);
        }
      })
      .catch(reject);
  });
};
export const confirmCode = (item) => {
  return new Promise((resolve, reject) => {
    WebService.confirmCode(item)
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
export const resendOtp = (item) => {
  return new Promise((resolve, reject) => {
    WebService.resendOtp(item)
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

export const disconnectStripe = () => {
  return new Promise((resolve, reject) => {
    WebService.disconnectStripe()
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

export const getUserProfile = () => {
  return new Promise((resolve, reject) => {
    WebService.getUserProfile()
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

export const updateProfile = (item: any) => {
  return new Promise((resolve, reject) => {
    WebService.updateProfile(item)
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

export const deleteProfile = () => {
  return new Promise((resolve, reject) => {
    WebService.deleteProfile()
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

export const expressDashboard = () => {
  return new Promise((resolve, reject) => {
    WebService.expressDashboard()
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

export const stripeAccountLink = () => {
  return new Promise((resolve, reject) => {
    WebService.stripeAccountLink()
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

export const stripeBalance = () => {
  return new Promise((resolve, reject) => {
    WebService.stripeBalance()
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

export const socialApple = (params) => {
  return new Promise((resolve, reject) => {
    WebService.socialApple(params)
      .then((response) => {
        if (response.statusCode === 200) {
          resolve(response.body);
        } else if (response.statusCode === 400) {
          resolve(response.body);
        } else {
          reject(response.body.phone);
        }
      })
      .catch(reject);
  });
};

export const forgot = (email: string) => {
  return new Promise((resolve, reject) => {
    WebService.forgotPass(email)
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

export const expoPushToken = (data) => {
  return new Promise((resolve, reject) => {
    WebService.expoPushToken(data)
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

export const sendFeedback = (data) => {
  return new Promise((resolve, reject) => {
    WebService.sendFeedback(data)
      .then((response) => {
        if (response.statusCode === 201) {
          resolve(response.body);
        } else {
          reject(response);
        }
      })
      .catch(reject);
  });
};

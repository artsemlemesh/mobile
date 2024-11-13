import axios from 'axios';
class NetworkHelper {
  static requestPost(url, params, headers = null) {
    return NetworkHelper.requestHttp('POST', url, params, headers);
  }

  static requestGet(url, headers = null) {
    return NetworkHelper.requestHttp('GET', url, null, headers);
  }

  static requestPut(url, params, headers = null) {
    return NetworkHelper.requestHttp('PUT', url, params, headers);
  }

  static requestPatch(url, params, headers = null) {
    return NetworkHelper.requestHttp('PATCH', url, params, headers);
  }

  static requestDelete(url, params, headers = null) {
    return NetworkHelper.requestHttp('DELETE', url, params, headers);
  }

  static requestHttp(method, url, params, token) {
    console.log(url);
    return new Promise((resolve, reject) => {
      var options = {
        method,
        url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=UTF-8;multipart/form-data',
        },
      };
      if (params) {
        options.data = params;
      }
      if (token) {
        options.headers['Authorization'] = 'Token ' + token;
      }

      axios(options)
        .then((response) => {
          resolve({ statusCode: response.status, body: response.data });
        })
        .catch((error) => {
          if (error.response !== undefined) {
            reject({
              statusCode: error.response.status,
              body: error.response.data,
            });
          } else {
            reject(new Error('Check Your Connection'));
          }
        });
    });
  }

  static requestHttp2(method, url, params, token) {
    return new Promise((resolve, reject) => {
      var options = {
        method,
        url,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      if (params) {
        options.data = params;
      }
      if (token) {
        options.headers['Authorization'] = 'Token ' + token;
      }
      axios(options)
        .then((response) => {
          resolve({ statusCode: response.status, body: response.data });
        })
        .catch((error) => {
          if (error.response !== undefined) {
            resolve({
              statusCode: error.response.status,
              body: error.response.data,
            });
          } else {
            reject(new Error('Check Your Connection'));
          }
        });
    });
  }
}

export default NetworkHelper;

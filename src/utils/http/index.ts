class Request {
  private defaultConfig: UniApp.RequestOptions = {
    url: '',
    data: {},
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    timeout: 5000,
    dataType: 'json',
    responseType: 'text'
  };

  interceptors = {
    request: (
      func: (...args: UniApp.RequestOptions[]) => UniApp.RequestOptions
    ) => {
      Request.requestBefore = func;
    },
    response: (
      func: (
        ...args: UniApp.RequestSuccessCallbackResult[]
      ) =>
        | UniApp.RequestSuccessCallbackResult
        | Promise<UniApp.RequestSuccessCallbackResult>
    ) => {
      Request.responseAfter = func;
    }
  };

  static requestBefore(config: UniApp.RequestOptions) {
    return config;
  }
  static responseAfter(
    res: UniApp.RequestSuccessCallbackResult
  ):
    | UniApp.RequestSuccessCallbackResult
    | Promise<UniApp.RequestSuccessCallbackResult> {
    return res;
  }

  http(options: UniApp.RequestOptions) {
    options.url = import.meta.env.VITE_URL_HEADER + options.url;
    options.method = options.method ? options.method : 'GET';
    options.data = options.data ?? {};
    options.header = { ...this.defaultConfig, ...options.header };

    options = { ...options, ...Request.requestBefore(options) };

    return new Promise((resolve, reject) => {
      // 收到开发者服务器成功返回的回调函数
      options.success = (res) => {
        resolve(Request.responseAfter(res));
      };
      // 接口调用失败的回调函数
      options.fail = (err) => {
        console.log('进来了');
        reject(err);
      };
      // 接口调用结束的回调函数（调用成功、失败都会执行
      options.complete = () => {
        //
      };
      uni.request(options);
    });
  }
}

const request = new Request();

// 请求拦截
request.interceptors.request((config: UniApp.RequestOptions) => {
  return config;
});

// 响应拦截
request.interceptors.response((res: UniApp.RequestSuccessCallbackResult) => {
  if (res.statusCode !== 200) {
    handleNetworkError(res.statusCode);
    return Promise.reject(res.data);
  }
  return res;
});

// 错误处理
function handleNetworkError(errStatus: number) {
  let errMessage = '未知错误';
  if (errStatus) {
    switch (errStatus) {
      case 400:
        errMessage = '错误的请求';
        break;
      case 401:
        errMessage = '未授权，请重新登录';
        break;
      case 403:
        errMessage = '拒绝访问';
        break;
      case 404:
        errMessage = '请求错误,未找到该资源';
        break;
      case 405:
        errMessage = '请求方法未允许';
        break;
      case 408:
        errMessage = '请求超时';
        break;
      case 500:
        errMessage = '服务器端出错';
        break;
      case 501:
        errMessage = '网络未实现';
        break;
      case 502:
        errMessage = '网络错误';
        break;
      case 503:
        errMessage = '服务不可用';
        break;
      case 504:
        errMessage = '网络超时';
        break;
      case 505:
        errMessage = 'http版本不支持该请求';
        break;
      default:
        errMessage = `其他连接错误 -- ${errStatus}`;
    }
  } else {
    errMessage = '无法连接到服务器！';
  }
  uni.showToast({
    title: errMessage,
    duration: 2000
  });
}

export default request;

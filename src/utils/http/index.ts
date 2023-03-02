import type {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse
} from 'axios';
import axios from 'axios';
import qs from 'qs';
import type { Fn, ErrorType, IAnyObj, FcResponse } from '@/types/axios';

// 请求调整
const handleRequestHeader = (config: InternalAxiosRequestConfig) => {
  return config;
};
// 配置授权信息
const handleAuth = (config: InternalAxiosRequestConfig) => {
  return config;
};
// 请求拦截
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config = handleRequestHeader(config);
    config = handleAuth(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status !== 200) return Promise.reject(response.data);
    handleAuthError(response.data.code);
    return response;
  },
  (error) => {
    handleNetworkError(error.response.status);
    return Promise.reject(error);
  }
);
// 错误处理（网络错误、授权错误）
const handleNetworkError = (errStatus: number) => {
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
};
const handleAuthError = (errorNo: string) => {
  const authErrMap: IAnyObj = {
    '10031': '登录失效，需要重新登录'
  };
  if (Object.prototype.hasOwnProperty.call(authErrMap, errorNo)) {
    uni.showToast({
      title: authErrMap[errorNo] as string,
      duration: 2000
    });
  }
};

export const Get = <T>(
  url: string,
  params: IAnyObj = {},
  clearFn?: Fn
): Promise<ErrorType | FcResponse<T>> => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params })
      .then((response) => {
        console.log('我进来了');
        let res: FcResponse<T>;
        if (clearFn) {
          res = clearFn(response.data) as unknown as FcResponse<T>;
        } else {
          res = response.data;
        }
        resolve(res);
      })
      .catch((error: AxiosError | Error) => {
        reject(error);
      });
  });
};

export const Post = <T>(
  url: string,
  data: IAnyObj = {},
  config: IAnyObj,
  isForm = false
): Promise<ErrorType | FcResponse<T>> => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, isForm ? qs.stringify(data) : data, config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError | Error) => {
        reject(error);
      });
  });
};

export type Fn = (data: FcResponse<object | string | unknown>) => unknown;

export type ErrorType = AxiosError | Error | undefined;

export interface IAnyObj {
  [key: string]: unknown;
}

export interface FcResponse<T> {
  errorNo: string;
  errorMsg: string;
  data: T;
}

export interface Result<T> {
  code: number;
  type: 'success' | 'error' | 'warning';
  message: string;
  data: T;
}

export interface IAnyObj {
  [key: string]: unknown;
}

export type MaybeRef<T> = Ref<T> | T;

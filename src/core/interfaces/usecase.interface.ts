import { QueryResult } from '../models';

export interface Usecase<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //TODO: I ADD STRING AND ANY. THINK OF THEM
  execute(...args: any): Promise<void | boolean | string | any | T | QueryResult<T> | T[]> | T;
}

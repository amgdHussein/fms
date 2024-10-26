import { ParamType } from '../models';

export interface Repository<T> {
  get(id: string, ...args: ParamType[]): Promise<T>;
  add(input: Partial<T>): Promise<T>;
  update(input: Partial<T> & { id: string }): Promise<T>;
  delete(id: string, ...args: ParamType[]): Promise<T>;
}

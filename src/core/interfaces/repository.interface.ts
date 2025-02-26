import { ParamType } from '../queries';

export interface Repository<T> {
  get(id: string, ...args: ParamType[]): Promise<T>;
  add(input: Partial<T>, ...args: ParamType[]): Promise<T>;
  update(input: Partial<T> & { id: string }, ...args: ParamType[]): Promise<T>;
  delete(id: string, ...args: ParamType[]): Promise<T>;
}

import { Repository } from '../../../../core/interfaces/repository.interface';
import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/models';
import { Receipt } from '../entities';

export interface IReceiptRepository extends Repository<Receipt> {
  getAll(): Promise<Receipt[]>;
  query(page: number, limit: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Receipt>>;
  addBatch(receipts: Receipt[]): Promise<Receipt[]>;
}

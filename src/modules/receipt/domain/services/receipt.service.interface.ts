import { QueryFilter, QueryOrder, QueryResult } from '../../../../core/queries';
import { Receipt } from '../entities';

export interface IReceiptService {
  getReceipts(): Promise<Receipt[]>;
  queryReceipts(page?: number, limit?: number, filters?: QueryFilter[], order?: QueryOrder): Promise<QueryResult<Receipt>>;
  getReceipt(id: string): Promise<Receipt>;
  addReceipt(receipt: Receipt): Promise<Receipt>;
  addReceipts(receipts: Receipt[]): Promise<Receipt[]>;
  updateReceipt(receipt: Partial<Receipt> & { id: string }): Promise<Receipt>;
  deleteReceipt(id: string): Promise<Receipt>;
}

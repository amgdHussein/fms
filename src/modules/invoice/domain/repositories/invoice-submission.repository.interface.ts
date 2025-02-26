import { Repository } from '../../../../core/interfaces';
import { QueryFilter, QueryOrder } from '../../../../core/queries';
import { Submission } from '../entities';

export interface IInvoiceSubmissionRepository extends Repository<Submission> {
  getMany(invoiceId: string, filters?: QueryFilter[], page?: number, limit?: number, order?: QueryOrder): Promise<Submission[]>;
  addMany(submissions: Partial<Submission>[], invoiceId: string): Promise<Submission[]>;
  updateMany(submissions: (Partial<Submission> & { id: string })[], invoiceId: string): Promise<Submission[]>;
}

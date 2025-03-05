import { AddEtaInvoice } from '../../../../core/providers';
import { TaxInvoice } from '../entities';

export interface IEtaInvoiceService {
  // ? Invoice Related
  processInvoices(ids: string[]): Promise<boolean>;
  submitInvoices(invoices: (AddEtaInvoice & { invoiceId: string })[], organizationId: string): Promise<void>;
  cancelInvoice(id: string, uuid: string, status: 'cancelled' | 'rejected', reason: string): Promise<TaxInvoice>;
  acceptInvoice(id: string): Promise<TaxInvoice>;

  // ? Sync Related
  syncReceivedInvoices(organizationId: string): Promise<any>;
}

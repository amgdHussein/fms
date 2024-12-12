import { Payment } from '../../../../modules/payment/domain';

import { Delivery } from './delivery.entity';
import { EtaInvoiceLine, EtaInvoiceType, TaxTotal } from './eta-invoice.entity';
import { Issuer } from './issuer.entity';
import { EtaSignature } from './signature.entity';

export class AddEtaInvoice {
  issuer: Issuer;
  receiver: Issuer;
  documentType: EtaInvoiceType;
  documentTypeVersion: string;
  dateTimeIssued: string;
  taxpayerActivityCode: string; // TODO: activity codes see if it can be enum
  internalID: string;
  purchaseOrderReference?: string;
  purchaseOrderDescription?: string;
  salesOrderReference?: string;
  salesOrderDescription?: string;
  proformaInvoiceNumber?: string;
  payment?: Payment;
  delivery?: Delivery;
  invoiceLines: EtaInvoiceLine[]; // Invoice lines of the invoice. Needs to have at least one invoice line.
  totalSalesAmount: number; // TODO: revise this todo => 5 decimal digits allowed.
  totalDiscountAmount: number; // TODO: revise this todo => 5 decimal digits allowed.
  netAmount: number; // TODO: revise this todo => 5 decimal digits allowed.
  taxTotals: TaxTotal[]; //TODO: CHECK IF OPTIONAL OR NOT
  extraDiscountAmount: number; // TODO: revise this todo => 5 decimal digits allowed.
  totalItemsDiscountAmount: number; // TODO: revise this todo => 5 decimal digits allowed.
  totalAmount: number; // TODO: revise this todo => 5 decimal digits allowed.
  signatures?: EtaSignature[];

  references?: string[]; // * Incase of credit note or debit note, at least one reference must be present.
  serviceDeliveryDate?: string; // * Incase of export credit note or export debit note, invoice must has service delivery date.
}

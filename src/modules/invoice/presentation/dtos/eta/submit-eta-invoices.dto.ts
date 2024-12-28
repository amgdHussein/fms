import { AddEtaInvoice, EtaInvoiceLine, EtaInvoiceType, EtaSignature, Issuer } from '../../../../../core/providers';
import { Delivery } from '../../../../../core/providers/eta/entities/delivery.entity';
import { TaxTotal } from '../../../../../core/providers/eta/entities/eta-invoice.entity';
import { Payment } from '../../../../payment/domain';

class SubmitEtaInvoiceDto implements AddEtaInvoice {
  invoiceId: string; // Additional add invoice reference

  issuer: Issuer;
  receiver: Issuer;
  documentType: EtaInvoiceType;
  documentTypeVersion: string;
  dateTimeIssued: string;
  taxpayerActivityCode: string;
  internalID: string;
  purchaseOrderReference?: string;
  purchaseOrderDescription?: string;
  salesOrderReference?: string;
  salesOrderDescription?: string;
  proformaInvoiceNumber?: string;
  payment?: Payment;
  delivery?: Delivery;
  invoiceLines: EtaInvoiceLine[];
  totalSalesAmount: number;
  totalDiscountAmount: number;
  netAmount: number;
  taxTotals: TaxTotal[];
  extraDiscountAmount: number;
  totalItemsDiscountAmount: number;
  totalAmount: number;
  signatures?: EtaSignature[];
  references?: string[];
  serviceDeliveryDate?: string;
}

export class SubmitEtaInvoicesDto {
  organizationId: string;
  invoices: SubmitEtaInvoiceDto[];
}

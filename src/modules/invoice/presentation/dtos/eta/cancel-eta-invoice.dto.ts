export class CancelEtaInvoiceDto {
  uuid: string;
  status: 'cancelled' | 'rejected';
  reason: string;
}

export enum InvoiceStatus {
  DRAFT = 0,
  ISSUED = 1,
  SENT = 2, // The invoice has been sent to the customer but not yet confirmed.
  VIEWED = 3, // The customer has opened or viewed the invoice.
  OVERDUE = 4,
  PAID = 5,
  PARTIALLY_PAID = 6,
  REFUNDED = 7, // A refund has been issued for the invoice.
  ARCHIVED = 8, // The invoice is archived and no longer active.
}

export enum TaxInvoiceStatus {
  INITIAL = 0,
  PROCESSING = 1,
  SIGNING = 2,
  SIGNED = 3,
  SUBMITTED = 4,
  FAILED = 5, // The invoice submission has failed.
  REJECTED = 6, // The invoice has been rejected by the tax authority.
  ACCEPTED = 7,
  CANCELLED = 8,
}

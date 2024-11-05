export const INVOICE_REPOSITORY_PROVIDER = 'INVOICE_REPOSITORY';
export const INVOICE_SERVICE_PROVIDER = 'INVOICE_SERVICE';
export const INVOICE_ITEM_REPOSITORY_PROVIDER = 'INVOICE_ITEM_REPOSITORY';
export const INVOICE_USECASE_PROVIDERS = {
  ADD_INVOICE: 'ADD_INVOICE',
  GET_INVOICE: 'GET_INVOICE',
  UPDATE_INVOICE: 'UPDATE_INVOICE',
  DELETE_INVOICE: 'DELETE_INVOICE',
  GET_INVOICE_ITEMS: 'GET_INVOICE_ITEMS',
  QUERY_INVOICES: 'QUERY_INVOICES',

  GET_ORGANIZATION_INVOICES: 'GET_ORGANIZATION_INVOICES',
  GET_CLIENT_INVOICES: 'GET_CLIENT_INVOICES',
  // SHARE_INVOICE: 'SHARE_INVOICE',

  RECEIVE_ETA_INVOICE: 'RECEIVE_ETA_INVOICE',
  REJECT_ETA_INVOICE: 'REJECT_ETA_INVOICE',
  ACCEPT_ETA_INVOICE: 'ACCEPT_ETA_INVOICE',
  PROCESS_ETA_INVOICE: 'PROCESS_ETA_INVOICE',
  SUBMIT_ETA_INVOICE: 'SUBMIT_ETA_INVOICE',
};

// /x/organizations/systemId/eta/invoices/sync (get) => received invoice
// /x/organizations/systemId/eta/invoices/id/reject (delete)
// /x/organizations/systemId/eta/invoices/id/accept (get)

//? submit
// /x/organizations/systemId/eta/invoices/id/process (post) (c#) [auth]
// /x/organizations/systemId/eta/invoices/id (post) [token]

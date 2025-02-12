import * as moment from 'moment-timezone';

import { CurrencyCode } from '../common';

import { ETA_TAX_SUB_TYPES_WITH_TYPE } from '../providers/eta/constants';
import { AddEtaInvoice, EtaInvoiceLine, GetInvoices, Issuer, IssuerType, QueryCodes, TaxableItems } from '../providers/eta/entities';

import { Client } from '../../modules/client/domain';
import { Code } from '../../modules/code/domain';
import { InvoiceForm, Item, TaxInvoice } from '../../modules/invoice/domain';
import { Organization, OrganizationBranch, OrganizationTax, ProductTax } from '../../modules/organization/domain';

import { roundToFive, roundToTwo } from './math.utils';

export function buildEtaQuery(obj: Partial<QueryCodes> | Partial<GetInvoices>): string {
  return Object.entries(obj)
    .filter(([, value]) => value && value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value.toString())}`)
    .join('&');
}

function getTotalItemsDiscount(items: Item[]): number {
  const total = items.reduce((acc, item) => acc + (item.taxDiscount?.value || 0), 0);
  return roundToTwo(total);
}

function getItemTaxableFees(item: Item): number {
  const TAXABLE_FEES_LIST = ['T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  const totalTaxableFees = item.taxes.reduce((acc: number, tax: ProductTax) => {
    if (TAXABLE_FEES_LIST.includes(tax?.taxType)) {
      return acc + tax.value;
    }

    return acc;
  }, 0);

  return roundToTwo(totalTaxableFees);
}

function getTaxType(subType: string): 'fixed' | 'percentage' {
  return ETA_TAX_SUB_TYPES_WITH_TYPE.find(tax => tax.Code === subType)?.type === 'rate' ? 'percentage' : 'fixed';
}

function getTaxRate(
  tax: ProductTax,
  netAmount: number,
  profitOrLoss: number,
  totalTaxableFees: number,
  taxTypeT3Amount: number,
  taxTypeT2Amount: number,
  itemsDiscount: number,
): number {
  switch (tax.taxType) {
    case 'T2':
      const t2Base = netAmount + totalTaxableFees + profitOrLoss;
      return roundToTwo((tax.value * 100) / t2Base);

    case 'T1':
      const t1Base = taxTypeT2Amount + netAmount + totalTaxableFees + profitOrLoss + taxTypeT3Amount;
      return roundToTwo((tax.value * 100) / t1Base);

    case 'T4':
      const t4Base = netAmount - itemsDiscount;
      return roundToTwo((tax.value * 100) / t4Base);

    default:
      return getTaxType(tax.subType) === 'percentage' ? roundToTwo((tax.value * 100) / netAmount) : 0;
  }
}

function setTaxableItems(item: Item): TaxableItems[] {
  const taxTypeT3Amount = item.taxes.find(tax => tax.taxType === 'T3')?.value ?? 0;
  const taxTypeT2Amount = item.taxes.find(tax => tax.taxType === 'T2')?.value ?? 0;
  const itemsDiscount = item.taxDiscount?.value ?? 0;
  const totalTaxableFees = getItemTaxableFees(item);
  return item.taxes.map(tax => {
    return {
      taxType: tax.taxType,
      subType: tax.subType,
      rate: getTaxRate(tax, item.netAmount, item.profitOrLoss, totalTaxableFees, taxTypeT3Amount, taxTypeT2Amount, itemsDiscount),
      amount: tax.value,
    };
  });
}

// ? Mapping functions

function mappedTaxTotals(invoiceLines: Item[]): { taxType: string; amount: number }[] {
  const filteredTaxes = new Map<string, number>();

  invoiceLines.forEach((line: Item) => {
    line.taxes?.forEach(tax => {
      const existingAmount = filteredTaxes.get(tax.taxType) || 0;
      const updatedAmount = roundToTwo(existingAmount + tax.value);
      filteredTaxes.set(tax.taxType, updatedAmount);
    });
  });

  return Array.from(filteredTaxes, ([taxType, amount]) => ({ taxType, amount }));
}

function mapEtaInvoiceItems(invoice: TaxInvoice, codes: Code[]): EtaInvoiceLine[] {
  return invoice.items.map((item: Item) => {
    const code = codes.find(code => code.id === item.codeId);

    return {
      description: code.description ?? 'description',
      itemType: code.authorityCodeType,
      itemCode: code.code,
      unitType: item.unitType,
      quantity: item.quantity,
      internalCode: item.id,
      salesTotal: item.grossAmount,
      total: item.totalAmount,
      valueDifference: item.profitOrLoss ?? 0,
      totalTaxableFees: getItemTaxableFees(item),
      netTotal: item.netAmount,
      itemsDiscount: item.taxDiscount.value,
      unitValue: {
        currencySold: invoice.currency.code,
        amountEGP: invoice.currency.code === CurrencyCode.EGP ? item.unitPrice : roundToFive(item.unitPrice * invoice.currency.rate),
        amountSold: invoice.currency.code === CurrencyCode.EGP ? 0 : item.unitPrice,
        currencyExchangeRate: invoice.currency.code === CurrencyCode.EGP ? null : invoice.currency.rate,
      },
      discount: item.discount.value,
      taxableItems: setTaxableItems(item),
    };
  });
}

function mapEtaExportInvoiceItems(invoice: TaxInvoice, codes: Code[]): EtaInvoiceLine[] {
  const lines: EtaInvoiceLine[] = mapEtaInvoiceItems(invoice, codes);
  return lines.map((line: EtaInvoiceLine, idx) => {
    const item = invoice.items[idx];
    line.weightUnitType = item.wightType;
    line.weightQuantity = item.wight;
    return line;
  });
}

function getMappedEtaInvoice(
  invoice: TaxInvoice,
  client: Client,
  organization: Organization,
  organizationTax: OrganizationTax,
  branch: OrganizationBranch,
  codes: Code[],
): AddEtaInvoice {
  // Setup organization address
  const issuer: Issuer = {
    id: organizationTax.taxIdNo,
    name: organization.name,
    type: IssuerType.BUSINESS, // IssuerType
    address: {
      branchID: branch.branchCode,
      country: branch.country,
      governate: branch.governorate,
      regionCity: branch.city,
      street: branch.street,
      buildingNumber: branch.buildingNumber || '0',
    },
  };

  // Setup client address
  const receiver = {
    id: client.identificationId,
    name: client.name,
    type: client.type,
    address: {
      country: client.address.country,
      governate: client.address.country,
      regionCity: client.address.country,
      street: client.address.street,
      buildingNumber: '0',
    },
  };

  return {
    issuer,
    receiver,
    documentType: invoice.form,
    documentTypeVersion: '1.0', // TODO: CREATE APP SETTINGS WITH ETA/TAX VERSION
    dateTimeIssued: moment(invoice.issuedAt).toISOString(),
    taxpayerActivityCode: invoice.activityCode,
    internalID: invoice.invoiceNumber,
    totalSalesAmount: invoice.grossAmount,
    totalDiscountAmount: invoice.discount,
    netAmount: invoice.netAmount,
    totalAmount: invoice.totalAmount,
    extraDiscountAmount: invoice.additionalDiscount,
    totalItemsDiscountAmount: getTotalItemsDiscount(invoice.items),
    invoiceLines: mapEtaInvoiceItems(invoice, codes),
    taxTotals: mappedTaxTotals(invoice.items),
  };
}

function getMappedEtaCreditOrDebit(
  invoice: TaxInvoice,
  client: Client,
  organization: Organization,
  organizationTax: OrganizationTax,
  branch: OrganizationBranch,
  codes: Code[],
): AddEtaInvoice {
  // Setup organization address
  const issuer: Issuer = {
    id: organizationTax.taxIdNo,
    name: organization.name,
    type: IssuerType.BUSINESS, // IssuerType
    address: {
      branchID: branch.branchCode,
      country: branch.country,
      governate: branch.governorate,
      regionCity: branch.city,
      street: branch.street,
      buildingNumber: branch.buildingNumber || '0',
    },
  };

  // Setup client address
  const receiver = {
    id: client.identificationId,
    name: client.name,
    type: client.type,
    address: {
      country: client.address.country,
      governate: client.address.country,
      regionCity: client.address.country,
      street: client.address.street,
      buildingNumber: '0',
    },
  };

  return {
    issuer,
    receiver,
    references: invoice.uuidReferences,
    documentType: invoice.form,
    documentTypeVersion: '1.0',
    dateTimeIssued: moment(invoice.issuedAt).toISOString(),
    taxpayerActivityCode: invoice.activityCode,
    internalID: invoice.invoiceNumber,
    totalSalesAmount: invoice.grossAmount,
    totalDiscountAmount: invoice.discount,
    netAmount: invoice.netAmount,
    totalAmount: invoice.totalAmount,
    extraDiscountAmount: invoice.additionalDiscount,
    totalItemsDiscountAmount: getTotalItemsDiscount(invoice.items),
    invoiceLines: mapEtaInvoiceItems(invoice, codes),
    taxTotals: mappedTaxTotals(invoice.items),
  };
}

function getMappedEtaExportInvoice(
  invoice: TaxInvoice,
  client: Client,
  organization: Organization,
  organizationTax: OrganizationTax,
  branch: OrganizationBranch,
  codes: Code[],
): AddEtaInvoice {
  // Setup organization address
  const issuer: Issuer = {
    id: organizationTax.taxIdNo,
    name: organization.name,
    type: IssuerType.BUSINESS, // IssuerType
    address: {
      branchID: branch.branchCode,
      country: branch.country,
      governate: branch.governorate,
      regionCity: branch.city,
      street: branch.street,
      buildingNumber: branch.buildingNumber || '0',
    },
  };

  // Setup client address
  const receiver = {
    id: client.identificationId,
    name: client.name,
    type: client.type,
    address: {
      country: client.address.country,
      governate: client.address.country,
      regionCity: client.address.country,
      street: client.address.street,
      buildingNumber: '0',
    },
  };

  return {
    issuer,
    receiver,
    documentType: invoice.form,
    documentTypeVersion: '1.0',
    dateTimeIssued: moment(invoice.issuedAt).toISOString(),
    taxpayerActivityCode: invoice.activityCode,
    internalID: invoice.invoiceNumber,
    totalSalesAmount: invoice.grossAmount,
    totalDiscountAmount: invoice.discount,
    netAmount: invoice.netAmount,
    totalAmount: invoice.totalAmount,
    extraDiscountAmount: invoice.additionalDiscount,
    totalItemsDiscountAmount: getTotalItemsDiscount(invoice.items),
    invoiceLines: mapEtaExportInvoiceItems(invoice, codes),
    taxTotals: mappedTaxTotals(invoice.items),
    serviceDeliveryDate: moment(invoice?.deliveryAt).format('yyyy-MM-dd'),
  };
}

function getMappedEtaExportCreditOrDebitInvoice(
  invoice: TaxInvoice,
  client: Client,
  organization: Organization,
  organizationTax: OrganizationTax,
  branch: OrganizationBranch,
  codes: Code[],
): AddEtaInvoice {
  // Setup organization address
  const issuer: Issuer = {
    id: organizationTax.taxIdNo,
    name: organization.name,
    type: IssuerType.BUSINESS, // IssuerType
    address: {
      branchID: branch.branchCode,
      country: branch.country,
      governate: branch.governorate,
      regionCity: branch.city,
      street: branch.street,
      buildingNumber: branch.buildingNumber,
    },
  };

  // Setup client address
  const receiver = {
    id: client.identificationId,
    name: client.name,
    type: client.type,
    address: {
      country: client.address.country,
      governate: client.address.country,
      regionCity: client.address.country,
      street: client.address.street,
      buildingNumber: '0',
    },
  };

  return {
    issuer,
    receiver,
    references: invoice.uuidReferences,
    documentType: invoice.form,
    documentTypeVersion: '1.0',
    dateTimeIssued: moment(invoice.issuedAt).toISOString(),
    taxpayerActivityCode: invoice.activityCode,
    internalID: invoice.invoiceNumber,
    totalSalesAmount: invoice.grossAmount,
    totalDiscountAmount: invoice.discount,
    netAmount: invoice.netAmount,
    totalAmount: invoice.totalAmount,
    extraDiscountAmount: invoice.additionalDiscount,
    totalItemsDiscountAmount: getTotalItemsDiscount(invoice.items),
    invoiceLines: mapEtaExportInvoiceItems(invoice, codes),
    taxTotals: mappedTaxTotals(invoice.items),
    serviceDeliveryDate: moment(invoice?.deliveryAt).format('yyyy-MM-dd'),
  };
}

export function mapInvoiceToEtaInvoice(
  invoice: TaxInvoice,
  client: Client,
  organization: Organization,
  organizationTax: OrganizationTax,
  branch: OrganizationBranch,
  codes: Code[],
): AddEtaInvoice {
  switch (invoice.form) {
    case InvoiceForm.INVOICE:
      return getMappedEtaInvoice(invoice, client, organization, organizationTax, branch, codes);
    case InvoiceForm.CREDIT || InvoiceForm.DEBIT:
      return getMappedEtaCreditOrDebit(invoice, client, organization, organizationTax, branch, codes);
    case InvoiceForm.EXPORT_INVOICE:
      return getMappedEtaExportInvoice(invoice, client, organization, organizationTax, branch, codes);
    case InvoiceForm.EXPORT_CREDIT || InvoiceForm.EXPORT_DEBIT:
      return getMappedEtaExportCreditOrDebitInvoice(invoice, client, organization, organizationTax, branch, codes);
    default:
      throw new Error('Invoice type not supported');
  }
}

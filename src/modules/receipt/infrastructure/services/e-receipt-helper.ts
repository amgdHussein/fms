import * as crypto from 'crypto';
import { ETA_TAX_SUB_TYPES_WITH_TYPE, TAXABLE_FEES_LIST } from '../../../../core/providers';
import {
  EReceiptCredentials,
  EtaPaymentMethod,
  EtaReceipt,
  EtaReceiptItemData,
  EtaReceiptTaxableItem,
} from '../../../../core/providers/eta/temp-entity/receipt.entity';
import { roundToTwo } from '../../../../core/utils/math.utils';
import { Code } from '../../../code/domain';
import { Receipt } from '../../domain';
import { ItemTax, ReceiptItem, ReceiptType } from '../../domain/entities/receipt.entity';

import * as moment from 'moment-timezone';
import { Branch } from '../../../organization/domain';

export function getEReceiptMappedTaxTotals(invoiceLines: ReceiptItem[]): { taxType: string; amount: number }[] {
  const filteredTaxes = new Map<string, number>();

  invoiceLines.forEach(line => {
    line.taxes?.forEach(tax => {
      const existingAmount = filteredTaxes.get(tax.taxType) || 0;
      const updatedAmount = roundToTwo(existingAmount + tax.value);
      filteredTaxes.set(tax.taxType, updatedAmount);
    });
  });

  const arrTaxes: { taxType: string; amount: number }[] = Array.from(filteredTaxes, ([taxType, amount]) => ({
    taxType,
    amount,
  }));

  return arrTaxes;
}

export function getEReceiptTotalItemsDiscountAmount(invoiceLines: ReceiptItem[]): number {
  let total = 0;
  invoiceLines.forEach(line => {
    total += line.taxDiscount.value ?? 0;
  });

  return roundToTwo(total);
}

function getTaxType(subType: string): 'fixed' | 'percentage' {
  return ETA_TAX_SUB_TYPES_WITH_TYPE.find(tax => tax.Code === subType)?.type === 'rate' ? 'percentage' : 'fixed';
}

function getItemTaxableFees(item: ReceiptItem): number {
  let totalTaxableFees = 0;

  item.taxes.forEach((tax: ItemTax) => {
    if (TAXABLE_FEES_LIST.includes(tax.taxType)) {
      totalTaxableFees += tax.value;
    }
  });

  return roundToTwo(totalTaxableFees);
}

function getTaxRate(
  tax: ItemTax,
  netAmount: number,
  profitOrLoss: number,
  totalTaxableFees: number,
  taxTypeT3Amount: number,
  taxTypeT2Amount: number,
  itemsDiscount: number,
): number {
  let rate = 0;

  switch (tax.taxType) {
    case 'T2':
      const t2Base = netAmount + totalTaxableFees + profitOrLoss;

      rate = roundToTwo((tax.value * 100) / t2Base);
      break;
    case 'T1':
      const t1Base = taxTypeT2Amount + netAmount + totalTaxableFees + profitOrLoss + taxTypeT3Amount;

      rate = roundToTwo((tax.value * 100) / t1Base);
      break;
    case 'T4':
      const t4Base = netAmount - itemsDiscount;

      rate = roundToTwo((tax.value * 100) / t4Base);
      break;

    default:
      rate = getTaxType(tax.subType) === 'percentage' ? roundToTwo((tax.value * 100) / netAmount) : 0;
      break;
  }

  return rate;
}

function setTaxableItems(item: ReceiptItem): EtaReceiptTaxableItem[] {
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

export function getEReceiptMappedInvoiceLines(invoice: Receipt, codes: Code[]): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredArray: any[] = [];

  invoice.items.forEach(line => {
    let discount = null;
    // if (line.discount?.rate || line.discount?.amount) {
    //   discount = {
    //     rate: line.discount.rate,
    //     amount: line.discount.amount,
    //   };
    // }

    //console.log('line', line);

    const codeUsed = codes.find(code => code.id === line.codeId);

    const mappedLine: EtaReceiptItemData = {
      internalCode: line.id,
      description: line.description ?? 'description',
      itemType: codeUsed.authorityCodeType, //line.lineData?.taxableData?.codeDetails?.codeType,
      itemCode: codeUsed.code,
      unitType: line.unitType,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      netSale: line.netAmount,
      totalSale: line.grossAmount,
      total: line.totalAmount,

      commercialDiscountData: [
        {
          amount: line.discount?.value ?? 0,
          description: 'discount',
          rate: line.discount?.value ? roundToTwo((line.discount?.value * 100) / line.grossAmount) : 0,
        },
      ],

      itemDiscountData: [
        {
          amount: line.taxDiscount?.value ?? 0,
          description: 'discount',
          // rate: 0,
        },
      ],
      valueDifference: line.profitOrLoss ?? 0,

      taxableItems: setTaxableItems(line),
    };

    filteredArray.push(mappedLine);
  });

  return filteredArray;
}

function serializeAndNormalize(documentStructure: any): string {
  // Check if the structure is a simple value type
  if (typeof documentStructure !== 'object' || documentStructure === null) {
    return `"${documentStructure}"`;
  }

  let serializedString = '';

  // Iterate over all properties of the structure
  for (const key in documentStructure) {
    if (documentStructure.hasOwnProperty(key)) {
      const element = documentStructure[key];

      if (Array.isArray(element)) {
        // Handle array type
        serializedString += `"${key.toUpperCase()}"`;
        for (const arrayElement of element) {
          serializedString += `"${key.toUpperCase()}"`;
          serializedString += serializeAndNormalize(arrayElement);
        }
      } else {
        // Handle non-array types
        serializedString += `"${key.toUpperCase()}"`;
        serializedString += serializeAndNormalize(element);
      }
    }
  }

  return serializedString;
}

/**
 * Generate a UUID for the receipt based on its content.
 * @param receiptObject The receipt object to process.
 * @returns The generated receipt UUID.
 */
function generateReceiptUUID(receiptObject: any): string {
  // Step 1: Ensure receiptUUID is empty
  receiptObject.header.uuid = '';

  // Step 2: Serialize and normalize the receipt object
  const normalizedString = serializeAndNormalize(receiptObject);

  // Step 3: Hash the normalized string using SHA256
  const hash = crypto.createHash('sha256').update(normalizedString).digest();

  // Step 4: Convert the hash to a hexadecimal string
  const receiptUUID = hash.toString('hex');

  return receiptUUID;
}

export function convertMillisToUTC(time: number): string {
  const isoString = moment(time).utc().toISOString();

  // Remove the last 4 characters (including the dot before milliseconds)
  return isoString.slice(0, -5) + 'Z';
}

export function getMappedEtaReceipt(receipt: Receipt, codes: Code[], branch: Branch, credentials: EReceiptCredentials): EtaReceipt {
  // map invoice to eta invoice
  const mappedEReceipt: EtaReceipt = {
    header: {
      dateTimeIssued: convertMillisToUTC(receipt.issuedAt),
      receiptNumber: receipt.receiptNumber,
      uuid: '',
      previousUUID: '',
      // referenceOldUUID: '',
      currency: receipt.currency.code,
      exchangeRate: receipt.currency.code !== 'EGP' ? receipt.currency.rate : null,
    },
    documentType: {
      receiptType: receipt.type,
      typeVersion: '1.2',
    },
    seller: {
      rin: receipt.issuer.taxId,
      companyTradeName: receipt.issuer.name,
      branchCode: branch.branchCode,
      branchAddress: {
        country: branch.country,
        street: branch.street,
        regionCity: branch.city.length ? branch.city : branch.country,
        governate: branch.governorate.length ? branch.governorate : branch.country,
        buildingNumber: branch.buildingNumber.length ? branch.buildingNumber : branch.country,
      },
      deviceSerialNumber: credentials.pos.serialNo, // 'TaxEgypt2024', //TODO: GET DEVICE SERIAL FROM ORGANIZATION
      syndicateLicenseNumber: 'C', // Optional. In case it is a person, then it is a number of minimum 10 characters, if the number is less than 10 characters, leading zeros should be added, example: “0001234567”. In case it is a company, the value should be “C”
      activityCode: receipt.activityCode,
    },
    buyer: {
      type: receipt.receiver.type, // TODO: Change to dynamic IssuerTypeAsString
      id: receipt.receiver.taxId,
      name: receipt.receiver.name,
    },
    itemData: getEReceiptMappedInvoiceLines(receipt, codes),
    totalSales: receipt.grossAmount,
    totalCommercialDiscount: roundToTwo(receipt.items.map(item => item.discount?.value ?? 0).reduce((a, b) => a + b, 0)),
    totalItemsDiscount: getEReceiptTotalItemsDiscountAmount(receipt.items),

    extraReceiptDiscountData: [
      {
        amount: receipt.additionalDiscount ?? 0,
        description: 'additionalDiscount',
      },
    ],
    netAmount: receipt.netAmount,
    totalAmount: receipt.totalAmount,
    taxTotals: getEReceiptMappedTaxTotals(receipt.items),
    paymentMethod: EtaPaymentMethod.CASH,
  };

  if (receipt.type === ReceiptType.RETURN_RECEIPT) {
    mappedEReceipt.header.referenceUUID = receipt.uuidReference;
  }

  const uuid = generateReceiptUUID(mappedEReceipt);

  mappedEReceipt.header.uuid = uuid;
  return mappedEReceipt;
}

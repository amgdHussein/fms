export interface CodeUsageQuery {
  result: CodeUsage[];
  metadata: MetaData; // Information about the results retrieved or results matching the query
}

export interface MetaData {
  totalPages: number; // Total count of pages based on the supplied (or default) page size
  totalCount: number; // Total count of matching objects
}

export interface CodeUsage {
  codeUsageRequestId: number; // Internal ID of the request submitted
  codeTypeName: string; // Catalog name that the code was registered in
  codeID: number; // Internal code ID in the solution
  itemCode: string; // Code that was registered by the taxpayer
  codeName: string; // Code name in English
  codeNameAr: string; // Code name in Arabic that was provided by the taxpayer
  description: string; // Code description that was provided by the taxpayer
  descriptionAr: string; // Code description in Arabic that was provided by the taxpayer

  parentCodeID: number; // Internal code ID of the parent in the solution
  parentCodeLookupValue: string; // the parent code that was provided by the taxpayer, Level4 code
  parentItemCode: string; // Parent item code
  parentLevelName: string; // Refer to the parent level name from the catalog
  parentCodeName: string; // Refer to parent code name in English
  parentCodeNameAr: string; // Refer to parent code name in Arabic
  parentDescription: string; // Parent Code description in English
  parentDescriptionAr: string; // Parent Code description in Arabic
  parentCodeNamePrimaryLang: string; // Refer to parent code name in English
  parentCodeNameSecondaryLang: string; // Refer to parent code name in Arabic
  parentActive: boolean; // refer to the parent of the code status in the system

  levelName: string; // Refer to the level name of the code
  requestCreationDateTimeUtc: number; // Refer to the request creation date on eInvoice system in UTC
  codeCreationDateTimeUtc: number; // Refer to the code creation date on eInvoice system in UTC
  activeFrom: string; // Refer to the code start validity date in UTC
  activeTo: string; // Refer to the code end of validity date in UTC
  active: boolean; // Refer to the code status in the system
  status: EtaCodeStatus; // Refer to the request status if approved or rejected
  ownerTaxpayer: Taxpayer; // Refer to the taxpayer who is the owner of the code
  requesterTaxpayer: Taxpayer; // Refer to the taxpayer who initiated the code usage request
  codeCategorization: { [key: string]: CodeCategorizationLevel }[]; // Refer to the code levels/Category

  codeLookupValue: string; // Refer to the code that was provided by the taxpayer
  codeNamePrimaryLang: string; // Code name in english that was provided by the taxpayer
  codeNameSecondaryLang: string; // Code name in Arabic that was provided by the taxpayer
  codeDescriptionPrimaryLang: string; // Code description in english that was provided by the taxpayer
  codeDescriptionSecondaryLang: string; // Code description in Arabic that was provided by the taxpayer
  descriptionPrimaryLang: string; // Code description in english that was provided by the taxpayer
  descriptionSecondaryLang: string; // Code description in Arabic that was provided by the taxpayer

  codeTypeID: number; // Refer to code type ID either GS1 or EGS
  codeTypeLevelID: number; // Refer to code type level ID
  codeTypeLevelNamePrimaryLang: string; // Refer to code level name in English
  codeTypeLevelNameSecondaryLang: string; // Refer to code level name in Arabic

  codeTypeNamePrimaryLang: 'EGS' | 'GS1'; // Refer to code type name in English
  codeTypeNameSecondaryLang: string; // Refer to code type name in Arabic
  linkedCode: string; // refer to the linked code
  requestReason: string; // Textual reason why the code is requested
  parentCode: string; // The parent of the code, represents level 4 GPC code // public attributes: any, // public statusReason?: any, //! don't know
}

export enum EtaCodeType {
  EGS = 'EGS',
  GS1 = 'GS1',
}

export enum EtaCodeRequestType {
  NEW = 'New',
  REUSAGE = 'Reusage',
}

export enum EtaCodeStatus {
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface Taxpayer {
  rin: string; // taxpayer ID who own the code
  name: string; // Refer to the taxpayer name in English
  nameAr: string; // Refer to the taxpayer name in Arabic
}

export interface CodeCategorizationLevel {
  id: number;
  lookupValue: string;
  name: string; // Refer to code type level name in English
  nameAr: string; // Refer to code type level name in Arabic
}

export class EgsCodeUsage {
  codeType: EtaCodeType;
  parentCode: string;
  itemCode: string;
  codeName: string;
  codeNameAr: string;
  activeFrom: string;
  activeTo?: string;
  description?: string;
  descriptionAr?: string;
  requestReason?: string;
  linkedCode: string;
}

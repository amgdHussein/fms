export interface Issuer {
  id: string;
  type: IssuerType;
  name: string;
  address: IssuerAddress;
}

export interface IssuerAddress {
  branchID?: string; // The branch ID of the issuer

  buildingNumber: string; // The building number of the issuer
  street: string; // The street of the issuer
  governate: string; // The governate of the issuer
  regionCity: string; // The region/city of the issuer
  country: string; // The country of the issuer

  postalCode?: string;
  floor?: string;
  room?: string;
  landmark?: string;
  additionalInformation?: string;
}

/**
 * B => Business in Egypt
 * P => Natural Person
 * F => Foreigner
 */
export type IssuerType = 'B' | 'P' | 'F' | 0 | 1 | 2;

export enum EtaSignatureType {
  ISSUER = 'I',
  SERVICE_PROVIDER = 'S',
}

export class EtaSignature {
  signatureType: EtaSignatureType;
  value: string;
}

export interface EtaCredentials {
  clientId: string;
  clientSecret: string;
}

export interface EtaAccessToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

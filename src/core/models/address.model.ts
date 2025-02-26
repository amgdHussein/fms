export interface Address {
  street: string; // Primary street address
  city: string; // City name
  country: string; // Country name
  governorate?: string; // State or province or governorate name
  postalCode?: string; // Postal or ZIP code
}

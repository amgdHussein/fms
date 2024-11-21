import { QueryCodes } from '../providers/eta/entities';

export function buildEtaQuery(obj: Partial<QueryCodes>): string {
  return Object.entries(obj)
    .filter(([, value]) => value && value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value.toString())}`)
    .join('&');
}

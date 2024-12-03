import { CLINIKO_CONFIG } from '../../../src/config/cliniko';

export function buildClinikoUrl(path: string, queryParams?: Record<string, string>): string {
  const cleanPath = path.replace('/api/cliniko-proxy', '');
  const queryString = queryParams 
    ? '?' + new URLSearchParams(queryParams).toString() 
    : '';
    
  return `${CLINIKO_CONFIG.API_BASE_URL}${cleanPath}${queryString}`;
}
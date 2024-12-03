import fetch from 'node-fetch';
import { CLINIKO_CONFIG } from '../../../src/config/cliniko/constants';
import { buildClinikoHeaders } from '../utils/cliniko-headers';
import { logRequest, logResponse, logError } from '../utils/logger';

export async function validateClinikoApiKey(apiKey: string): Promise<boolean> {
  const url = `${CLINIKO_CONFIG.API_BASE_URL}/practitioners?per_page=1`;
  const headers = buildClinikoHeaders(apiKey);
  
  logRequest('Validating API key', url, headers);
  
  try {
    const response = await fetch(url, { 
      method: 'GET',
      headers 
    });
    
    const responseText = await response.text();
    logResponse('API Key Validation', response.status, responseText);

    if (!response.ok) {
      if (response.status === 401) {
        logError('API Key Validation', new Error('Invalid API key'));
        return false;
      }
      throw new Error(`Unexpected response: ${response.status}`);
    }

    try {
      JSON.parse(responseText);
      return true;
    } catch (e) {
      logError('Invalid JSON response during API key validation', e);
      return false;
    }
  } catch (error) {
    logError('API Key Validation Failed', error);
    return false;
  }
}
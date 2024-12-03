import fetch from 'node-fetch';
import { buildClinikoHeaders } from '../utils/cliniko-headers';
import { buildClinikoUrl } from '../utils/url-builder';
import { validateClinikoApiKey } from './cliniko-validator';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { logRequest, logResponse, logError } from '../utils/logger';

interface ClinikoRequest {
  apiKey: string;
  path: string;
  queryParams: Record<string, string>;
}

export async function handleClinikoRequest(request: ClinikoRequest) {
  const isValid = await validateClinikoApiKey(request.apiKey);
  if (!isValid) {
    return createErrorResponse(401, 'Invalid API key or unauthorized access');
  }

  const url = buildClinikoUrl(request.path, request.queryParams);
  const headers = buildClinikoHeaders(request.apiKey);

  logRequest('Making request to Cliniko', url, headers);

  try {
    const response = await fetch(url, { headers });
    const responseText = await response.text();
    
    logResponse('Cliniko API Response', response.status, responseText);

    if (!response.ok) {
      return createErrorResponse(response.status, responseText);
    }

    try {
      const data = JSON.parse(responseText);
      return createSuccessResponse(data);
    } catch (e) {
      logError('Invalid JSON response from Cliniko API', e);
      return createErrorResponse(502, 'Invalid response from Cliniko API');
    }
  } catch (error) {
    logError('Request failed', error);
    return createErrorResponse(500, 'Failed to connect to Cliniko API');
  }
}
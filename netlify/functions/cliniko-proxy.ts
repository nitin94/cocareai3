import { Handler } from '@netlify/functions';
import { handleClinikoRequest } from './services/cliniko-service';
import { handleOptionsRequest } from './utils/cors';
import { validateRequest } from './utils/validation';
import { createErrorResponse } from './utils/response';
import { logError } from './utils/logger';

export const handler: Handler = async (event) => {
  console.log('Received request:', {
    method: event.httpMethod,
    path: event.path,
    headers: event.headers,
    queryStringParameters: event.queryStringParameters
  });

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return handleOptionsRequest();
  }

  try {
    const validatedRequest = validateRequest(event);
    return await handleClinikoRequest(validatedRequest);
  } catch (error) {
    logError('Proxy Error', error);
    const message = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';
    return createErrorResponse(500, message);
  }
};
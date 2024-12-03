import { HandlerEvent } from '@netlify/functions';
import { validateClinikoHeaders } from './cliniko-headers';

interface ValidatedRequest {
  apiKey: string;
  path: string;
  queryParams: Record<string, string>;
}

export function validateRequest(event: HandlerEvent): ValidatedRequest {
  // Validate HTTP method
  if (!['GET', 'OPTIONS'].includes(event.httpMethod)) {
    throw new Error(`Method ${event.httpMethod} not allowed`);
  }

  // Validate path
  if (!event.path || !event.path.startsWith('/api/cliniko-proxy')) {
    throw new Error('Invalid path');
  }

  // Extract and validate API key
  const apiKey = event.headers['x-cliniko-api-key'];
  if (!apiKey) {
    throw new Error('API key is required');
  }

  // Validate API key format (should match Cliniko's format)
  if (!/^[A-Za-z0-9+/=_-]{20,}$/.test(apiKey)) {
    throw new Error('Invalid API key format');
  }

  // Validate headers that will be sent to Cliniko
  const headers = {
    'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
    'User-Agent': event.headers['user-agent'] || '',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  validateClinikoHeaders(headers);

  return {
    apiKey,
    path: event.path.replace('/api/cliniko-proxy', ''),
    queryParams: event.queryStringParameters || {}
  };
}
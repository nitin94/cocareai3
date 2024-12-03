import { ClinikoEndpoint } from './endpoints';
import { ClinikoApiError, handleApiError } from '../utils/errorHandler';
import { logger } from '../utils/logger';
import { getRequestHeaders } from '../../../config/cliniko';

export class ClinikoApiClient {
  private readonly baseUrl: string;

  constructor(private readonly apiKey: string) {
    if (!apiKey) {
      throw new ClinikoApiError('API key is required', 401);
    }
    this.baseUrl = import.meta.env.PROD 
      ? window.location.origin 
      : 'http://localhost:8888';
  }

  async request<T>(endpoint: ClinikoEndpoint, queryParams: Record<string, string> = {}): Promise<T> {
    const url = new URL('/api/cliniko-proxy', this.baseUrl);
    
    // Add endpoint to URL path
    url.pathname = url.pathname + endpoint;
    
    // Add query parameters
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    logger.debug('Making request to:', url.toString());

    try {
      const response = await fetch(url.toString(), {
        headers: getRequestHeaders(this.apiKey),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('API Error Response:', errorText);
        throw new ClinikoApiError(
          `HTTP error ${response.status}: ${errorText}`,
          response.status
        );
      }

      const data = await response.json();
      logger.debug('Response received:', data);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}
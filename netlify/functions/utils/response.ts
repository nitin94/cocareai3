import { getCorsHeaders } from './headers';

export function createSuccessResponse(data: unknown) {
  return {
    statusCode: 200,
    headers: {
      ...getCorsHeaders(),
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
}

export function createErrorResponse(statusCode: number, message: string) {
  return {
    statusCode,
    headers: {
      ...getCorsHeaders(),
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      error: message
    })
  };
}
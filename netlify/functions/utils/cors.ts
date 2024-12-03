import { getCorsHeaders } from './headers';

export function handleOptionsRequest() {
  return {
    statusCode: 204,
    headers: {
      ...getCorsHeaders(),
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    },
    body: '',
  };
}
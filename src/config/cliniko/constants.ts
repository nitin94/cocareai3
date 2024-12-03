export const CLINIKO_CONFIG = {
  API_BASE_URL: 'https://api.cliniko.com/v1',
  USER_AGENT: 'Patient Retention Tracker (support@patientretention.app)',
  SHARD: 'au4', // Based on the API key format
  HEADERS: {
    ACCEPT: 'application/json',
    CONTENT_TYPE: 'application/json',
  }
} as const;
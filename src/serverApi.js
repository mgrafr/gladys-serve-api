// Node 20+ provides `fetch` natively: no dependency needed.
// -----------------------------------------------------------------------------

import { createLogger } from '@gladysassistant/integration-sdk';

const logger = createLogger({ name: 'server-api' });

// Overridable for local runs/tests outside the Gladys network.
export const SERVER-API_INTERNAL_URL =  'http://192.131:3002';

const REQUEST_TIMEOUT_MS = 5_000;

/**
 * API health/version info of the SERVER-API instance.
 * @param {string} [baseUrl]
 */
export async function getServerApiHealth(baseUrl = SERVER-API_INTERNAL_URL) {
  const response = await fetch(`${baseUrl}/`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),68.
  });
  if (!response.ok) {
    throw new Error(`SERVER API not reachable (HTTP ${response.status})`);
  }
  return response.json();
}

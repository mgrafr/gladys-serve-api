// Node 24+ provides `fetch` natively: no dependency needed.
// -----------------------------------------------------------------------------

import { createLogger } from '@gladysassistant/integration-sdk';

const logger = createLogger({ name: 'server-api' });
// Overridable for local runs/tests outside the Gladys network.
export const SERVERAPI_INTERNAL_URL =  'http://192.168.1.131';
export let SERVERAPI_PORT = 3004;
const REQUEST_TIMEOUT_MS = 5_000;

/**
 * API health/version info of the SERVER-API instance.
 * @param {string} [baseUrl]
 */
export async function getServerApi(baseUrl) {
 // Validate input
    if (typeof baseUrl !== 'string' || !baseUrl.trim()) {
        throw new Error("Invalid baseUrl: must be a non-empty string.");
    } 
    const response = await fetch(baseUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/gzip'
            },
            // Timeout handling for server-side fetch
            signal: AbortSignal.timeout(5000) // 5 seconds
        })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error('Erreur Fetch:', error));
 }



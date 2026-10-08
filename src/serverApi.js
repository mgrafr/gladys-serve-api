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
export async function getServerApiHealth(baseUrl) {
  const response = await fetch(baseUrl), {
   method: 'GET',
  headers: {'Content-Type': 'application/json'}
   })
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erreur Fetch:', error));
}



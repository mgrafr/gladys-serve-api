// -----------------------------------------------------------------------------
// Entry point of the Gladys external integration.
//
// Role of this file: wire the SDK to the device catalog (src/devices/). It holds
// NO hardware logic: all the control "work" lives in the device modules. This
// file only:
//   1. instantiates the SDK (connection, auth, reconnection: handled for you);
//   2. registers the event handlers BEFORE connect();
//   3. connects and publishes the discovered devices.
//
// Environment variables provided by the Gladys supervisor to the container:
//   - GLADYS_HOST_API_URL         (host API URL)
//   - GLADYS_INTEGRATION_TOKEN    (integration-scoped JWT)
//   - GLADYS_INTEGRATION_SELECTOR (integration identifier)
// The SDK reads them automatically: `new GladysIntegration()` is enough.
// -----------------------------------------------------------------------------

import { GladysIntegration, logger } from '@gladysassistant/integration-sdk';
import { normalizeConfig } from './src/config.js';
import { getServerApiHealth, SERVERAPI_INTERNAL_URL } from './src/serverApi.js';

const gladys = new GladysIntegration();

// Current configuration (hot-reloaded via onConfigUpdated).
let config = normalizeConfig();

// Cleanup functions for the "push" subscriptions (e.g. the motion sensor).
let pushCleanups = [];

/*async function callApi() {
  try {
    const response = await fetch('http://192.168.1.131:3002/');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    };
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    throw error;
  };
};

gladys.onAction("test_server", () => callApi());
*/

/ The base URL that last answered: the private DNS alias (http://192.168.1.131:3002)
// or, as a fallback, the admin port published on the host.
let npmBaseUrl = SERVERAPI_INTERNAL_URL;
// --- Manifest action: "Check server-api" button ---------------------
gladys.onAction('test_server', async () => {
  logger.info(`Action test_server -> live request to the SERVER API (${npmBaseUrl})`);
  const health = await getServerApiHealth(npmBaseUrl);
  return {
    en: `Nginx Proxy Manager v${hello} is up and running.`,
    fr: `Nginx Proxy Manager v${hello} est démarré et fonctionne.`,
  };
});




// --- Graceful shutdown -------------------------------------------------------
// The SDK stops the push subscriptions, disconnects cleanly and exits with
// code 0 when the supervisor stops the container (SIGTERM/SIGINT).
gladys.handleShutdown((signal) => {
  logger.info(`Received ${signal} -> graceful shutdown`);
  stopPushSubscriptions();
});

// --- Startup -----------------------------------------------------------------
logger.info('Starting the template integration...');
gladys.connect().catch((err) => {
  logger.error('Initial connection failed', err);
  process.exit(1);
});

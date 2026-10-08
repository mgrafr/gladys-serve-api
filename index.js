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
import { getServerApi, downloadGzip, SERVERAPI_INTERNAL_URL, SERVERAPI_PORT } from './src/serverApi.js';
// import { SceneBridge } from './src/scenes.js';
const gladys = new GladysIntegration();

// Current configuration (hot-reloaded via onConfigUpdated).
let config = normalizeConfig();
let port = SERVERAPI_PORT.toString();
// Cleanup functions for the "push" subscriptions (e.g. the motion sensor).
let pushCleanups = [];

//const CONTAINER_NAME = 'server-api';

// --- Manifest action: "Check server-api" button ---------------------
gladys.onAction('test_server', async () => {
// The base URL that last answered: the private DNS alias (http://192.168.1.131:3004)
// or, as a fallback, the admin port published on the host.
let serveBaseUrl = SERVERAPI_INTERNAL_URL+":"+port;  
  logger.info(`Action test_server -> live request to the SERVER API (${serveBaseUrl})`);
  const health = await getServerApi(serveBaseUrl);
  // const status = health?.statusCode;
  return {
    en: `Server Api ${health} is up and running.`,
    fr: `Server Api ${health} est démarré et fonctionne.`,
  };
});

// --- Manifest action: "backup bd splite" button ------------------
gladys.onAction('backup_db', async () => {
 let url = SERVERAPI_INTERNAL_URL+":"+port+"/backup";  
  logger.info(`Action backup databases -> live request to the SERVER API (${url})`);
    const filePath = await downloadGzip(url);
    gladys.event.emit('gzip.downloaded', { filePath });
    return {
    en: `Database backup completed.`,
    fr: `Sauvegarde des bases de données effectuée.`,
  };
});
/*
gladys.onAction('backup_db', async () => {
  let serveBaseUrl = SERVERAPI_INTERNAL_URL+":"+port+"/backup";  
  logger.info(`Action backup databases -> live request to the SERVER API (${serveBaseUrl})`);
  const health = await getServerApi(serveBaseUrl);                             
  return {
    en: `Database backup completed.`,
    fr: `Sauvegarde des bases de données effectuée.`,
  };
});
*/
// --- Manifest action: "add script" button ---------------------
gladys.onAction('add_script', async () => {
  let serveBaseUrl = SERVERAPI_INTERNAL_URL+":"+port+"/script";  
  logger.info(`Action add script -> live request to the SERVER API (${serveBaseUrl})`);
  const health = await getServerApi(serveBaseUrl); 
  logger.info(`Action add script response-> live request to the SERVER API (${health})`);
  return {
    en: `Add script completed.`,
    fr: `Ajout du script effectué.`
  };
});
// --- Manifest action: "STOP server api" button ---------------------
gladys.onAction('stop_server', async () => {
  let serveBaseUrl = SERVERAPI_INTERNAL_URL+":"+port+"/stop";  
  logger.info(`Action STOP server -> live request to the SERVER API (${serveBaseUrl})`);
  const health = await getServerApi(serveBaseUrl);                             
  return {
    en: `Stop server completed.`,
    fr: `Arrêt du serveur effectué.`,
  };
});
// const scenes = new SceneBridge({ gladys : () => config });

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

// Node 24+ provides `fetch` natively: no dependency needed.
// -----------------------------------------------------------------------------

import { createLogger } from '@gladysassistant/integration-sdk';

const logger = createLogger({ name: 'server-api' });
// Overridable for local runs/tests outside the Gladys network.
export const SERVERAPI_INTERNAL_URL =  'http://192.168.1.131';
export let SERVERAPI_PORT = 3004;
const REQUEST_TIMEOUT_MS = 5_000;

/**
/*
my-gladys-pdf-integration/
├── index.js
├── package.json
└── src/
    └── gzip/
        ├── serveApi.js
        └── downloadPdf.js
 * @param {string} [baseUrl]
 */
/* export async function getServerApi(baseUrl) {
    // Validation des entrées
    if (typeof baseUrl !== 'string' || !baseUrl.trim()) {
        throw new Error("Invalid baseUrl: must be a non-empty string.");
    } 
    logger.info(`function getServerApi -> live request to the SERVER API (${baseUrl})`);
    try {
        const response = await fetch(baseUrl, {
            method: "GET",
            headers: {
                "Accept": "application/gzip"
            },
            signal: AbortSignal.timeout(5000) // Timeout de 5 secondes
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // CORRECT : On récupère le corps de la réponse sous forme de flux (Stream)
        // ou de ArrayBuffer. response.body contient les octets Gzip bruts.
        // return response.body;

        const buffer = await res.arrayBuffer();
        fs.writeFileSync('/tmp/document.pdf', Buffer.from(buffer));
        console.log('PDF téléchargé avec succès');
}

    } catch (error) {
        logger.error('Erreur Fetch:', error);
        throw error; // On propage l'erreur pour la gérer plus haut
    }
}
*/
export async function downloadGzip(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Erreur HTTP ${res.status}`);
  }

  const buffer = await res.arrayBuffer();
  const filePath = path.join('/tmp', 'datas.tar.gz');
  fs.writeFileSync(filePath, Buffer.from(buffer));

  return filePath;
}



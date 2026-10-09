// Node 24+ provides `fetch` natively: no dependency needed.
// -----------------------------------------------------------------------------

import { createLogger } from '@gladysassistant/integration-sdk';

const logger = createLogger({ name: 'server-api' });
// Overridable for local runs/tests outside the Gladys network.
export const SERVERAPI_INTERNAL_URL =  'http://192.168.1.131';
export let SERVERAPI_PORT = 3004;
const REQUEST_TIMEOUT_MS = 5_000;
import path from 'path';
import fs from 'fs';
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
export async function getServerApi(baseUrl) {
    // Validation des entrées
    if (typeof baseUrl !== 'string' || !baseUrl.trim()) {
        throw new Error("Invalid baseUrl: must be a non-empty string.");
    } 
    logger.info(`function getServerApi -> live request to the SERVER API (${baseUrl})`);
      const response = await fetch(`${baseUrl}/`, {
   method: 'GET',
  headers: {'Content-Type': 'application/json'}
   })
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erreur Fetch:', error));
return response;
}


export async function downloadGzip(url) {
  const res = await fetch(url);
  logger.info(`download GZIP -> live request to the SERVER API (${res.status})`);
  if (!res.ok) {
    throw new Error(`Erreur HTTP ${res.status}`);
  }
// Read the response body as ArrayBuffer 
  const buffer = await res.arrayBuffer();
    
  /* let filePath = path.join('./backups/', 'datas.tar.gz');
  logger.info(`download GZIP ->  (${filePath})`);  
  fs.writeFileSync(filePath, Buffer.from(buffer));
  return filePath;
}

  

// Navigateur: Télécharger un ArrayBuffer comme fichier
function downloadArrayBuffer(buffer, filename) {
*/
    // Créer un Blob à partir de l'ArrayBuffer
    const blob = new Blob([buffer]);
let filename = 'datas.tar.gz'
    // Créer un lien de téléchargement temporaire
    const Url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = Url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Nettoyer
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}





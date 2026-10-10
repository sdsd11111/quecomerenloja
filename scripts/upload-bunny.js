const fs = require('fs');
const path = require('path');
const https = require('https');

const STORAGE_ZONE = 'mvps';
const API_KEY = '58296509-eefd-401e-b6c85809cb7b-b0ef-4aa0';
const HOST = 'storage.bunnycdn.com';

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const FOLDERS = ['home', 'desayunos', 'almuerzos', 'cenas', 'bares-noche'];

function uploadFile(localPath, remotePath) {
  return new Promise((resolve, reject) => {
    const fileData = fs.readFileSync(localPath);
    const options = {
      hostname: HOST,
      port: 443,
      path: `/${STORAGE_ZONE}/${remotePath}`,
      method: 'PUT',
      headers: {
        'AccessKey': API_KEY,
        'Content-Type': 'application/octet-stream',
        'Content-Length': fileData.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✓ Subido: ${remotePath} (${fileData.length} bytes)`);
          resolve(true);
        } else {
          console.error(`✗ Error subiendo ${remotePath}: ${res.statusCode} - ${body}`);
          reject(new Error(`Status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error(`✗ Error de conexión al subir ${remotePath}:`, err.message);
      reject(err);
    });

    req.write(fileData);
    req.end();
  });
}

async function main() {
  console.log('Iniciando subida de imágenes a BunnyCDN Storage...');
  let totalSubidas = 0;

  for (const folder of FOLDERS) {
    const localFolder = path.join(PUBLIC_DIR, folder);
    if (!fs.existsSync(localFolder)) {
      console.warn(`Carpeta no existe: ${localFolder}`);
      continue;
    }

    const files = fs.readdirSync(localFolder);
    for (const file of files) {
      if (file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.png')) {
        const localPath = path.join(localFolder, file);
        const remotePath = `quecomerenloja/${folder}/${file}`;
        try {
          await uploadFile(localPath, remotePath);
          totalSubidas++;
        } catch (err) {
          console.error(`Fallo al subir ${file}:`, err.message);
        }
      }
    }
  }

  console.log(`\n¡Completado! Total de imágenes subidas a BunnyCDN: ${totalSubidas}`);
}

main();

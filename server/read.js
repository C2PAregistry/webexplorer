const { createC2pa } = require('c2pa-node')
const { readFile } = require('node:fs/promises')

const c2pa = createC2pa();

(async () => {
    const buffer = await readFile('signed/bft.c2pa');
    const result = await c2pa.read({ buffer, mimeType: 'application/x-c2pa-manifest-store' });

    if (result) {
        const { active_manifest, manifests, validation_status } = result;
        console.log(JSON.stringify(manifests));
    } else {
        console.log('No claim found');
    }
})()

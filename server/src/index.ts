import { Asset, createC2pa, createTestSigner, ManifestBuilder } from 'c2pa-node';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

async function sign(asset: Asset, manifest: ManifestBuilder, fileOutputName: string) {
    const signer = await createTestSigner();
    const c2pa = createC2pa({
        signer,
    });
    const outputPath = resolve(`signed/${fileOutputName}`);

    await c2pa.sign({
        manifest,
        asset,
        options: {
            outputPath,
        },
    });
}

(async () => {
    let bytes = await readFile(resolve('manifests/albatross.json'))
    const albatrossManifest = JSON.parse(bytes.toString())
    const albatrossAsset = {
        path: resolve('files/albatross-paper.pdf'),
        mimeType: 'application/pdf'
    };
    let manifestBuilder = new ManifestBuilder(albatrossManifest)
    await sign(albatrossAsset, manifestBuilder, 'albatross.pdf')

    bytes = await readFile(resolve('manifests/bft-consensus.json'))
    const bftManifest = JSON.parse(bytes.toString())
    const bftAsset = {
        path: resolve('files/1807.04938v3.pdf'),
        mimeType: 'application/pdf'
    };
    manifestBuilder = new ManifestBuilder(bftManifest)
    await sign(bftAsset, manifestBuilder, 'bft.pdf')
})()

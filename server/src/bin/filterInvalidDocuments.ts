/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'dotenv/config';
import { validateDocument } from 'law-document';
import 'reflect-metadata';
import database from '../config/database';
import { initConnection } from '../integration/database/connection';
import { findOrImportDocument, loadIndexXml } from '../services/DocumentService';

void (async () => {
    // @ts-ignore
    database.logging = false;
    await initConnection();
    const lawEntries = await loadIndexXml();
    const unsupportedLaws = [];

    for (const lawEntry of lawEntries) {
        console.log('Processing:', lawEntry.identifier);

        try {
            const document = await findOrImportDocument(lawEntry.identifier);
            const slate = JSON.parse(document.content);

            try {
                if(validateDocument(slate)) {
                    console.log('Document is valid');
                }
            } catch (error) {
                console.error('Invalid', lawEntry.path, error);
                console.log('xml', document.originalXml);
                process.exit();
            }
        } catch (error: any) {
            if (error.message === 'Invalid law') {
                unsupportedLaws.push(lawEntry.path);
                console.log('Document is not supported');
                continue;
            }

            console.error('Error processing:', lawEntry.path, error);
            process.exit();
        }

    }

    console.log('💥💥💥 Done 💥💥💥');
})();
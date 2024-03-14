/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'dotenv/config';
import { validateDocument } from 'law-document';
import 'reflect-metadata';
import { Descendant } from 'slate';
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
        if (lawEntry.identifier !== '2023.66') {
            continue;
        }
        
        console.log('\nProcessing:', lawEntry.identifier);

        try {
            const document = await findOrImportDocument(lawEntry.identifier);
            const slate = JSON.parse(document.content) as Descendant[];

            try {
                if(validateDocument(slate)) {
                    console.log('Document is valid');
                }
            } catch (error: any) {
                console.error('Invalid xml', error.name);
                continue;
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
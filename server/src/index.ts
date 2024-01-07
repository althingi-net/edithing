/* eslint-disable @typescript-eslint/require-await */
import { exec } from 'child_process';
import { Logger } from '@hocuspocus/extension-logger';
import { Hocuspocus } from '@hocuspocus/server';
import 'dotenv/config';
import 'reflect-metadata';
import { Doc, applyUpdate, encodeStateAsUpdate } from 'yjs';
import app from './app';
import server from './config/server';
import { initConnection } from './integration/database/connection';
import { assignSlateToDoc } from './service/convertSlateToY';


const nonNestedMeta: any[] = [
    {
        type: 'document-meta',
        nr: '8',
        year: '2022',
        name: 'Lög um styrki til rekstraraðila veitingastaða sem hafa sætt  takmörkunum á opnunartíma',
        date: '2022-02-15',
        original: '2022 nr. 8 15. febrúar',
        ministerClause: '<a href="http://www.althingi.is//dba-bin/ferill.pl?ltg=152&amp;mnr=232"> <i> Ferill málsins á Alþingi. </i> </a> <a href="http://www.althingi.is/altext/152/s/0332.html"> <i> Frumvarp til laga. </i> </a> <br/> <br/> <small> <b> Tóku gildi 17. febrúar 2022. </b> </small> <br/> Ef í lögum þessum er getið um ráðherra eða ráðuneyti án þess að málefnasvið sé tilgreint sérstaklega eða til þess vísað, er átt við <b> fjármála- og efnahagsráðherra </b> eða <b> fjármála- og efnahagsráðuneyti </b> sem fer með lög þessi. Upplýsingar um málefnasvið ráðuneyta skv. forsetaúrskurði er að finna hér.',
        children: [
            {
                text: '',
            },
        ],
    },
    {
        type: 'list',
        listType: 'chapter',
        nrType: 'roman',
        children: [
            {
                type: 'list-item',
                listType: 'chapter',
                nr: '1',
                originNr: '1',
                nrType: 'roman',
                romanNr: 'I',
                title: true,
                name: true,
                children: [
                    {
                        type: 'list-item-text',
                        children: [
                            {
                                title: true,
                                text: 'I. kafli. ',
                            },
                            {
                                name: true,
                                text: 'Almenn ákvæði. ',
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

const collaborationServer = new Hocuspocus({
    port: 1234,
    extensions: [new Logger()],
  
    async onLoadDocument(data): Promise<Doc> {
        console.log('onLoadDocument', data.documentName, data.document);

        // Load the initial value in case the document is empty
        if (data.document.isEmpty('content')) {
            // const id = Number(data.documentName);
            // const billDocument = await Document.findOneOrFail({ where: { id } });
            // const slate: Descendant[] = importXml(billDocument.content);

            const newStateDoc = new Doc();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            assignSlateToDoc(nonNestedMeta, newStateDoc);
            const update = encodeStateAsUpdate(newStateDoc);
            console.log('update', update);
            applyUpdate(data.document, update);
        }
  
        return data.document;
    },

    async onStoreDocument(data) {
        console.log('onStoreDocument', data.documentName, data.document.toJSON());
        // Save to database. Example:
        // saveToDatabase(data.document, data.documentName);
    },
});

// Start the server
void (async () => {
    await initConnection();
    app.listen(server.port);
    collaborationServer.enableMessageLogging();
    await collaborationServer.listen();
    console.log(`🚀 API Server is running at ${server.host}`);
    console.log(`🚀 WS Server is running at ${1234}`);

    if (process.env.NODE_ENV !== 'production') {
        console.log('Generating Client SDK...');
        exec('npm run build:sdk');
    }
})();
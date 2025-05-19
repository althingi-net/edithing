import xmlFormat from 'xml-formatter';
import { LawEditor, SlateFragment } from '../Slate';
import { exportXml } from './exportXml';

export interface BillDocument {
    originalXml: string;
    content: string;
    identifier: string;
}

export const exportBillMetaXml = (billPublicID: number, billTitle: string, billDescription: string): string => {

    return xmlFormat(`
        <bill>
            <lagasafnID>
                ${billPublicID}
            </lagasafnID>
            <title>
                ${billTitle}
            </title>
            <description>
                ${billDescription}
            </description>
        </bill>
    `);
};


export const exportBillXml = (billDocuments: BillDocument[]): string => {
    const documents = billDocuments.map(document => parseDocument(document));

    return xmlFormat(`
        <bill>
            ${documents.join('\n')}
        </bill>
    `);
};

const parseDocument = (document: BillDocument) => {
    const newContent = JSON.parse(document.content) as SlateFragment;
    const xml = exportXml({ children: newContent } as LawEditor);

    return `${xml}`;
};

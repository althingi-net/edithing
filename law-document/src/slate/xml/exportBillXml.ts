import xmlFormat from 'xml-formatter';
import { LawEditor, SlateFragment } from '../Slate';
import { exportXml } from './exportXml';

export interface BillDocument {
    originalXml: string;
    content: string;
    identifier: string;
    title: string;
}

export const exportBillXml = (billTitle: string, billDocuments: BillDocument[]): string => {
    const documents = billDocuments.map(document => parseDocument(document));

    return xmlFormat(`
        <bill>
            <title>
                ${billTitle}
            </title>
            ${documents.join('\n')}
        </bill>
    `);
};

const parseDocument = (document: BillDocument) => {
    const newContent = JSON.parse(document.content) as SlateFragment;
    const xml = exportXml({ children: newContent } as LawEditor);

    return `${xml}`;
};
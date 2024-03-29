import xmlFormat from 'xml-formatter';
import { Descendant } from 'slate';
import { compareDocuments } from '../changelog/compareDocuments';
import { LawEditor, MetaType } from '../Slate';
import { Changelog } from '../changelog/Changelog';
import { groupChangesByArticle } from '../changelog/groupChangesByArticle';
import { formatIdentifier } from '../formatIdentifier';
import { importXml } from './importXml';

export interface BillDocument {
    originalXml: string;
    content: string;
    events: string;
    identifier: string;
    title: string;
}

export const exportBillXml = (billTitle: string, billDocuments: BillDocument[]): string => {
    let articleCountOffset = 0;

    const chapters = billDocuments.map((document, index) => {
        const { xml, articleCount } = parseDocument(document, index + 1, articleCountOffset);
        
        articleCountOffset = articleCount;
        return xml;
    });

    return xmlFormat(`
        <bill>
            <title>
                ${billTitle}
            </title>
            ${chapters.join('\n')}
        </bill>
    `);
};

const parseDocument = (document: BillDocument, chapterNr: number, articleCountOffset: number) => {
    const originalContent = importXml(document.originalXml);
    const newContent = JSON.parse(document.content) as Descendant[];
    const events = JSON.parse(document.events) as Event[];
    
    const changelog = compareDocuments(
        {
            children: newContent,
            events,
        } as unknown as LawEditor, 
        originalContent
    );
    const articles = createChangelogXml(changelog, articleCountOffset);

    return {
        xml: `
            <${MetaType.CHAPTER} nr="${chapterNr}" identifier="${document.identifier}">
                <title>
                    Breyting á ${document.title}, no. ${formatIdentifier(document.identifier)}.
                </title>
                ${articles.join('\n')}
            </${MetaType.CHAPTER}>
        `,
        articleCount: articles.length + articleCountOffset,
    };
};

const createChangelogXml = (changelog: Changelog[], articleCountOffset: number) => {
    const groupedChanges = groupChangesByArticle(changelog);
    const articles = Object.entries(groupedChanges).map(([, changes], index) => {
        return `
            <${MetaType.ART} nr="${index + 1 + articleCountOffset}">
                ${changes.map((change, index) => `
                    <${MetaType.SUBART} nr="${index + 1}">
                        <${MetaType.SEN} nr="1" change-type="${change.type}" origin-id="${change.id}">
                            ${parseChange(change)}
                        </${MetaType.SEN}>
                    </${MetaType.SUBART}>
                `).join('\n')}
            </${MetaType.ART}>
        `;
    });

    return articles;
};

const parseChange = (change: Changelog) => {
    return change.text;
};
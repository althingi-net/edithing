import { Descendant, Editor, Element, Node, Path, Text } from "slate";
import beautify from "xml-beautifier";
import DocumentMeta from "../../../../models/DocumentMeta";
import { ElementType, List, isList, isListItem, isListItemText } from "../../Slate";


const exportXml = (rootNodes: Descendant[], addHeader = false, documentMeta?: DocumentMeta): string => {
    const xml = [];
    const root = {
        type: ElementType.EDITOR,
        children: rootNodes,
    };
    const slateXml = convertSlate(root, root, []);

    if (addHeader) {
        xml.push('<?xml version="1.0" encoding="utf-8"?>');
    }

    if (documentMeta) {
        xml.push(convertDocumentMetaToXml(documentMeta, slateXml));
    } else {
        xml.push(slateXml);
    }
    
    return beautify(xml.join(''));
}

const convertDocumentMetaToXml = (documentMeta: DocumentMeta, children: string): string => {
    const { nr, year, name, date, original, ministerClause } = documentMeta;

    return `
        <law nr="${nr}" year="${year}">
            <name>${name}</name>
            <num-and-date>
                <date>${date}</date>
                <num>${nr}</num>
                <original>${original}</original>
            </num-and-date>
            <minister-clause>${ministerClause}</minister-clause>
            ${children}
        </law>
    `;
}

const convertSlate = (root: Node, node: Node, path: Path): string => {
    if (isList(node) || Element.isElementType<List>(node, ElementType.EDITOR) || Editor.isEditor(node)) {
        return node.children.map((child, index) => convertSlate(root, child, [...path, index])).join('');
    }

    if (isListItem(node)) {
        const { meta } = node;

        if (!meta) {
            throw new Error('convertSlate: meta is undefined');
        }

        const { type, nr, nrType, romanNr } = meta;
        let title = meta.title;
        let name = meta.name;

        const attributes = [];

        if (nr) {
            attributes.push(`nr="${nr}"`);
        }

        if (nrType) {
            attributes.push(`nr-type="${nrType}"`);
        }

        if (romanNr) {
            attributes.push(`roman-nr="${romanNr}"`);
        }

        // extract LIST_ITEM_TEXT from children
        const listItemText = node.children[0];
        const otherChildren = node.children.slice(1);
        let sentences: Text[] = [];

        if (isListItemText(listItemText)) {
            sentences = listItemText.children;
            
            if (title) {
                title = sentences.slice(0, 1).map(item => item.text).join('');
                sentences = sentences.slice(1)
            }
            
            if (name) {
                name = sentences.slice(0, 1).map(item => item.text).join('');
                sentences = sentences.slice(1)
            }
        }

        const xml = `
            <${type} ${attributes.join(' ')}>
                ${title ? `<nr-title>${title}</nr-title>` : ''}
                ${name ? `<name>${name}</name>` : ''}
                ${sentences.map((sentence, index) => `<sen nr="${index + 1}">${sentence.text}</sen>`).join('')}
                ${otherChildren.map((child, index) => convertSlate(root, child, [...path, index])).join('')}
            </${type}>
        `;

        return xml;
    }

    return ''
}

export default exportXml;
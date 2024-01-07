import { Editor, Element, Node, Path, Text } from 'slate';
import xmlFormat from 'xml-formatter';
import { DocumentMetaElement, isDocumentMeta } from '../element/DocumentMetaElement';
import { isList } from '../element/List';
import { isListItem } from '../element/ListItem';
import { isListItemText } from '../element/ListItemText';

export const exportXml = (root: Node, addHeader = false): string => {
    if (Text.isText(root)) {
        throw new Error('exportXml: root is Text');
    }

    const xml = [];

    if (addHeader) {
        xml.push('<?xml version="1.0" encoding="utf-8"?>');
    }

    const slateXml = convertSlate(root, root, []);

    if (root.children.length > 0 && isDocumentMeta(root.children[0])) {
        const documentMetaElement = root.children[0];

        xml.push(convertDocumentMetaToXml(documentMetaElement, slateXml));
    } else {
        xml.push(`
        <law>
            ${slateXml}
        </law>`);
    }

    return xmlFormat(xml.join(''));
};

const convertDocumentMetaToXml = (element: DocumentMetaElement, children: string): string => {
    const { nr, year, name, date, original, ministerClause } = element.meta;

    return `
        <law nr="${nr}" year="${year}" law-type="law">
            <name>${name}</name>
            <num-and-date>
                <date>${date}</date>
                <num>${nr}</num>
                <original>${original}</original>
            </num-and-date>
            <minister-clause>${escapeHtmlSpecialChars(ministerClause)}</minister-clause>
            ${children}
        </law>
    `;
};

const escapeHtmlSpecialChars = (str: string) => {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;' // ' -> &apos; for XML only
    };
    
    return str.replace(/[&<>"']/g, function(m) { return map[m]; });
};

const convertSlate = (root: Node, node: Node, path: Path): string => {
    if (isList(node) || Editor.isEditor(node)) {
        return node.children.map((child, index) => convertSlate(root, child, [...path, index])).join('');
    }

    if (isListItem(node)) {
        const { meta } = node;

        if (!meta) {
            throw new Error('convertSlate: meta is undefined');
        }

        const { type, nr, nrType, romanNr } = meta;
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
        let title = '';
        let name = '';

        if (isListItemText(listItemText)) {
            sentences = listItemText.children;

            if (meta.title) {
                title = sentences.slice(0, 1).map(item => item.text).join('').trim();
                sentences = sentences.slice(1);
            }

            if (meta.name) {
                name = sentences.slice(0, 1).map(item => item.text).join('').trim();
                sentences = sentences.slice(1);
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

    if (Element.isElement(node)) {
        return node.children.map((child, index) => convertSlate(root, child, [...path, index])).join('');
    }

    return '';
};
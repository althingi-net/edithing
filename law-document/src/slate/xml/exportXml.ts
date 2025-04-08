import { Editor, Element, Node, Path, Text } from 'slate';
import xmlFormat from 'xml-formatter';
import { isList } from '../element/List';
import { isListItem } from '../element/ListItem';
import { isListItemText } from '../element/ListItemText';
import { isDocumentMeta, DocumentMetaElement } from '../element/DocumentMetaElement';
import { escapeXml } from './escapeXml';

export const exportXml = (editor: Editor, addHeader = false): string => {
    const xml = [];

    if (addHeader) {
        xml.push('<?xml version="1.0" encoding="utf-8"?>');
    }

    const slateXml = convertSlate(editor, editor, []);

    if (editor.children.length > 0 && isDocumentMeta(editor.children[0])) {
        const documentMetaElement = editor.children[0];
        xml.push(convertDocumentMetaToXml(documentMetaElement, slateXml));
    } else {
        xml.push(`<law law-type="law">${slateXml}</law>`);
    }

    return xmlFormat(xml.join(''));
};

const convertDocumentMetaToXml = (element: DocumentMetaElement, children: string): string => {
    const { nr, year, name, date, original, ministerClause } = element.meta;

    const lawElements = [];
    const numAndDateElements = [];

    if (name) {
        lawElements.push(`<name>${escapeXml(name)}</name>`);
    }

    if (date) {
        numAndDateElements.push(`<date>${escapeXml(date)}</date>`);
    }

    if (nr) {
        numAndDateElements.push(`<num>${escapeXml(nr)}</num>`);
    }

    if (original) {
        numAndDateElements.push(`<original>${escapeXml(original)}</original>`);
    }

    if (numAndDateElements.length > 0) {
        lawElements.push(`<num-and-date>${numAndDateElements.join('\n')}</num-and-date>`);
    }

    if (ministerClause) {
        lawElements.push(`<minister-clause>${escapeXml(ministerClause)}</minister-clause>`);
    }

    return `
        <law nr="${nr}" year="${year}" law-type="law">
            ${lawElements.join('\n')}
            ${children}
        </law>
    `;
};

const convertSlate = (editor: Editor, node: Node, path: Path): string => {
    if (isList(node) || Editor.isEditor(node)) {
        return node.children.map((child, index) => convertSlate(editor, child, [...path, index])).join('');
    }

    if (isListItem(node)) {
        const { meta } = node;

        if (!meta) {
            throw new Error('convertSlate: meta is undefined');
        }

        const { type, nr, nrType, romanNr } = meta;
        const attributes = [];

        if (nr) {
            attributes.push(`nr="${escapeXml(nr, true)}"`);
        }

        if (nrType) {
            attributes.push(`nr-type="${escapeXml(nrType, true)}"`);
        }

        if (romanNr) {
            attributes.push(`roman-nr="${escapeXml(romanNr, true)}"`);
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
        } else {
            // If there's no ListItemText node, process all children as other children
            otherChildren.unshift(listItemText);
        }

        const xml = `
            <${type} ${attributes.join(' ')}>
                ${title ? `<nr-title>${escapeXml(title)}</nr-title>` : ''}
                ${name ? `<name>${escapeXml(name)}</name>` : ''}
                ${sentences.map(convertSentenceToXml).join('')}
                ${otherChildren.map((child, index) => convertSlate(editor, child, [...path, index])).join('')}
            </${type}>
        `;

        return xml;
    }

    if (Element.isElement(node)) {
        return node.children.map((child, index) => convertSlate(editor, child, [...path, index])).join('');
    }

    return '';
};

const convertSentenceToXml = (sentence: Text, index: number): string => {
    const { text, ...attributes } = sentence;
    const attributesXml = [
        ...convertAttributesToXml(attributes),
        `nr="${index + 1}"`,
    ];

    return `<sen ${attributesXml.join(' ')}>${escapeXml(sentence.text)}</sen>`;
};

const convertAttributesToXml = (attributes: Record<string, any>): string[] => {
    return Object.entries(attributes)
        .map(([key, value]) => `${convertCamelCaseToKebabCase(key)}="${value}"`);
};

const convertCamelCaseToKebabCase = (str: string): string => {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
};
import { Text, Element, Node, Editor, Descendant } from "slate";
import { ElementType, ListItem, MetaType, OrderedList } from "../../Slate";
import beautify from "xml-beautifier";
import DocumentMeta from "../../../../models/DocumentMeta";


const exportXml = (rootNodes: Descendant[], addHeader = false, documentMeta?: DocumentMeta): string => {
    const xml = [];
    const root = {
        type: ElementType.EDITOR,
        children: rootNodes,
    };
    const slateXml = convertSlate(root, root, 0);

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

const convertSlate = (root: Node, node: Node, index: number): string => {
    if (Text.isText(node)) {
        return `<sen nr="${index + 1}">${node.text}</sen>`;
    }

    if (Element.isElementType<OrderedList>(node, ElementType.ORDERED_LIST) || Element.isElementType<OrderedList>(node, ElementType.EDITOR) || Editor.isEditor(node)) {
        return node.children.map((child, index) => convertSlate(root, child, index)).join('');
    }

    if (Element.isElementType<ListItem>(node, ElementType.LIST_ITEM)) {
        const { meta } = node;
        const { type, nr, nrType, romanNr } = meta;
        const title = meta.title ? getNodesTitle(node) : undefined;

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

        // Remove the title from the children
        let children = node.children;
        if (title) {
            children = node.children.slice(1);
        }

        const xml = `
            <${type} ${attributes.join(' ')}>
                ${title ? `<nr-title>${title}</nr-title>` : ''}
                ${children.map((child, index) => convertSlate(root, child, index)).join('')}
            </${type}>
        `;

        return xml;
    }

    if (Element.isElementType<Element>(node, ElementType.LIST_ITEM_TEXT)) {
        return node.children.map((child, index) => convertSlate(root, child, index)).join('');
    }

    return ''
}

const getNodesTitle = (node: ListItem): string => {
    const child = Node.child(node, 0);

    if (node.meta.type !== MetaType.PARAGRAPH) {
        return Node.string(child);
    }

    return ''
}

export default exportXml;
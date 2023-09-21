import { Text, Element, Node, Editor, Descendant, Path } from "slate";
import { ElementType, ListItem, MetaType, OrderedList, isList, isListItem, isListItemText } from "../../Slate";
import beautify from "xml-beautifier";
import DocumentMeta from "../../../../models/DocumentMeta";


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
    if (Text.isText(node) && node.text) {
        return `<sen nr="${path.slice(-1)[0] + 1}">${node.text}</sen>`;
    }

    if (isList(node) || Element.isElementType<OrderedList>(node, ElementType.EDITOR) || Editor.isEditor(node)) {
        return node.children.map((child, index) => convertSlate(root, child, [...path, index])).join('');
    }

    if (isListItem(node)) {
        const { meta } = node;
        const { type, nr, nrType, romanNr } = meta;
        let title = meta.title;

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
        const textNode = node.children[0];
        if (title && isListItemText(textNode)) {
            title = textNode.children.slice(0, 1).map(item => item.text).join('');
            textNode.children = textNode.children.slice(1);
        }

        const xml = `
            <${type} ${attributes.join(' ')}>
                ${title ? `<nr-title>${title}</nr-title>` : ''}
                ${node.children.map((child, index) => convertSlate(root, child, [...path, index])).join('')}
            </${type}>
        `;

        return xml;
    }

    if (isListItemText(node)) {
        return node.children.map((child, index) => convertSlate(root, child, [...path, index])).join('');
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
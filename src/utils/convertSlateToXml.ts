import { Text, Element, Node, Editor } from "slate";
import { ElementType, ListItem, MetaType, OrderedList } from "../components/Editor/Slate";
import beautify from "xml-beautifier";

const convertSlateToXml = (root: Node): string => {
    return beautify([
        '<?xml version="1.0" encoding="utf-8"?>',
        convertSlate(root, root),
    ].join(''));
}

const convertSlate = (root: Node, node: Node): string => {
    if (Text.isText(node)) {
        return node.text;
    }

    if (Element.isElementType<OrderedList>(node, ElementType.ORDERED_LIST) || Element.isElementType<OrderedList>(node, ElementType.EDITOR) || Editor.isEditor(node)) {
        return node.children.map(child => convertSlate(root, child)).join('');
    }

    if (Element.isElementType<ListItem>(node, ElementType.LIST_ITEM)) {
        const { meta } = node;
        const { type, nr, nrType, romanNr } = meta;
        const title = getNodesTitle(node);

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
                ${children.map(child => convertSlate(root, child)).join('')}
            </${type}>
        `;

        return xml;
    }

    if (Element.isElementType<Element>(node, ElementType.LIST_ITEM_TEXT)) {
        return node.children.map(child => convertSlate(root, child)).join('');
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

export default convertSlateToXml;
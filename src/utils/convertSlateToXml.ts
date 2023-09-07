import { Text, Element, Node } from "slate";
import { ElementType, ListItem, MetaType, OrderedList } from "../components/Editor/Slate";

const convertSlateToXml = (root: Node): string => {
    return convert(root, root);
}

const convert = (root: Node, value: Node): string => {
    for (const [node, path] of Node.nodes(value)) {
        console.log(node, path);

        if (Element.isElementType<OrderedList>(node, ElementType.ORDERED_LIST)) {
            return node.children.map(child => convert(root, child)).join('');
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

            const xml = `
                <${type} ${attributes.join(' ')}>
                    ${title ? `<nr-title>${title}</nr-title>` : ''}
                    ${node.children.map(child => convert(root, child)).join('')}
                </${type}>
            `;

            return xml;
        }
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
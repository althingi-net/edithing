import { Element, Node } from "slate";
import { ElementType, ListItem, OrderedList } from "../components/Editor/Slate";

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
            const { type, nr, nrType, romanNr, title } = meta;

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

        // if (Element.isElementType<OrderedList>(node, Type.LIST_ITEM_TEXT)) {
        //     const { meta } = node;
        //     const parent = Node.parent(root, path.slice(0, -1));

        //     if (!parent || !Element.isElementType<ListItem>(parent, Type.LIST_ITEM)) {
        //         return '';
        //     }

        //     const { type, nrType, romanNr, title } = parent.meta;
        //     const xml = `
        //         <${type} nr="${nr}" nr-type="${nrType}" roman-nr="${romanNr}">
        //             <nr-title>${title}</nr-title>
        //             ${node.children.map(convertSlateToXml).join('')}
        //         </${type}>
        //     `;

        //     return xml;
        // }
    }

    return ''
}

export default convertSlateToXml;
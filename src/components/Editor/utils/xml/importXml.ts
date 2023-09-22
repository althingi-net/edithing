import { XMLParser } from "fast-xml-parser";
import { Descendant, Text } from "slate";
import DocumentMeta from "../../../../models/DocumentMeta";
import { ElementType, LIST_TAGS, ListItemText, MetaType, OrderedList, isListItemText } from "../../Slate";

const importXml = (xml: string) => {
    const object = parseXml(xml);

    const meta = extractMeta(object);
    const slate = convertSlate(object['law'] || object);

    return { meta, slate };
}

const parseXml = (xml: string) => {
    const parser = new XMLParser({ ignoreAttributes: false });
    return parser.parse(xml);
}

const extractMeta = (object: any): DocumentMeta => {
    const law = object['law'] || object;

    return {
        nr: law['@_nr'],
        year: law['@_year'],
        name: law['name'],
        date: law['num-and-date']?.['date'],
        original: law['num-and-date']?.['original'],
        ministerClause: law['minister-clause'],
    };
};

const convertSlate = (object: any): Descendant[] => {
    const nodes: Descendant[] = [];

    for (const key in object) {
        const value = object[key];
        const values = Array.isArray(value) ? value : [value];

        if (LIST_TAGS.includes(key)) {
            nodes.push(convertList(key, values));
        }

        if (key === 'sen') {
            nodes.push(convertSen(values));
        }
    }

    normalizeChildren(nodes);

    return nodes;
}

const convertList = (key: string, values: any[]): Descendant => {
    const node: OrderedList = {
        type: ElementType.ORDERED_LIST,
        meta: {
            type: key as MetaType,
        },
        children: [],
    }

    if (values[0]['@_nr-type']) {
        node.meta.nrType = values[0]['@_nr-type'];
    }

    values.forEach((element) => {
        const listItem: Descendant = {
            type: ElementType.LIST_ITEM,
            meta: {
                type: key as MetaType,
                nr: element['@_nr'],
            },
            children: [],
        }

        if (element['@_nr-type'] || element['@_type']) {
            listItem.meta.nrType = element['@_nr-type'] ?? element['@_type'];
        }

        if (element['@_roman-nr']) {
            listItem.meta.romanNr = element['@_roman-nr'];
        }

        if (element['@_style-note']) {
            listItem.meta.styleNote = element['@_style-note'];
        }

        if (element['nr-title']) {
            listItem.meta.title = element['nr-title'];
        }

        if (element['name']) {
            listItem.meta.name = element['name'];
        }

        const textNode: ListItemText = {
            type: ElementType.LIST_ITEM_TEXT,
            children: [], 
        };
        listItem.children.push(textNode);

        if (listItem.meta.title) {
            textNode.children.push({
                title: true,
                text: listItem.meta.title,
            });
        }

        if (listItem.meta.name) {
            textNode.children.push({
                name: true,
                text: listItem.meta.name,
            });
        }

        if (element['#text']) {
            textNode.children.push({
                nr: element['@_nr'] ?? '1',
                text: element['#text'],
            });
        }

        convertSlate(element).forEach((child) => {
            if (Text.isText(child)) {
                if (!child.text) {
                    return null;
                }

                textNode.children.push(child);
            } else if (isListItemText(child)) {
                textNode.children.push(...child.children);
            } else {
                listItem.children.push(child);
            }
        });

        normalizeChildren(textNode.children);

        node.children.push(listItem);
    })

    return node
}

const convertSen = (sentences: any[]): Descendant => {
    const texts: Descendant[] = sentences
        .filter((child) => !child['a'])
        .map((child, index) => {
            const nr = child['@_nr'] ?? '1';
            const text = child['#text'] ?? child ?? '';

            // TODO: handle links
            // if (child['a']) {
            //     return child['@_href'];
            // }

            return { text, nr };
        });

    return {
        type: ElementType.LIST_ITEM_TEXT,
        children: texts,
    }
}

/**
 * Adds empty text node to given nodes array if that array is empty. 
 * Slate's most deepest nodes always need to have an empty text node if there is nothing else to allow user to put the cursor there
 * Note: Mutates array
 * @param nodes 
 */
const normalizeChildren = (nodes: Descendant[]) => {
    if (nodes.length === 0) {
        nodes.push({ text: '' })
    }
}


export default importXml;
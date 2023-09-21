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
            const node: OrderedList = {
                type: ElementType.ORDERED_LIST,
                meta: {
                    type: key as MetaType,
                },
                children: [],
            }

            if (value['@_nr-type']) {
                node.meta.nrType = value['@_nr-type'];
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

                const textNode: ListItemText = {
                    type: ElementType.LIST_ITEM_TEXT,
                    children: [],
                };
                listItem.children.push(textNode);

                if (listItem.meta.title || element['#text']) {
                    textNode.children.push({ text: listItem.meta.title ?? element['#text'] });
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

            nodes.push(node);
        }

        if (key === 'sen') {
            const texts = parseSenTag(values).filter(Boolean).map(text => ({ text }));
            if (texts.length > 0) {
                nodes.push({
                    type: ElementType.LIST_ITEM_TEXT,
                    children: texts,
                })
            }
        }
    }

    normalizeChildren(nodes);

    return nodes;
}

const parseSenTag = (sen: any[]): string[] => {
    return sen.map((child) => {
        if (typeof child === 'string') {
            return child;
        }

        if (child['#text']) {
            return `${child['#text']}`;
        }

        // TODO: handle links
        // if (child['a']) {
        //     return child['@_href'];
        // }

        return '';
    });
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
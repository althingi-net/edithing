import { XMLParser } from "fast-xml-parser";
import DocumentMeta from "../../../../models/DocumentMeta";
import { Descendant, Text } from "slate";
import { LIST_TAGS, OrderedList, ElementType, MetaType } from "../../Slate";

const importXml = (xml: string) => {
    const parser = new XMLParser({ ignoreAttributes: false });
    let object = parser.parse(xml);

    const meta: DocumentMeta = {
        nr: object['law']['@_nr'],
        year: object['law']['@_year'],
        name: object['law']['name'],
        date: object['law']['num-and-date']?.['date'],
        original: object['law']['num-and-date']?.['original'],
        ministerClause: object['law']['minister-clause'],
    };

    const slate = convertSlate(object['law'] || object);

    return { meta, slate };
}

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
                const children = convertSlate(element).map((child) => {
                    const childNode: Descendant = {
                        type: ElementType.LIST_ITEM,
                        meta: {
                            type: key as MetaType,
                            nr: element['@_nr'],
                        },
                        children: [],
                    }
                    
                    if (element['@_nr-type']) {
                        childNode.meta.nrType = element['@_nr-type'];
                    }
                    
                    if (element['@_roman-nr']) {
                        childNode.meta.romanNr = element['@_roman-nr'];
                    }

                    // Wrap child in LIST_ITEM_TEXT if its text or prepend it before the child to use as title text
                    if (Text.isText(child)) {
                        childNode.children.push({
                            type: ElementType.LIST_ITEM_TEXT,
                            children: [child.text ? child : { text: element['nr-title'] ?? element['#text'] ?? '' }],
                        })
                    } else {
                        childNode.children.push({
                            type: ElementType.LIST_ITEM_TEXT,
                            children: [{ text: element['nr-title'] ?? element['#text'] ?? '' }],
                        });
                        childNode.children.push(child);
                    }

                    return childNode
                });

                node.children.push(...children)
            })

            nodes.push(node);
        }

        if (key === 'sen') {
            nodes.push({ text: parseSenTag(values) })
        }
    }

    normalizeChildren(nodes);

    return nodes;
}

const parseSenTag = (sen: any[]): string => {
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
    }).join(' ');
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
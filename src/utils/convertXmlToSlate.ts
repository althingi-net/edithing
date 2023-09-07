import { XMLParser } from "fast-xml-parser";
import { Descendant, Text } from "slate";
import { ElementType, OrderedList } from "../components/Editor/Slate";

const LIST_TAGS = [
    'chapter',
    'art',
    'subart',
    'paragraph',
];

const convertXmlToSlate = (xml: string): Descendant[] => {
    const parser = new XMLParser({ ignoreAttributes: false });
    let object = parser.parse(xml);

    return convertObject(object['law'] || object);
}

const convertObject = (object: any): Descendant[] => {
    const nodes: Descendant[] = [];

    for (const key in object) {
        const value = object[key];
        const values = Array.isArray(value) ? value : [value];

        if (LIST_TAGS.includes(key)) {
            const node: OrderedList = {
                type: ElementType.ORDERED_LIST,
                meta: {
                    type: key,
                },
                children: [],
            }

            if (value['@_nr-type']) {
                node.meta.nrType = value['@_nr-type'];
            }

            values.forEach((element) => {
                const children = convertObject(element).map((child) => {
                    const childNode: Descendant = {
                        type: ElementType.LIST_ITEM,
                        meta: {
                            type: key,
                            nr: element['@_nr'],
                        },
                        children: [],
                    }
                    
                    if (element['nr-title']) {
                        childNode.meta.title = element['nr-title'];
                    }
                    
                    if (element['@_nr-type']) {
                        childNode.meta.nrType = element['@_nr-type'];
                    }
                    
                    if (element['@_roman-nr']) {
                        childNode.meta.romanNr = element['@_roman-nr'];
                    }

                    if (Text.isText(child)) {
                        childNode.children.push({
                            type: ElementType.LIST_ITEM_TEXT,
                            children: [child.text ? child : { text: element['nr-title'] ?? '' }],
                        })
                    } else {
                        childNode.children.push({
                            type: ElementType.LIST_ITEM_TEXT,
                            children: [{ text: element['nr-title'] ?? '' }],
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
            nodes.push({ text: values.join(' ') })
        }
    }

    normalizeChildren(nodes);

    return nodes;
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

export default convertXmlToSlate;
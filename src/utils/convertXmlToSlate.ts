import { XMLParser } from "fast-xml-parser";
import { Descendant, Text } from "slate";
import { ListItem, OrderedList, Type } from "../components/Editor/Slate";

const IGNORE_TAGS = [
    '?xml',
    'name',
    'num-and-date',
    'minister-clause',
];

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
                type: Type.ORDERED_LIST,
                children: [],
            }

            if (key === 'chapter') {
                node.listType = 'I';
            }

            values.forEach((value) => {
                node.children.push(...convertObject(value).map((item) => {
                    const childNode: Descendant = {
                        type: Type.LIST_ITEM,
                        children: [],
                    }

                    if (isText(item)) {
                        childNode.children.push({
                            type: Type.LIST_ITEM_TEXT,
                            children: [item],
                        })
                    } else {
                        childNode.children.push({
                            type: Type.LIST_ITEM_TEXT,
                            children: [{ text: '' }],
                        });
                        childNode.children.push(item);
                    }

                    return childNode
                }))
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

function isText(node: any): node is Text {
    return node.text !== undefined ? true : false;
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

import { XMLParser } from 'fast-xml-parser';
import { createId } from './state/createId';
import { Node } from './Node';

const parseXml = (xml: string) => {
    const parser = new XMLParser({
        ignoreAttributes: false,
        preserveOrder: true,
        attributesGroupName: '@_attributes',
    });
    const data = parser.parse(xml) as any[];
    
    return mapXmlToNode(data);
};

const mapXmlToNode = (data: any[]) => {
    const nodes: Node[] = [];

    for (let i = 0; i < data.length; i++) {
        const { tag, attributes, children } = extractValue(data[i]);

        if (!tag || tag === '?xml') {
            continue;
        }

        const node: Node = {
            id: createId(),
            type: tag,
            attributes,
            children: [],
        };

        if (children && children.length === 1 && children[0]['#text']) {
            node.text = children[0]['#text'];
        } else if (children) {
            node.children = mapXmlToNode(children);
        }
        
        nodes.push(node);
    }

    return nodes;
};

const extractValue = (dataEntry: any) => {
    let children = null;
    let tag = null;
    let attributes: Record<string, string> = {};

    for (const key in dataEntry) {
        if (key === ':@') {
            attributes = normalizeAttributes(dataEntry[key]['@_attributes']);
        } 

        else {
            tag = normalizeTag(key);
            children = dataEntry[key] as any[];
        }
    }

    return {
        tag,
        children,
        attributes,
    };
};

const normalizeTag = (tag: string) => {
    return tag.replace('nr-title', 'title');
};

const normalizeAttributes = (attributes: any) => {
    const normalizedAttributes = {} as Record<string, string>;

    for (const key in attributes) {
        const value = attributes[key];
        const normalizedKey = key
            .replace('@_', '')
            .replace(/'-'/g, ' ');

        normalizedAttributes[normalizedKey] = value;
    }

    return normalizedAttributes;
};

export default parseXml;
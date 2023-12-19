/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMLParser } from 'fast-xml-parser';
import { Descendant, Text } from 'slate';
import { TAGS } from '../../../../config/tags';
import { ElementType, LIST_TAGS, MetaType, isMetaType } from '../../Slate';
import DocumentMetaElement from '../../elements/DocumentMeta';
import { ListWithMeta } from '../../elements/List';
import { ListItemWithMeta } from '../../elements/ListItem';
import ListItemText, { isListItemText } from '../../elements/ListItemText';
import createDocumentMeta from '../slate/createDocumentMeta';
import normalizeChildren from '../slate/normalizeChildren';

const importXml = (xml: string) => {
    const object = parseXml(xml);

    if (object['law'] && object['law']['@_law-type'] !== 'law') {
        throw new Error('Invalid law');
    }

    const slate = convertSlate(object['law'] || object);

    slate.unshift(extractMeta(object));

    return slate;
};

const parseXml = (xml: string) => {
    const parser = new XMLParser({ ignoreAttributes: false });
    return parser.parse(xml);
};

const extractMeta = (object: any): DocumentMetaElement => {
    const law = object['law'] || object;

    return createDocumentMeta({
        nr: law['@_nr'],
        year: law['@_year'],
        name: law['name'],
        date: law['num-and-date']?.['date'],
        original: law['num-and-date']?.['original'],
        ministerClause: law['minister-clause'],
    });
};

const convertSlate = (object: any): Descendant[] => {
    const nodes: Descendant[] = [];

    for (const key in object) {
        const value = object[key];
        const values = Array.isArray(value) ? value : [value];

        if (isMetaType(key) && LIST_TAGS.includes(key)) {
            // if virtual skip that tag and add children directly
            if (TAGS[key].display === 'virtual') {
                nodes.push(...values.map(convertSlate).flat());
                continue;
            }
            
            nodes.push(convertList(key, values));
        }

        if (key === 'sen') {
            nodes.push(convertSen(values));
        }
    }

    return nodes;
};

const convertList = (key: string, values: any[]): Descendant => {
    const node: ListWithMeta = {
        type: ElementType.LIST,
        meta: {
            type: key as MetaType,
        },
        children: [],
    };

    if (values[0]['@_nr-type']) {
        node.meta.nrType = values[0]['@_nr-type'];
    }

    values.forEach((element) => {
        const listItem: ListItemWithMeta = {
            type: ElementType.LIST_ITEM,
            meta: {
                type: key as MetaType,
                nr: element['@_nr'],
                originNr: element['@_nr'],
            },
            children: [],
        };

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
            listItem.meta.title = true;
        }

        if (element['name']) {
            listItem.meta.name = true;
        }

        const textNode: ListItemText = {
            type: ElementType.LIST_ITEM_TEXT,
            children: [], 
        };
        listItem.children.push(textNode);

        if (listItem.meta.title) {
            textNode.children.push({
                title: true,
                text: element['nr-title'] + ' ',
            });
        }

        if (listItem.meta.name) {
            textNode.children.push({
                name: true,
                text: element['name'] + ' ',
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

        normalizeChildren(textNode);

        node.children.push(listItem);
    });

    return node;
};

const convertSen = (sentences: any[]): Descendant => {
    const texts: Text[] = sentences
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
    };
};



export default importXml;
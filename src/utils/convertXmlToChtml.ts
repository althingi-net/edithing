import { XMLParser } from "fast-xml-parser";
import ReactQuill from "react-quill";

const IGNORE_TAGS = [
    '?xml',
    'date',
    'num',
];

/**
 * Convert XML to Custom-HTML (CHTML) that is used in the editor and can be converted back to the original XML
 * @param xml string
 * @returns CHTML string
 */
const convertXmlToChtml = (xml: string): string => {
    const parser = new XMLParser();
    let object = parser.parse(xml);

    return convert(object)
}

const convert = (object: any): string => {
    if (Array.isArray(object)) {
        return object.map(convert).join('');
    }

    if (typeof object === 'object') {
        const values: string[] = [];

        for (const key in object) {
            const value = object[key];

            if (IGNORE_TAGS.includes(key)) {
                continue;
            }

            values.push(convertObject(key, value));
        }

        return values.join('');
    }

    return `${object}`;
}

const convertObject = (key: string, value: string): string => {
    const content = convert(value);

    if (key === 'paragraph') {
        return `<p>${content}</p>`;
    }

    return content;
}

export default convertXmlToChtml;
import { XMLParser } from "fast-xml-parser";
import ReactQuill from "react-quill";

const IGNORE_TAGS = [
    '?xml',
    'date',
    'num',
];

const convertXmlToHtml = (xml: string): string => {
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

    if (key === 'law') {
        return `<div class="boxbody">${content}</div>`;
    }

    if (key === 'name') {
        return `<h2>${content}</h2>`;
    }

    if (key === 'original') {
        return `<p style="text-align:center"><strong>${content}</strong></p><hr>`
    }

    if (key === 'minister-clause') {
        return `${content}<hr><br>`;
    }

    return content;
}

export default convertXmlToHtml;
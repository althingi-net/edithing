import { XMLParser } from "fast-xml-parser";

const IGNORE_TAGS = [
    '?xml',
    'name',
    'num-and-date',
    'minister-clause',
];

/**
 * Convert XML to Custom-HTML (CHTML) that is used in the editor and can be converted back to the original XML
 * @param xml string
 * @returns CHTML string
 */
const convertXmlToChtml = (xml: string): string => {
    const parser = new XMLParser({ ignoreAttributes: false });
    let object = parser.parse(xml);

    return convert(object)
}

const convert = (object: any, join = ''): string => {
    if (Array.isArray(object)) {
        return `${object.map(item => convert(item)).join(join)}`;
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

const convertObject = (key: string, value: any): string => {
    if (key === 'law') {
        const attributes = extractAttributes(['nr', 'year'], value);
        return `<ol type="I"${attributes}>${convert(value)}</ol>`;
    }

    if (key === 'chapter') {
        return `<li><ol>${convert(value, '</ol></li><li><ol>')}</ol></li>`;
    }

    if (key === 'art') {
        return `<li><ol>${convert(value, '</ol></li><li><ol>')}</ol></li>`;
    }

    if (key === 'subart') {
        return `<li><ol>${convert(value, '</ol></li><li><ol>')}</ol></li>`;
    }

    if (key === 'paragraph') {
        return `<p>${convert(value, '</p><p>')}</p>`;
    }

    if (key === 'sen') {
        return `<span>${convert(value, '</span><span>')}</span>`;
    }

    return '';
}

const extractAttributes = (names: string[], object: any) => {
    const values: string[] = [];

    names.forEach((name) => {
        const value = object[`@_${name}`];
        if (value) {
            values.push(`data-${name}="${value}"`);
        }
    })

    if (values.length > 0) {
        return ` ${values.join(' ')}`;
    }

    return '';
}

export default convertXmlToChtml;
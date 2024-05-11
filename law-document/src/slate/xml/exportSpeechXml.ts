import { Editor, Node } from 'slate';
import xmlFormat from 'xml-formatter';
import { isParagraph } from '../element/Paragraph';
import { escapeXml } from './escapeXml';

export const exportSpeechXml = (editor: Editor, addHeader = false): string => {
    const xml = [];

    if (addHeader) {
        xml.push('<?xml version="1.0" encoding="utf-8"?>');
    }

    const slateXml = convertSlate(editor, editor);

    xml.push(`
        <speech>
            ${slateXml}
        </speech>`);

    return xmlFormat(xml.join(''));
};

const convertSlate = (editor: Editor, node: Node): string => {
    if (Editor.isEditor(node)) {
        return node.children.map((child) => convertSlate(editor, child)).join('');
    }

    if (isParagraph(node)) {
        const xml = `
            <paragraph>
                ${escapeXml(node.children.map((child) => child.text).join(''))}
            </paragraph>
        `;

        return xml;
    }

    return '';
};


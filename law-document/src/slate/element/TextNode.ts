import { Node, Text } from 'slate';

export interface TextNode {
    text: string;
    title?: boolean;
    name?: boolean;
    nr?: string;
    bold?: boolean;
}

export const isName = (node?: Node | null): node is Text => {
    return Text.isText(node) && Boolean(node.name);
};

export const isTitle = (node?: Node | null): node is Text => {
    return Text.isText(node) && Boolean(node.title);
};
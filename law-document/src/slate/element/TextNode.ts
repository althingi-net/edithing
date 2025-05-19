import { Node, Text } from 'slate';

export interface TextNode {
    lagasafnID?: string;
    text: string;
    title?: boolean;
    name?: boolean;
    description?: string;
    nr?: string;
    bold?: boolean;
    expirySymbolOffset?: string;
}

export const isPublicID = (node?: Node | null): node is Text => {
    return Text.isText(node) && 'number' === typeof node.lagasafnID;
};

export const isName = (node?: Node | null): node is Text => {
    return Text.isText(node) && Boolean(node.name);
};

export const isTitle = (node?: Node | null): node is Text => {
    return Text.isText(node) && Boolean(node.title);
};

export const isDescription = (node?: Node | null): node is Text => {
   return Text.isText(node) && Boolean(node.description);
};

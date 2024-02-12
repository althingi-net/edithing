import { Descendant, Editor, Element, Node, Text } from 'slate';
import { isPlainObject } from 'is-plain-object';

export class ValidationError extends Error {}

export const validateDocument = (slate: Descendant[]) => {
    return isNodeList(slate);
};

const isNodeList = (value: any): value is Node[] => {
    if (!Array.isArray(value)) {
        throw new ValidationError(`Node list is not an array: ${JSON.stringify(value)}`);
    }
    const isNodeList = value.every(val => isNode(val));

    if (!isNodeList) {
        throw new ValidationError(`Node list contains invalid children: ${JSON.stringify(value)}`);
    }

    return isNodeList;
};

const isNode = (value: any): value is Node => {
    return (
        Text.isText(value) || isElement(value) || Editor.isEditor(value)
    );
};

const isElement = (value: any): value is Element => {
    try {
        return (
            isPlainObject(value) &&
            isNodeList(value.children) &&
            !Editor.isEditor(value)
        );
    } catch (error) {
        throw new ValidationError(`Element is not valid: ${JSON.stringify(value)}`);   
    }
};
import { isPlainObject } from 'is-plain-object';
import { Descendant, Editor, Element, Node, Text } from 'slate';
import { isListItem } from './element/ListItem';

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
            isPlainObject(value)
            && validateListItem(value)
            && isNodeList(value.children)
            && !Editor.isEditor(value)
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        const { children, ...valueWithoutChildren } = value;
        throw new ValidationError(`Element is not valid: ${JSON.stringify(valueWithoutChildren)}`);   
    }
};

const validateListItem = (value: any) =>  {
    if (isListItem(value)) {
        if (!value.meta?.nr.match(/^([0-9a-zA-Z]{1,3})$/)?.[0]) {
            const { children, ...valueWithoutChildren } = value;
            throw new ValidationError(`Invalid nr attribute: ${JSON.stringify(valueWithoutChildren)}`);
        }
    }

    return true;
};
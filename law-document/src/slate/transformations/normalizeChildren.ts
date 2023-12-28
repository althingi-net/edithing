import { Element, Text } from 'slate';

/**
 * Adds empty text node to given Slate element if there is none.  
 * Also removes empty text nodes if there is more than one.  
 * Slate requires to have at least one text node in an element if it is empty.  
 * Note: Mutates element.children.
 * @param element The Slate element to normalize. 
 */
export const normalizeChildren = (element: Element) => {
    // remove empty text nodes but ignore the first one
    if (element.children.length > 1) {
        element.children = element.children.filter((item => Text.isText(item) && item.text !== ''));
    }

    // add required empty text node if there is none
    if (element.children.length === 0) {
        element.children.push({ text: '', nr: '1' });
    }
};
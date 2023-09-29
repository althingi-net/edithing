import { Element, Text } from "slate";

/**
 * Adds empty text node to given Slate element if there is none.  
 * Also removes empty text nodes if there is more than one.  
 * Slate requires to have at least one text node in an element.  
 * Note: Mutates node.children.
 * @param nodes 
 */
const normalizeChildren = (node: Element) => {
    // remove empty text nodes but ignore the first one
    if (node.children.length > 1) {
        node.children = node.children.filter((item => Text.isText(item) && item.text !== ''));
    }

    // add required empty text node if there is none
    if (node.children.length === 0) {
        node.children.push({ text: '' })
    }
}

export default normalizeChildren;
import { ElementType } from 'law-document';
import { Descendant, Element, Text } from 'slate';
import { Doc, XmlElement, XmlFragment, XmlHook, XmlText } from 'yjs';

export function assignSlateToDoc(nodes: Descendant[], doc: Doc) {
    const yElement = doc.get('content', XmlFragment) as XmlFragment;
    
    nodes.forEach((child, index) => {
        yElement.insert(index, [slateToY(child)]);
    });
}

function slateToY(node: Descendant): XmlText | XmlElement {
    if (Text.isText(node)) {
        const { text, ...attributes } = node;
        const yText = new XmlText(text);

        Object.entries(attributes).forEach(([key, value]) => {
            yText.setAttribute(key, value);
        });

        return yText;
    }

    if (Element.isElement(node)) {
        const { children, ...attributes } = node;
        const nodeName = node.type as string;
        const yElement = new XmlElement(nodeName);
    
        children.forEach((child, index) => {
            yElement.insert(index, [slateToY(child)]);
        });
    
        Object.entries(attributes).forEach(([key, value]) => {
            yElement.setAttribute(key, value);
        });

        return yElement;
    }

    throw new Error('Invalid node');
}

export function convertYToSlate(element: XmlFragment): Descendant[] {
    return element.toArray().map((child) => {
        if (child instanceof XmlHook) {
            throw new Error('XmlHook not supported');
        }

        return yToSlate(child);
    });
}

function yToSlate(element: XmlText | XmlElement): Descendant {
    if (element instanceof XmlText) {
        return {
            text: element.toString(),
            ...element.getAttributes(),
        };
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const node: Element = {
        type: element.nodeName as ElementType,
        ...element.getAttributes(),
        children: element.toArray().map((child) => {
            if (child instanceof XmlHook) {
                throw new Error('XmlHook not supported');
            }

            return yToSlate(child);
        }),
    };

    return node;
}

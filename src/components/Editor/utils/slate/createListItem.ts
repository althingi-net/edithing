import { Descendant } from "slate";
import { MetaType, ListItem, ListItemText, ElementType, ListItemMeta } from "../../Slate";
import convertRomanNumber from "../convertRomanNumber";

interface Options extends Omit<ListItemMeta, 'nr' | 'type'> {
    text?: string | string[];
}

/**
 * Create a list item with the given meta type, number and text.
 * 
 * @param type The meta type of the list item.
 * @param nr The number of the list item. (starts at 1, can be digit, letter, roman number, digit+letter)
 */
export const createListItem = (type: MetaType, nr: string, options: Options = {}, children: Descendant[] = []): ListItem => {
    const { title, name, text, nrType, styleNote, romanNr } = options;

    const textElement: ListItemText = {
        type: ElementType.LIST_ITEM_TEXT,
        children: [],
    }
    
    const listItem: ListItem = {
        type: ElementType.LIST_ITEM,
        meta: {
            type: type,
            nr,
        },
        children: [
            textElement,
            ...children
        ],
    };

    if (name) {
        listItem.meta!.name = name;
        textElement.children.unshift({ text: name, name: true });
    }

    if (title) {
        listItem.meta!.title = title;
        textElement.children.unshift({ text: title, title: true });
    }

    if (nrType) {
        listItem.meta!.nrType = nrType;
    }

    if (styleNote) {
        listItem.meta!.styleNote = styleNote;
    }

    if (text) {
        if (Array.isArray(text)) {
            textElement.children.push(...text.map((text, index) => ({ text, nr: `${index + 1}` })));
        } else {
            textElement.children.push({ text, nr: '1' });
        }
    } else {
        textElement.children.push({ text: '' });
    }

    // remove empty text nodes but keep at least one 
    if (textElement.children.length > 1) {
        textElement.children = textElement.children.filter((item => item.text !== ''));
    }

    if (type === MetaType.CHAPTER) {
        listItem.meta!.nrType = 'roman';
        listItem.meta!.romanNr = romanNr ?? convertRomanNumber(nr);
    }

    if (type === MetaType.NUMART && !nrType) {
        listItem.meta!.nrType = 'numeric';
    }

    return listItem;
};

export default createListItem;
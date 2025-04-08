import { ListItemMeta, ListItemWithMeta } from '../element/ListItem';
import { ListItemText, ListItemTextMeta } from '../element/ListItemText';
import { MetaType, ElementType, SlateFragment } from '../Slate';
import { convertRomanNumber } from '../number/convertRomanNumber';
import { createListItemText } from './createListItemText';
import { TAGS } from '../config/tags';

export interface Options extends Omit<ListItemMeta, 'nr' | 'originNr' | 'type' | 'title' | 'name'> {
    text?: string | string[];
    title?: string | boolean;
    name?: string | boolean;
    originNr?: string;
    textMeta?: ListItemTextMeta;
}

/**
 * Create a list item with the given meta type, number and text.
 * 
 * @param type The meta type of the list item.
 * @param nr The number of the list item. (starts at 1, can be digit, letter, roman number, digit+letter)
 */
export const createListItem = (type: MetaType, nr: string, options: Options = {}, children: SlateFragment = []): ListItemWithMeta => {
    const { title, name, text, nrType, styleNote, romanNr, originNr, textMeta } = options;

    const tagConfig = TAGS[type];
    const shouldHaveTitle = tagConfig.hasTitle && title != null && title !== false;
    const shouldHaveName = tagConfig.hasName && name != null && name !== false;
    const hasTextContent = text != null || (shouldHaveTitle || shouldHaveName);
    
    const listItem: ListItemWithMeta = {
        type: ElementType.LIST_ITEM,
        meta: {
            type: type,
            nr,
            originNr: originNr ?? nr,
        },
        children: [],
    };

    if (hasTextContent) {
        const textElement: ListItemText = createListItemText(undefined, textMeta);
        listItem.children.push(textElement);

        if (shouldHaveName) {
            listItem.meta.name = true;

            if (typeof name === 'string') {
                textElement.children.unshift({ text: name, name: true });
            }
        }

        if (shouldHaveTitle) {
            listItem.meta.title = true;

            if (typeof title === 'string') {
                textElement.children.unshift({ text: title, title: true });
            }
        }

        if (text != null) {
            if (Array.isArray(text)) {
                textElement.children.push(...text.map((text, index) => ({ text, nr: `${index + 1}`, ...textMeta })));
            } else {
                textElement.children.push({ text, nr: '1', ...textMeta });
            }
        } else if (children.length === 0 && (shouldHaveTitle || shouldHaveName)) {
            // Only add empty text node if we have no children and should have title/name
            textElement.children.push({ text: '', nr: '1', ...textMeta });
        }

        // remove empty text nodes but keep at least one if we should have title/name
        textElement.children = textElement.children.filter((item => item.text !== ''));

        if (textElement.children.length === 0) {
            textElement.children.push({ text: '', nr: '1' });
        }
    }

    listItem.children.push(...children);

    if (nrType) {
        listItem.meta.nrType = nrType;
    }

    if (styleNote) {
        listItem.meta.styleNote = styleNote;
    }

    if (type === MetaType.CHAPTER) {
        listItem.meta.nrType = 'roman';
        listItem.meta.romanNr = romanNr ?? convertRomanNumber(nr);
    }

    if (type === MetaType.NUMART && !nrType) {
        listItem.meta.nrType = 'numeric';
    }

    return listItem;
};
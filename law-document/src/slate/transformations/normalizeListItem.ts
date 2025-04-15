import { Editor, Node, Path, Text, Transforms } from 'slate';
import { TAGS } from '../config/tags';
import { ListItemWithMeta } from '../element/ListItem';
import { isListItemText } from '../element/ListItemText';
import { isTitle } from '../element/TextNode';
import { isListItemWithMeta } from '../query/isListItemWithMeta';
import { createListItemText } from './createListItemText';
import { setListItemTitleFromMeta } from './setListItemTitleFromMeta';

export const normalizeListItem = (editor: Editor, path: Path, select = true) => {
    const listItem = Node.get(editor, path);

    if (!isListItemWithMeta(listItem)) {
        throw new Error('normalizeListItem: listItem is not a ListItemWithMeta');
    }

    const tagConfig = TAGS[listItem.meta.type];
    const shouldHaveTitle = tagConfig.hasTitle && listItem.meta.title;
    const shouldHaveName = tagConfig.hasName && listItem.meta.name;
    const hasTextContent = listItem.children.some(child => 
        isListItemText(child) && child.children.some(text => 
            Text.isText(text) && text.text.length > 0
        )
    );

    // if there is no text content and no title or name, remove the list item text
    if (!(hasTextContent || shouldHaveTitle || shouldHaveName)) {
        listItem.children = listItem.children.filter(child => !isListItemText(child));
    }

    // if there is only one child and it is not a list item text, create a new list item text
    if ((listItem.children.length === 1 && !isListItemText(listItem.children[0])) || listItem.children.length === 0) {
        const listItemText = createListItemText();
        Transforms.insertNodes(editor, listItemText, { at: [...path, 0] });

        setListItemTitleFromMeta(editor, path, listItem.meta, select);
        return true;
    }

    const listItemText = listItem.children[0];

    if (!isListItemText(listItemText)) {
        return false;
    }

    const hasTitleText = listItemText.children.find(n => Text.isText(n) && n.title);
    
    if (listItem.meta.title && (!hasTitleText || hasTitleText.text === '' || !hasTitleCorrectNumber(listItem))) {
        setListItemTitleFromMeta(editor, path, listItem.meta, select);
        return true;
    }

    return false;
};

const hasTitleCorrectNumber = (listItem: ListItemWithMeta) => {
    const listItemText = listItem.children.find(isListItemText);
    const title = listItemText?.children.find(isTitle);
    const nr = listItem.meta.nr;

    if (!title) {
        return false;
    }

    return title.text.includes(nr);
};
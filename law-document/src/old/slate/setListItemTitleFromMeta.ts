import { Editor, Transforms } from 'slate';
import { ListItemMeta } from '../../slate/element/ListItem';
import { createLawTitle } from './createLawTitle';
import { getListItemTitle } from './getListItemTitle';
import { getPreviousSibling } from './getPreviousSibling';

/**
 * Update title of ListItem node based on new meta
 * @param editor Slate editor instance
 * @param path to ListItem node
 * @param meta new meta of ListItem node
 */
export const setListItemTitleFromMeta = (editor: Editor, path: number[], meta: ListItemMeta, select = true) => {
    const sibling = getPreviousSibling(editor, path);
    const siblingTitle = sibling && getListItemTitle(editor, sibling[1]);
    const previousTitle = getListItemTitle(editor, path);
    const titlePath = [...path, 0, 0];

    if (meta.title) {
        const title = createLawTitle(meta.nr, meta.type, previousTitle ?? siblingTitle );
        const at = { anchor: { path: titlePath, offset: 0 }, focus: { path: titlePath, offset: 0 } };

        // replace existing title
        if (previousTitle) {
            at.focus.offset = previousTitle.length;
        }

        Transforms.insertNodes(editor, { text: title, title: true }, { at, select });
    }
};
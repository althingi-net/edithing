import { Editor, Transforms } from 'slate';
import { TAGS } from '../config/tags';
import { findListItemAtSelection } from '../slate/findListItemAtSelection';
import { findListItemMarkedText } from '../slate/findListItemMarkedText';
import { isSelectionAtTitle } from '../slate/isSelectionAtTitle';
import {createLawList} from './createLawList';

export const pressEnterKey = (editor: Editor) => {
    const [listItem, path] = findListItemAtSelection(editor) ?? [];

    if (!listItem || !path || !listItem.meta) {
        return false;
    }

    const { type } = listItem.meta;
    const config = TAGS[type];

    if (config.hasName && isSelectionAtTitle(editor)) {
        const name = findListItemMarkedText(editor, 'name', path);
        
        if (!name) {
            const title = findListItemMarkedText(editor, 'title', path);

            if (!title) {
                throw new Error('Could not find title');
            }

            Transforms.select(editor, { path: title[1], offset: title[0].text.length });
            editor.addMark('name', true);
            editor.removeMark('title');
        } else {
            Transforms.select(editor, { path: name[1], offset: name[0].text.length });
        }

        return true;
    }

    createLawList(editor, type, path, { bumpVersionNumber: true });

    return true;
};
import { Editor, Location } from 'slate';
import { isList } from '../element/List';

/**
 * Retrieves the next list in the hierarchy above the given location.
 * @param editor Editor
 * @param at location to search at
 * @returns ancestor list
 */
export const getParentList = (editor: Editor, at: Location) => {
    return editor.above({
        at,
        match: isList,
    });
};
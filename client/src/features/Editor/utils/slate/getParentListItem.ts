import { Editor, Location, NodeEntry } from 'slate';
import ListItem, { isListItem, ListItemWithMeta } from '../../elements/ListItem';
import isListItemWithMeta from './isListItemWithMeta';

/**
 * Retrieves the next list item in the hierarchy above the given location.
 * @param editor Editor
 * @param at location to search at
 * @returns ancestor list item
 */
const getParentListItem = (editor: Editor, at: Location): NodeEntry<ListItemWithMeta> | null => {
    const parentListItem = editor.above<ListItem>({
        at,
        match: isListItem,
    });

    if (!parentListItem) {
        return null;
    }

    const [parent] = parentListItem;

    if (!isListItemWithMeta(parent)) {
        return null;
    }

    return [parent, parentListItem[1]];

};

export default getParentListItem;

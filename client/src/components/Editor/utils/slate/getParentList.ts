import { Editor, Location } from 'slate';
import { isList } from '../../Slate';

/**
 * Retrieves the next list in the hierarchy above the given location.
 * @param editor Editor
 * @param at location to search at
 * @returns ancestor list
 */
const getParentList = (editor: Editor, at: Location) => {
    return editor.above({
        at,
        match: isList,
    });
};

export default getParentList;

import { Node, Path } from 'slate';
import { findNode } from '../findNode';
import { getListItemHierarchy } from '../query/getListItemHierarchy';

/**
 * Return an id to identify a law paragraph down to the sentence level.
 * @param root Editor root node.
 * @param path Path to the lowest level node.
 * @param original If true, return the id using originNr instead of nr.
 * @returns Example: 'chapter-1.art-2.subart-1' or null if the path is invalid.
 */
export const getParagraphId = (root: Node, path: Path, original = false) => {
    const node = findNode(root, path);

    if (!node) {
        return null;
    }

    const levels = getListItemHierarchy(root, path);
    const ids: string[] = [];

    for (const level of levels) {
        const [listItem] = level;
        if (!listItem.meta) {
            return null;
        }

        const { type, nr, originNr } = listItem.meta;

        if (original && !originNr) {
            return null;
        }

        ids.push(`${type}-${original ? originNr : nr}`);
    }

    return ids.join('.');
};
// import { ListType, onKeyDown } from "@prezly/slate-lists";
import isHotkey from 'is-hotkey';
// import { KeyboardEvent } from "react";
// import { Editor, Element, Location, Node, NodeEntry, Path, Point, Range, Span, Transforms } from "slate";
// import { NESTED_LIST_PATH_INDEX, schema } from "../Slate";

import { onKeyDown } from '@prezly/slate-lists';
import { KeyboardEvent } from 'react';
import { Editor } from 'slate';

// const isTabKey = isHotkey('tab');
// const isShiftTabKey = isHotkey('shift+tab');
const isEnterKey = isHotkey('enter');

const handleKeyDown = (editor: Editor, event: KeyboardEvent<HTMLDivElement>) => {
    // return onTabIncreaseListDepth(editor, event)
        
    if (isEnterKey(event)) {
        event.preventDefault();
        console.log('enter key pressed');
        return true;
    }

    // if (isShiftTabKey(event)) {
    //     const anchorPath = editor.selection?.anchor.path;
    //     const focusPath = editor.selection?.focus.path;

    //     if (anchorPath && focusPath) {
    //         // const node = findListItemAtSelection()
    //         // TODO: check for list item and if there is another parent above, if not do nothing
    //     }
    // }

    return onKeyDown(editor, event);
};

// export function onTabIncreaseListDepth(editor: Editor, event: KeyboardEvent) {
//     if (isTabKey(event)) {
//         event.preventDefault();
//         return increaseDepth(editor);
//     }
//     return false;
// }

// /**
//  * Increases nesting depth of all "list-items" in the current selection.
//  * All nodes matching options.wrappableTypes in the selection will be converted to "list-items" and wrapped in a "list".
//  *
//  * @returns {boolean} True, if the editor state has been changed.
//  */
// export function increaseDepth(
//     editor: Editor, 
//     at: Location | null = editor.selection,
// ): boolean {
//     if (!at) {
//         return false;
//     }

//     const listItems = getListItems(editor, at);
//     const indentableListItems = listItems.filter(([, listItemPath]) => {
//         const previousListItem = getPrevSibling(editor, listItemPath);
//         return previousListItem !== null;
//     });

//     if (indentableListItems.length === 0) {
//         return false;
//     }

//     // When calling `increaseListItemDepth` the paths and references to list items
//     // can change, so we need a way of marking the list items scheduled for transformation.
//     const refs = pickSubtreesRoots(indentableListItems).map(([_, path]) =>
//         Editor.pathRef(editor, path),
//     );

//     Editor.withoutNormalizing(editor, () => {
//         // Before we indent "list-items", we want to convert every non list-related block in selection to a "list".
//         wrapInList(editor);

//         refs.forEach((ref) => {
//             if (ref.current) {
//                 increaseListItemDepth(editor, ref.current);
//             }
//             ref.unref();
//         });
//     });

//     return true;
// }

// /**
//  * Increases nesting depth of "list-item" at a given Path.
//  */
// export function increaseListItemDepth(
//     editor: Editor,
//     listItemPath: Path,
// ): boolean {
//     const previousListItem = getPrevSibling(editor, listItemPath);

//     if (!previousListItem) {
//         // The existence of previous "list-item" is necessary and sufficient for the operation to be possible.
//         // See: https://en.wikipedia.org/wiki/Necessity_and_sufficiency
//         return false;
//     }

//     const [previousListItemNode, previousListItemPath] = previousListItem;

//     if (!schema.isListItemNode(previousListItemNode)) {
//         // Sanity check.
//         return false;
//     }

//     const previousListItemChildListPath = [...previousListItemPath, NESTED_LIST_PATH_INDEX];
//     const previousListItemHasChildList = Node.has(editor, previousListItemChildListPath);

//     let changed = false;

//     Editor.withoutNormalizing(editor, () => {
//         // Ensure there's a nested "list" in the previous sibling "list-item".
//         if (!previousListItemHasChildList) {
//             Transforms.insertNodes(
//                 editor,
//                 schema.createListNode(ListType.UNORDERED, { children: [] }),
//                 {
//                     at: previousListItemChildListPath,
//                 },
//             );
//             changed = true;
//         }

//         const previousListItemChildList = Node.get(editor, previousListItemChildListPath);

//         if (
//             Element.isElement(previousListItemChildList) &&
//             schema.isListNode(previousListItemChildList)
//         ) {
//             const index = previousListItemHasChildList
//                 ? previousListItemChildList.children.length
//                 : 0;

//             Transforms.moveNodes(editor, {
//                 at: listItemPath,
//                 to: [...previousListItemChildListPath, index],
//             });

//             changed = true;
//         }
//     });

//     return changed;
// }


// export function getPrevSibling(editor: Editor, path: Path): NodeEntry | null {
//     let previousSiblingPath: Path;

//     try {
//         previousSiblingPath = Path.previous(path);
//     } catch (error) {
//         // Unable to calculate `Path.previous`, which means there is no previous sibling.
//         return null;
//     }

//     if (Node.has(editor, previousSiblingPath)) {
//         return [Node.get(editor, previousSiblingPath), previousSiblingPath];
//     }

//     return null;
// }

// /**
//  * Will return a minimal subset of the given nodes that includes the rest of the given nodes as descendants.
//  *
//  * Example:
//  *           ROOT
//  *         /     \
//  *        /       \
//  *       A         B
//  *     / | \     / | \
//  *    A1 A2 A3  B1 B2 B3
//  *   /       \         \
//  *  A11      A31       B31
//  *
//  * A is the subtree root that includes every other node:
//  * - pickSubtreesRoots([A, A1, A2, A3, A31]) === [A]
//  *
//  * A and B1 are the subtree roots that include every other node:
//  * - pickSubtreesRoots([A, A1, A2, A3, A31, B1]) === [A, B1]
//  *
//  * A, B1, B2, and B3 are the subtree roots that include every other node:
//  * - pickSubtreesRoots([A, A1, A2, A3, A31, B1, B2, B3, B31]) === [A, B1, B2, B3]
//  *
//  * A and B are the subtree roots that include every other node:
//  * - pickSubtreesRoots([A, A1, A2, A3, A31, B, B1, B2, B3, B31]) === [A, B]
//  */
// export function pickSubtreesRoots(entries: NodeEntry<Node>[]): NodeEntry<Node>[] {
//     return entries.filter(([, nodePath]) => {
//         const ancestors = Path.ancestors(nodePath);

//         return !ancestors.some((ancestor) => {
//             return entries.some(([, path]) => Path.equals(path, ancestor));
//         });
//     });
// }

// /**
//  * All nodes matching `isConvertibleToListTextNode()` in the current selection
//  * will be converted to list items and then wrapped in lists.
//  *
//  * @see ListsSchema.isConvertibleToListTextNode()
//  */
// export function wrapInList(
//     editor: Editor,
//     at: Location | null = editor.selection,
// ): boolean {
//     if (!at) {
//         return false;
//     }

//     const nonListEntries = Array.from(
//         Editor.nodes(editor, {
//             at,
//             match: (node) => {
//                 return (
//                     Element.isElement(node) &&
//                     !schema.isListNode(node) &&
//                     !schema.isListItemNode(node) &&
//                     !schema.isListItemTextNode(node) &&
//                     schema.isConvertibleToListTextNode(node)
//                 );
//             },
//         }),
//     );

//     if (nonListEntries.length === 0) {
//         return false;
//     }

//     const refs = nonListEntries.map(([_, path]) => Editor.pathRef(editor, path));

//     refs.forEach((ref) => {
//         const path = ref.current;
//         if (path) {
//             Editor.withoutNormalizing(editor, () => {
//                 Transforms.setNodes(editor, schema.createListItemTextNode(), { at: path });
//                 Transforms.wrapNodes(editor, schema.createListItemNode(), { at: path });
//                 Transforms.wrapNodes(editor, schema.createListNode(ListType.ORDERED), { at: path });
//             });
//         }
//         ref.unref();
//     });

//     return true;
// }

// /**
//  * Returns all "list-items" in a given Range.
//  */
// export function getListItems(
//     editor: Editor,
//     at: Location | Span | null = editor.selection,
// ): NodeEntry<Element>[] {
//     if (!at) {
//         return [];
//     }

//     const start = getLocationStart(at);
//     const listItems = Editor.nodes(editor, {
//         at,
//         match: schema.isListItemNode,
//     });

//     return Array.from(listItems).filter(([, path]) => {
//         const [, grandparent] = Path.ancestors(start, { reverse: true });
//         const rangeIsGrandhild = Path.equals(path, grandparent);
//         const rangeIsDescendant = Path.isDescendant(start, path);
//         const rangeStartsAfter = Path.isAfter(start, path);

//         if (rangeIsDescendant) {
//             // There's just one case where we want to include a "list-item" that is
//             // an ancestor of the range starting point - when it's a grandparent of that point.
//             // It's because the selection starting point will be in a grandchild `{ text: '' }` node.
//             // <h-li>                       <--- grandparent
//             //     <h-li-text>
//             //         <h-text>             <--- grandchild
//             //             <anchor />       <--- range starting point
//             //         </h-text>
//             //     </h-li-text>
//             // </h-li>
//             // Other ancestors are not "visually" in selection, but they are returned by `Editor.nodes`.
//             return !rangeStartsAfter && rangeIsGrandhild;
//         }

//         return !rangeStartsAfter;
//     }) as NodeEntry<Element>[];
// }

// function getLocationStart(location: Location | Span): Path {
//     if (Range.isRange(location)) {
//         return Range.start(location).path;
//     }
//     if (Point.isPoint(location)) {
//         return location.path;
//     }
//     if (Span.isSpan(location)) {
//         const [start, end] = location;
//         return Path.compare(start, end) <= 0 ? start : end;
//     }
//     return location;
// }

export default handleKeyDown;
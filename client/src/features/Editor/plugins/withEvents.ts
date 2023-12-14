import { BaseEditor, Editor, Node, Operation, Text } from 'slate';
import { log } from '../../../logger';
import { ElementType, isListItem, isListItemMeta } from '../Slate';
import getParagraphId from '../utils/changelog/getParagraphId';
import decrementFollowingSiblings from '../utils/slate/decrementFollowingSiblings';

const PRE_PARSE_OPERATIONS: Operation['type'][] = ['remove_node', 'remove_text'];

export interface Event {
    id: string;
    originId: string;
    type: 'added' | 'removed' | 'changed';
}

export interface EventsEditor extends BaseEditor {
    events: Event[];
}


/**
 * Logs all operations to the editor.events array with unique ids to be used for compareDocuments().  
 * One action of the user can result in multiple operations.
 * For example the list plugin will try to maintain the list structure 
 * and generates operations to move nodes into place.
 */
const withEvents = (editor: Editor) => {
    const { apply, undo } = editor;
    let saveEvents = true;

    editor.events = [];

    editor.apply = (operation) => {
        if (operation.type === 'set_selection' || !saveEvents) {
            apply(operation);
            decrementOnRemoveListItem(editor, operation);
            return;
        }
        
        if (PRE_PARSE_OPERATIONS.includes(operation.type)) {
            applyOperation(editor, operation);
        }
        
        apply(operation);
        
        if (!PRE_PARSE_OPERATIONS.includes(operation.type)) {
            applyOperation(editor, operation);
        }

        decrementOnRemoveListItem(editor, operation);
    };

    editor.undo = () => {
        undoOperation(editor);

        saveEvents = false;
        undo();
        saveEvents = true;
    };

    return editor;
};

const decrementOnRemoveListItem = (editor: Editor, operation: Operation) => {
    if (operation.type === 'remove_node') {
        const { node } = operation;

        if (isListItem(node)) {
            decrementFollowingSiblings(editor, operation.path);
        }
    }
};

const undoOperation = (editor: Editor) => {
    const { history } = editor;

    if (!history.undos.length) {
        return;
    }

    const { operations } = history.undos[history.undos.length - 1];

    [...operations]
        .reverse()
        .forEach((operation) => {
            const event = parseOperation(editor, operation);

            if (event) {
                const oldEvent = findEvent(editor, event.id);
            
                if (oldEvent && oldEvent.type === event.type && event.type !== 'changed') {
                    log('event undo', event);
                    removeEvent(editor, event.id);
                }
            }
        });
};

const applyOperation = (editor: Editor, operation: Operation) => {
    let event = parseOperation(editor, operation);
    event = validateEvent(editor, operation.type, event);

    if (event) {
        addEvent(editor, event);
    }
};

/**
 * Parse slate editor operations and generate events for compareDocuments().
 * Each text node belonging to a list item has a unique id consisting of the hierarchy of list items and their list number.
 * Events are not created for empty text node operations (because they are mostly normalizations by the editor).
 * Split_node creates two events via two operations (split_node & set_node)
 * Each id will only have 0-1 events logged, see addEvent() for special cases of when events do not replace previous events.
 * @param editor slate editor instance
 * @param operation slate operation from calls of editor.apply 
 */
const parseOperation = (editor: Editor, operation: Operation): Event | null => {
    const { type } = operation;
    
    if (type === 'set_selection') {
        return null;
    }
    const id = getParagraphId(editor, operation.path);
    const originId = getParagraphId(editor, operation.path, true) ?? '';
    log('apply', operation, { id, originId });

    if (id == null) {
        log('Couldn\'t find id', operation, { id, originId });
        return null;
    }

    if (type === 'set_node' && originId) {
        const { meta, newMeta } = getOperationMeta(operation);

        if (newMeta && meta) {
            // Remove event on decrementing list number
            if (meta.nr > newMeta.nr) {
                const oldId = replaceIdsLastNr(id, meta.nr);
                removeEvent(editor, oldId);
            }

            return { 
                id,
                originId,
                type: 'changed',
            };
        }
    }

    if (type === 'split_node') {
        const { properties } = operation;

        if ('type' in properties && properties.type === ElementType.LIST_ITEM) {
            return { id, originId, type: 'added' };
        }
    }

    if (type === 'remove_node') {
        const { node } = operation;

        if (hasText(node)) {
            return { id, originId, type: 'changed' };
        }

        if (isListItem(node)) {
            return { id, originId, type: 'removed' };
        }
    }

    if (type === 'remove_text' || type === 'insert_text') {
        return { id, originId, type: 'changed' };
    }

    if (type === 'insert_node') {
        const node = operation.node;
        if (hasText(node)) {
            return { id, originId, type: 'changed' };
        }

        if (isListItem(node)) {
            return { id, originId, type: 'added' };
        }
    }

    return null;
};

const hasText = (node: Node) => {
    return Text.isText(node) && node.text !== '';
};

const validateEvent = (
    editor: Editor,
    type: Omit<Operation['type'], 'set_selection'>,
    event?: Event | null,
) => {
    if (!event) {
        return null;
    }

    const oldEvent = findEvent(editor, event.id);

    if (!oldEvent) {
        return event;
    }
    
    // ignore duplicate events
    if (oldEvent.originId === event.originId && oldEvent.type === event.type) {
        log('event ignored', event, findEvent(editor, event.id));
        return null;
    }

    // remove event if the listItem was added and then removed
    if (oldEvent.type === 'added' && event.type === 'removed') {
        log('event removed', event, findEvent(editor, event.id));
        removeEvent(editor, event.id);
        return null;
    }

    // a new listItem can ignore further mutations (but not split_node, because it moves content)
    const isTextOperation = type === 'insert_text' || type === 'remove_text';
    const isNodeOperation = type === 'insert_node' || type === 'remove_node';
    
    if (isTextOperation || isNodeOperation) {
        if (oldEvent.type === 'added') {
            log('event ignored', event, findEvent(editor, event.id));
            return null;
        }
    }

    return event;
};

const addEvent = (editor: Editor, event: Event) => {
    log('event', event);
    removeEvent(editor, event.id);
    editor.events.push(event);
};

const removeEvent = (editor: Editor, id: string) => {
    editor.events = editor.events.filter(event => event.id !== id);
};

const findEvent = (editor: Editor, id: string, type?: Event['type']) => {
    return editor.events.find(event => event.id === id && (!type || event.type === type));
};

const getOperationMeta = (operation: Operation) => {
    let meta;
    let newMeta;

    if (operation.type === 'set_node') {
        if ('meta' in operation.properties && isListItemMeta(operation.properties.meta)) {
            meta = operation.properties.meta;
        }
        if ('meta' in operation.newProperties && isListItemMeta(operation.newProperties.meta)) {
            newMeta = operation.newProperties.meta;
        }
    }

    return {
        newMeta,
        meta,
    };
};

const replaceIdsLastNr = (id: string, nr: string) => {
    const levels = id.split('.');
    const parts = levels[levels.length - 1].split('-');
    parts[parts.length - 1] = nr;
    levels[levels.length - 1] = parts.join('-');
    return levels.join('.');
};

export default withEvents;
import { BaseEditor, Editor, Node, Operation, Text } from 'slate';
import { log } from '../../../logger';
import { ElementType, isListItemMeta } from '../Slate';
import getParagraphId from '../utils/changelog/getParagraphId';

const PRE_PARSE_OPERATIONS: Operation['type'][] = ['remove_node', 'remove_text'];

export interface Event {
    id: string;
    type: 'added' | 'removed' | 'changed';
    moved?: boolean;
    from?: string;
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
    const { apply } = editor;

    editor.events = [];

    editor.apply = (operation) => {
        if (operation.type === 'set_selection') {
            return apply(operation);
        }
        
        if (PRE_PARSE_OPERATIONS.includes(operation.type)) {
            parseOperation(editor, operation);
        }
        
        apply(operation);
        
        if (!PRE_PARSE_OPERATIONS.includes(operation.type)) {
            parseOperation(editor, operation);
        }
    };

    return editor;
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
const parseOperation = (editor: Editor, operation: Operation) => {
    const { type } = operation;
    
    if (type === 'set_selection') {
        return;
    }
    const id = getParagraphId(editor, operation.path);
    log('apply', operation, id);

    if (!id) {
        log('Couldn\'t find id', operation);
        return;
    }

    if (type === 'set_node') {
        const { meta, newMeta } = getOperationMeta(operation);
        
        if (newMeta && meta) {
            const hasChangedNr = meta.nr !== newMeta.nr;
            addEvent(editor, { id, type: 'changed', moved: hasChangedNr, from: moveParagraphId(id, meta.nr) });
        }
    }

    if (type === 'split_node') {
        const { properties } = operation;

        if ('type' in properties && properties.type === ElementType.LIST_ITEM) {
            addEvent(editor, { id, type: 'added' });
        }
    }

    if (type === 'remove_node') {
        const { node } = operation;

        if (hasText(node)) {
            addEvent(editor, { id, type: 'removed' });
        }
    }

    if (type === 'remove_text' || type === 'insert_text') {
        addEvent(editor, { id, type: 'changed' });
    }

    if (type === 'insert_node') {
        const node = operation.node;
        if (hasText(node)) {
            addEvent(editor, { id, type: 'added' });
        }
    }

};

const hasText = (node: Node) => {
    return Text.isText(node) && node.text !== '';
};

const moveParagraphId = (id: string, newNr: string) => {
    const idArray = id.split('');
    idArray[id.length - 1] = newNr;
    return idArray.join('');
};

const addEvent = (editor: Editor, event: Event) => {
    // If paragraph is new, any following changes can be ignored
    if (hasEvent(editor, event.id, 'added')) {
        return;
    }
    
    // If paragraph was changed, any following changes can be ignored
    if (hasEvent(editor, event.id, 'changed') && event.type !== 'removed') {
        return;
    }

    if (hasEvent(editor, event.id, 'removed')) {
        event = { ...event, type: 'changed'};
    }

    log('event', event);
    removeEvent(editor, event.id);
    editor.events.push(event);
};

const removeEvent = (editor: Editor, id: string) => {
    editor.events = editor.events.filter(event => event.id !== id);
};

const hasEvent = (editor: Editor, id: string, type?: Event['type']) => {
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

export default withEvents;
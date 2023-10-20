import { BaseEditor, Editor, Operation } from 'slate';
import getParagraphId from '../utils/changelog/getParagraphId';
import { log } from '../../../logger';

const OPERATIONS_BEFORE = ['insert_text', 'remove_text', 'split_node', 'merge_node', 'move_node', 'remove_node', 'set_node'];
const OPERATIONS_AFTER = ['insert_node', 'set_node'];

export interface Event {
    id: string;
    type: Operation['type'];

    /** For debugging, missing in production */
    original?: Operation;
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
    const { apply, onChange } = editor;

    editor.events = [];

    editor.apply = (operation) => {
        log('editor apply', operation);

        if (!operation
            || !OPERATIONS_BEFORE.includes(operation.type)
            || operation.type === 'set_selection'
        ) {
            return apply(operation);
        }

        const id = getParagraphId(editor, operation.path);

        if (id) {
            const event: Event = { id, type: operation.type };
    
            if (process.env.NODE_ENV !== 'production') {
                event.original = operation;
            }
            
            editor.events.push(event);
            log('event', event);
        }

        return apply(operation);
    };

    editor.onChange = (options) => {
        const operation = options?.operation;

        log('editor onChange', operation);
        
        if (!operation
            || !OPERATIONS_AFTER.includes(operation.type)
            || operation.type === 'set_selection'
        ) {
            return onChange(options);
        }

        const id = getParagraphId(editor, operation.path);

        if (id) {
            const event: Event = { id, type: operation.type };
    
            if (process.env.NODE_ENV !== 'production') {
                event.original = operation;
            }
    
            editor.events.push(event);
            log('event', event);
        }

        return onChange(options);
    };

    return editor;
};

export default withEvents;

export const withNavigationBlock = (editor: Editor) => {
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
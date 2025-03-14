import { LawEditor } from 'law-document';
import { useCallback } from 'react';

export interface NavigationBlocker {
    blockNavigation: () => void;
    unblockNavigation: () => void;
    isNavigationBlocked: boolean;
}

const useEditorNavigationBlock = (editor: LawEditor, navigationBlocker: NavigationBlocker, saveDocument?: (editor: LawEditor) => void) => {
    const { isNavigationBlocked, blockNavigation, unblockNavigation } = navigationBlocker;

    const handleChange = useCallback(() => {
        if (editor.operations.length === 0) {
            return;
        }

        if (editor.operations.some((op) => op.type === 'set_selection')) {
            return;
        }

        if (!isNavigationBlocked) {
            blockNavigation();
        }
    }, [blockNavigation, editor.operations, isNavigationBlocked]);

    const handleSave = useCallback(() => {
        if (isNavigationBlocked) {
            unblockNavigation();
        }

        if (saveDocument) {
            saveDocument(editor);
        }
    }, [editor, isNavigationBlocked, saveDocument, unblockNavigation]);

    return {
        handleChange,
        handleSave,
    };
};

export default useEditorNavigationBlock;
import { LawEditor } from 'law-document';
import { useCallback } from 'react';
import useBlockNavigation from '../App/useBlockNavigation';

const useEditorNavigationBlock = (editor: LawEditor, saveDocument: (editor: LawEditor) => void) => {
    const { isNavigationBlocked, blockNavigation, unblockNavigation } = useBlockNavigation();

    const handleChange = useCallback(() => {
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

        saveDocument(editor);
    }, [editor, isNavigationBlocked, saveDocument, unblockNavigation]);

    return {
        handleChange,
        handleSave,
    };
};

export default useEditorNavigationBlock;
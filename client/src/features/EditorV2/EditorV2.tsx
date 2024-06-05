import { FC } from 'react';
import { useStore } from 'zustand';
import { Button } from 'antd';
import { useEditorState } from './EditorStateContext';
import FlatEditorNode from './FlatEditorNode';
import styles from './EditorV2.module.css';

const EditorV2: FC = () => {
    const { store } = useEditorState();
    const { undoable, editable, editMenu } = useStore(store, (state) => state.config);
    const rootNodes = useStore(store, (state) => state.nodes.roots);
    const { undo, redo } = store.temporal.getState();

    if (!rootNodes?.length) {
        return null;
    }

    const content = rootNodes.map((id) => (
        <FlatEditorNode
            key={id}
            nodeId={id}
        />
    ));

    const undoableContent = undoable ? (
        <>
            <Button onClick={() => undo()}>Undo</Button>
            <Button onClick={() => redo()}>Redo</Button>
        </>
    ) : null;

    return (
        <div className={styles.editor}>
            {editable && (
                <div className={styles.actions}>
                    {undoableContent}
                    <Button onClick={() => redo()}>Import XML</Button>
                    <Button onClick={() => redo()}>Export XML</Button>
                </div>
            )}
            <div className={styles.content}>
                {content}
            </div>
        </div>
    );
};

export default EditorV2;
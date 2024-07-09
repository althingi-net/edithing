import { Switch } from 'antd';
import { FC } from 'react';
import { useStore } from 'zustand';
import { useEditorState } from './EditorStateContext';
import styles from './EditorV2.module.css';
import FlatEditorNode from './FlatEditorNode';

const EditorV2: FC = () => {
    const { store, setEditMenu } = useEditorState();
    const { undoable, editable, editMenu } = useStore(store, (state) => state.config);
    const rootNodes = useStore(store, (state) => state.rootNodes);

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
            {/* <Button onClick={() => undo()}>Undo</Button>
            <Button onClick={() => redo()}>Redo</Button> */}
        </>
    ) : null;

    return (
        <div className={styles.editor}>
            {editable && (
                <div className={styles.actions}>
                    {undoableContent}
                    {/* <Button onClick={() => redo()}>Import XML</Button>
                    <Button onClick={() => redo()}>Export XML</Button> */}
                    <Switch
                        title='Edit Menu'
                        checked={editMenu}
                        onClick={() => setEditMenu(!editMenu)}
                        checkedChildren={'On'}
                        unCheckedChildren={'Off'}
                    />
                </div>
            )}
            <div className={styles.content}>
                {content}
            </div>
        </div>
    );
};

export default EditorV2;
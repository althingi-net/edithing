import { FC } from 'react';
import { useStore } from 'zustand';
import { Button } from 'antd';
import { useEditorState } from './EditorStateContext';
import FlatEditorNode from './FlatEditorNode';

const EditorV2: FC = () => {
    const { store } = useEditorState();
    const { undoable } = useStore(store, (state) => state.config);
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
        <>
            <div>
                {undoableContent}
            </div>
            {content}
        </>
    );
};

export default EditorV2;
import { FC } from 'react';
import { useStore } from 'zustand';
import { useEditorState } from './EditorStateContext';
import FlatEditorNode from './FlatEditorNode';

const EditorV2: FC = () => {
    const { store } = useEditorState();
    const rootNodes = useStore(store, (state) => state.nodes.roots);

    if (!rootNodes?.length) {
        return null;
    }

    const content = rootNodes.map((id) => (
        <FlatEditorNode
            key={id}
            nodeId={id}
        />
    ));

    return (
        <>
            {content}
        </>
    );
};

export default EditorV2;
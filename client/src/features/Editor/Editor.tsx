// import { YjsEditor, slateNodesToInsertDelta, withYjs } from '@slate-yjs/core';
// import * as Y from 'yjs';
import { Col, Row } from 'antd';
import { FC, useMemo, useState } from 'react';
import { Descendant } from 'slate';
import { Editable, Slate } from 'slate-react';
import './Editor.css';
import EditorSidePanel from './EditorSidePanel';
import HoveringToolbar from './Toolbar/HoverToolbar';
import SideToolbar from './Toolbar/SideToolbar';
import Toolbar from './Toolbar/Toolbar';
import useHighlightContext from './Toolbar/useHighlightContext';
import createEditorWithPlugins from './plugins/createEditorWithPlugins';
import handleKeyDown from './plugins/handleKeyDown';
import renderElement from './plugins/renderElement';
import renderLeaf from './plugins/renderLeaf';

interface Props {
    slate: Descendant[];
    originalDocument: Descendant[];
    xml: string;
}

const Editor: FC<Props> = ({ slate, originalDocument, xml }) => {
    const highlight = useHighlightContext();

    // NOTE: turning realtime collaboration off for now
    // const sharedType = useMemo(() => {
    //     const yDoc = new Y.Doc();
    //     const sharedType = yDoc.get('content', Y.XmlText) as Y.XmlText;
    
    //     // Load the initial value into the yjs document
    //     sharedType.applyDelta(slateNodesToInsertDelta(slate));
    
    //     return sharedType;
    // }, [slate]);

    // const editor = useMemo(() => withYjs(createEditorWithPlugins(), sharedType), [sharedType]);
    const editor = useMemo(() => createEditorWithPlugins(), []);
    const [value, setValue] = useState<Descendant[]>(slate);
    console.log('slate', slate);
    // useEffect(() => {
    //     YjsEditor.connect(editor);
    //     return () => YjsEditor.disconnect(editor);
    // }, [editor]);

    const classNames = [
        'editor',
        highlight?.isHighlighted ? 'highlighted' : ''
    ].join(' ');

    return (
        <Slate editor={editor} initialValue={value} onChange={setValue}>
            <div style={{ minHeight: 'calc(100vh - 160px)' }}>
                <Row gutter={16} style={{ height: '100%' }}>
                    <Col span={12}>
                        <div style={{ height: '100%' }}>
                            <Toolbar />
                            <HoveringToolbar />
                            <SideToolbar />
                            <Editable
                                className={classNames}
                                onKeyDown={(event) => handleKeyDown(editor, event)}
                                renderElement={renderElement}
                                renderLeaf={renderLeaf}
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        <EditorSidePanel xml={xml} originalDocument={originalDocument} />
                    </Col>
                </Row>
            </div>
        </Slate>
    );
};

export default Editor;

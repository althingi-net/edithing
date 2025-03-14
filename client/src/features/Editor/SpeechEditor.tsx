import { Col, Row } from 'antd';
import { createEditorWithPlugins as createLawEditor, SlateFragment } from 'law-document';
import { FC, useEffect, useMemo } from 'react';
import { Editable, Slate, withReact } from 'slate-react';
import './Editor.css';
import { useEditorConfig } from './EditorConfig';
import EditorSidePanel from './EditorSidePanel';
import HoveringToolbar from './Toolbar/HoverToolbar';
import SideToolbar from './Toolbar/SideToolbar';
import Toolbar from './Toolbar/Toolbar';
import renderElement from './plugins/renderElement';
import renderLeaf from './plugins/renderLeaf';

interface Props {
    slate: SlateFragment;
}

const SpeechEditor: FC<Props> = ({
    slate,
}) => {
    const highlight = useEditorConfig(state => state.highlightStructure);
    const editor = useMemo(() => withReact(createLawEditor()), []);

    useEffect(() => {
        editor.children = slate;
        editor.onChange();
    }, [slate, editor]);

    const classNames = [
        'editor',
        highlight ? 'highlighted' : ''
    ].join(' ');

    return (
        <Slate editor={editor} initialValue={slate}>
            <div style={{ height: 'calc(100vh - 104px)' }}>
                <Row gutter={16} style={{ height: '100%' }}>
                    <Col span={12} style={{ height: '100%' }}>
                        <div style={{ height: '100%' }}>
                            <HoveringToolbar />
                            <SideToolbar />
                            <Editable
                                className={classNames}
                                renderElement={renderElement}
                                renderLeaf={renderLeaf}
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        <Toolbar />
                        <EditorSidePanel isSpeech />
                    </Col>
                </Row>
            </div>
        </Slate>
    );
};

export default SpeechEditor;

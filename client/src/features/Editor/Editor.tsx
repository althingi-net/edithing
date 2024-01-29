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
    const editor = useMemo(() => createEditorWithPlugins(), []);
    const [value, setValue] = useState<Descendant[]>(slate);

    const classNames = [
        'editor',
        highlight?.isHighlighted ? 'highlighted' : ''
    ].join(' ');

    return (
        <Slate editor={editor} initialValue={value} onChange={setValue}>
            <div style={{ height: 'calc(100vh - 104px)' }}>
                <Row gutter={16} style={{ height: '100%' }}>
                    <Col span={12} style={{ height: '100%' }}>
                        <div style={{ height: '100%' }}>
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
                        <Toolbar />
                        <EditorSidePanel xml={xml} originalDocument={originalDocument} />
                    </Col>
                </Row>
            </div>
        </Slate>
    );
};

export default Editor;

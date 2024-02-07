import { Col, Row } from 'antd';
import { Event, LawEditor } from 'law-document';
import { FC, useEffect, useMemo } from 'react';
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
import useEditorNavigationBlock from './useEditorNaviationBlock';

interface Props {
    slate: Descendant[];
    originalDocument: Descendant[];
    events?: Event[];
    xml: string;
    readOnly?: boolean;
    saveDocument?: (editor: LawEditor) => void;
}

const Editor: FC<Props> = ({ slate, originalDocument, xml, readOnly, saveDocument, events }) => {
    const highlight = useHighlightContext();
    const editor = useMemo(() => {
        const newEditor = createEditorWithPlugins();
        newEditor.events = events || [];
        return newEditor;
    }, [events]);
    const { handleChange, handleSave } = useEditorNavigationBlock(editor, saveDocument);

    const classNames = [
        'editor',
        highlight.isHighlighted ? 'highlighted' : ''
    ].join(' ');

    return (
        <Slate editor={editor} initialValue={slate} onChange={handleChange}>
            <div style={{ height: 'calc(100vh - 104px)' }}>
                <Row gutter={16} style={{ height: '100%' }}>
                    <Col span={12} style={{ height: '100%' }}>
                        <div style={{ height: '100%' }}>
                            {readOnly ? null : (
                                <>
                                    <HoveringToolbar />
                                    <SideToolbar />
                                </>
                            )}
                            <Editable
                                className={classNames}
                                onKeyDown={(event) => handleKeyDown(editor, event)}
                                renderElement={renderElement}
                                renderLeaf={renderLeaf}
                                readOnly={readOnly}
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        { readOnly ? null : <Toolbar saveDocument={handleSave} /> }
                        <EditorSidePanel readOnly={readOnly} xml={xml} originalDocument={originalDocument} />
                    </Col>
                </Row>
            </div>
        </Slate>
    );
};

export default Editor;

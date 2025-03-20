import { Col, Row } from 'antd';
import { Bill } from 'client-sdk';
import { createEditorWithPlugins, LawEditor, SlateFragment } from 'law-document';
import React, { FC, useEffect, useMemo } from 'react';
import { Editable, Slate, withReact } from 'slate-react';
import handleKeyDown from './plugins/handleKeyDown';
import renderElement from './plugins/renderElement';
import renderLeaf from './plugins/renderLeaf';
import HoveringToolbar from './Toolbar/HoverToolbar';
import SideToolbar from './Toolbar/SideToolbar';
import Toolbar from './Toolbar/Toolbar';
import { Translator } from '../translations';
import { useEditorConfig } from './EditorConfig';
import EditorSidePanel from './EditorSidePanel';
import useEditorNavigationBlock, { NavigationBlocker } from './useEditorNaviationBlock';

const createEditor = () => {
    const editor = withReact(createEditorWithPlugins());

    return editor;
};

interface Props {
    slate: SlateFragment;
    originalDocument: SlateFragment;
    xml: string;
    readOnly?: boolean;
    saveDocument?: (editor: LawEditor) => void;
    bill?: Bill;
    navigationBlocker: NavigationBlocker;
    t: Translator;
}

export const Editor: FC<Props> = (props) => {
    const { slate, originalDocument, xml, readOnly, saveDocument, bill, navigationBlocker, t } = props;
    const hasHighlight = useEditorConfig(state => state.highlightStructure);
    const editor = useMemo(() => createEditor(), []);
    const { handleChange, handleSave } = useEditorNavigationBlock(editor, navigationBlocker, saveDocument);

    useEffect(() => {
        editor.children = slate;
        editor.onChange();
    }, [slate, editor]);

    const classNames = [
        'editor',
        hasHighlight ? 'highlighted' : ''
    ].join(' ');

    return (
        <Slate editor={editor} initialValue={slate} onChange={handleChange}>
            <div style={{ height: 'calc(100vh - 104px)' }}>
                <Row gutter={16} style={{ height: '100%' }}>
                    <Col span={12} style={{ height: '100%' }}>
                        <div style={{ height: '100%' }}>
                            {readOnly ? null : (
                                <>
                                    <HoveringToolbar t={t} />
                                    <SideToolbar t={t} />
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
                        { readOnly ? null : <Toolbar saveDocument={handleSave} bill={bill} t={t} navigationBlocker={navigationBlocker} /> }
                        <EditorSidePanel
                            t={t}
                            readOnly={readOnly}
                            xml={xml}
                            originalDocument={originalDocument}
                        />
                    </Col>
                </Row>
            </div>
        </Slate>
    );
};
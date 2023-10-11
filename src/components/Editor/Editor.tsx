import { Col, Row } from 'antd';
import { FC, useEffect, useState } from "react";
import { Descendant } from "slate";
import { Editable, Slate } from "slate-react";
import GithubFile from "../../models/GithubFile";
import './Editor.css';
import EditorSidePanel from './EditorSidePanel';
import Toolbar from './Toolbar/Toolbar';
import createEditorWithPlugins from './plugins/createEditorWithPlugins';
import handleKeyDown from './plugins/handleKeyDown';
import renderElement from './plugins/renderElement';
import renderLeaf from './plugins/renderLeaf';
import useDebounce from './utils/useDebounce';
import downloadGitFile from './utils/xml/downloadGitFile';
import importXml from './utils/xml/importXml';

interface Props {
    file: GithubFile;
}

const Editor: FC<Props> = ({ file }) => {
    const [editor] = useState(createEditorWithPlugins);
    const [originalDocument, setOriginalDocument] = useState<ReturnType<typeof importXml>>();
    const [slate, setSlate] = useState<Descendant[] | null>(null);
    const debouncedSlate = useDebounce(slate, 500);
    const [xml, setXml] = useState<string>();

    useEffect(() => {
        downloadGitFile(file.path).then(setXml);
    }, [file]);

    useEffect(() => {
        if (xml) {
            const result = importXml(xml);
            setOriginalDocument(result)
            setSlate(result.slate)
        }
    }, [xml]);

    if (!slate || !originalDocument || !debouncedSlate || !xml) {
        return null;
    }

    return (
        <Slate editor={editor} initialValue={slate} onChange={setSlate}>
            <div style={{ minHeight: 'calc(100vh - 160px)' }}>
                <Row gutter={16} style={{ height: '100%' }}>
                    <Col span={12}>
                        <div style={{ height: '100%' }}>
                            <Toolbar />
                            <Editable
                                className='editor'
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
        </Slate >
    )
}

export default Editor;

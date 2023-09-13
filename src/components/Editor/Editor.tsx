import { onKeyDown } from '@prezly/slate-lists';
import { Col, Collapse, Row } from 'antd';
import { FC, useEffect, useState } from "react";
import { CodeBlock } from 'react-code-blocks';
import { Descendant } from "slate";
import { Editable, Slate } from "slate-react";
import GithubFile from "../../models/GithubFile";
import { renderElement } from "./Slate";
import createEditorWithPlugins from './plugins/createEditorWithPlugins';
import exportXml from './utils/xml/exportXml';
import importXml from './utils/xml/importXml';
import downloadGitFile from './utils/xml/downloadGitFile';
import compareDocuments from './utils/changelog/compareDocuments';

interface Props {
    file: GithubFile;
}

const Editor: FC<Props> = ({ file }) => {
    console.log("Render Editor");
    const [editor] = useState(createEditorWithPlugins)
    const [originalDocument, setOriginalDocument] = useState<ReturnType<typeof importXml>>();
    const [value, setValue] = useState<Descendant[] | null>(null);
    const [xml, setXml] = useState<string>()

    useEffect(() => {
        downloadGitFile(file.path).then(setXml);
    }, [file]);

    useEffect(() => {
        if (xml) {
            const result = importXml(xml);
            setOriginalDocument(result)
            setValue(result.slate)
        }
    }, [xml]);

    if (!value || !originalDocument) {
        return null;
    }

    return (
        <div style={{ height: 'calc(100vh - 160px)' }}>
            <Row gutter={16} style={{ height: '100%' }}>
                <Col span={12}>
                    <div style={{ height: '100%' }}>
                        <Slate editor={editor} initialValue={value} onChange={setValue}>
                            <Editable
                                style={{ width: "100%", height: "100%", padding: "10px", border: "1px solid #ccc" }}
                                onKeyDown={(event) => onKeyDown(editor, event)}
                                renderElement={renderElement}
                            />
                        </Slate>
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{ height: '100%' }}>
                        <Collapse defaultActiveKey={[]} destroyInactivePanel>
                            <Collapse.Panel header="Old XML" key="1">
                                <CodeBlock
                                    text={xml}
                                    language={'xml'}
                                />
                            </Collapse.Panel>
                            <Collapse.Panel header="Slate" key="2">
                                <CodeBlock
                                    text={JSON.stringify(editor.children, null, 2)}
                                    language={'json'}
                                />
                            </Collapse.Panel>
                            <Collapse.Panel header="New XML" key="3">
                                <CodeBlock
                                    text={exportXml(editor, true, originalDocument.meta)}
                                    language={'xml'}
                                />
                            </Collapse.Panel>
                            <Collapse.Panel header="Changes" key="4">
                                <CodeBlock
                                    text={JSON.stringify(compareDocuments(originalDocument.slate, editor), null, 2)}
                                    language={'json'}
                                />
                            </Collapse.Panel>
                        </Collapse>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Editor;

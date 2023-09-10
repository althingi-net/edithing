import { onKeyDown, withLists } from '@prezly/slate-lists';
import { Col, Collapse, Row, Space } from 'antd';
import { FC, useEffect, useState } from "react";
import { CodeBlock } from 'react-code-blocks';
import { Descendant, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import GithubFile from "../../models/GithubFile";
import compareDocuments from '../../utils/compareDocuments';
import convertSlateToXml from '../../utils/convertSlateToXml';
import convertXmlToSlate from '../../utils/convertXmlToSlate';
import downloadGitFile from "../../utils/downloadGitFile";
import { renderElement, schema } from "./Slate";

interface Props {
    file: GithubFile;
}

const Editor: FC<Props> = ({ file }) => {
    console.log("Render Editor");
    const [editor] = useState(() => withLists(schema)(withHistory(withReact(createEditor()))))
    const [originalDocument, setOriginalDocument] = useState<string>('');
    const [value, setValue] = useState<Descendant[] | null>(null);

    useEffect(() => {
        downloadGitFile(file.path).then((content) => {
            setOriginalDocument(content)
            setValue(convertXmlToSlate(content))
        });
    }, [file]);

    if (!value) {
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
                                    text={originalDocument}
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
                                    text={convertSlateToXml(editor)}
                                    language={'xml'}
                                />
                            </Collapse.Panel>
                            <Collapse.Panel header="Changes" key="4">
                                <CodeBlock
                                    text={JSON.stringify(compareDocuments(originalDocument, editor), null, 2)}
                                    language={'json'}
                                />
                            </Collapse.Panel>
                        </Collapse>;
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Editor;

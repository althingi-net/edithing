import { Collapse } from "antd";
import { FC, useMemo } from "react";
import { CodeBlock } from "react-code-blocks";
import { useSlate } from "slate-react";
import CopyClipboardButton from "./CopyClipboardButton";
import LawChanges from "./LawChanges";
import NodeMetaForm from "./NodeMetaForm";
import compareDocuments from "./utils/changelog/compareDocuments";
import useDebounce from "./utils/useDebounce";
import exportXml from "./utils/xml/exportXml";
import importXml from "./utils/xml/importXml";

interface Props {
    originalDocument: ReturnType<typeof importXml>;
    xml: string;
}

const EditorSidePanel: FC<Props> = (props) => {
    const { originalDocument, xml } = props;

    const slate = useSlate();
    const debouncedSlate = useDebounce(slate, 500);

    return useMemo(() => {
        if (!debouncedSlate) {
            return null;
        }

        const slateState = JSON.stringify(debouncedSlate, null, 2);
        const xmlExport = exportXml(debouncedSlate, true, originalDocument.meta);
        const changelog = compareDocuments(originalDocument.slate, debouncedSlate.children, slate.events);

        return (
            <div style={{ height: '100%' }}>
                <Collapse defaultActiveKey={[]} destroyInactivePanel>
                    <Collapse.Panel header="Paragraph Configuration" key="1">
                        <NodeMetaForm />
                    </Collapse.Panel>
                    <Collapse.Panel header="Old XML" key="2" extra={<CopyClipboardButton content={xml} />}>
                        <CodeBlock
                            text={xml}
                            language={'xml'}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="Slate" key="3" extra={<CopyClipboardButton content={slateState} />}>
                        <CodeBlock
                            text={slateState}
                            language={'json'}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="New XML" key="4" extra={<CopyClipboardButton content={xmlExport} />}>
                        <CodeBlock
                            text={xmlExport}
                            language={'xml'}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="Changes" key="5" extra={<CopyClipboardButton content={changelog} />}>
                        <LawChanges changelog={changelog} />
                    </Collapse.Panel>
                </Collapse>
            </div>
        );
    }, [debouncedSlate, originalDocument, xml, slate.events]);
}

export default EditorSidePanel;
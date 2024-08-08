import { Collapse } from 'antd';
import { exportSpeechXml, exportXml } from 'law-document';
import { FC, useMemo } from 'react';
import { CodeBlock } from 'react-code-blocks';
import { Descendant } from 'slate';
import { useSlate } from 'slate-react';
import useLanguageContext from '../App/useLanguageContext';
import CopyClipboardButton from './CopyClipboardButton';
import NodeMetaForm from './NodeMetaForm';
import useDebounce from './utils/useDebounce';
import LawDiff from './LawDiff';

interface Props {
    originalDocument?: Descendant[];
    xml?: string;
    readOnly?: boolean;
    isSpeech?: boolean;
}

const EditorSidePanel: FC<Props> = (props) => {
    const { t } = useLanguageContext();
    const { originalDocument, xml, readOnly, isSpeech } = props;
    const debouncedSlate = useDebounce(useSlate(), 500);

    return useMemo(() => {
        const slateState = JSON.stringify(debouncedSlate.children, null, 2);
        const xmlExport = isSpeech ? exportSpeechXml(debouncedSlate, true) : exportXml(debouncedSlate, true);

        return (
            <div style={{ height: 'calc(100vh - 146px)', overflowY: 'auto' }}>
                <Collapse defaultActiveKey={['5']} destroyInactivePanel>
                    <Collapse.Panel
                        key="1"
                        header={t('Element Configuration')}
                        collapsible={readOnly ? 'disabled' : undefined}
                    >
                        <NodeMetaForm />
                    </Collapse.Panel>
                    {xml && <Collapse.Panel
                        key="2"
                        header={t('Old XML')}
                        extra={<CopyClipboardButton content={xml} />}
                    >
                        <CodeBlock
                            text={xml}
                            language={'xml'}
                        />
                    </Collapse.Panel>}
                    <Collapse.Panel
                        key="3"
                        header="Slate"
                        extra={<CopyClipboardButton content={slateState} />}
                    >
                        <CodeBlock
                            text={slateState}
                            language={'json'}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel
                        key="4"
                        header={t('New XML')}
                        extra={<CopyClipboardButton content={xmlExport} />}
                    >
                        <CodeBlock
                            text={xmlExport}
                            language={'xml'}
                        />
                    </Collapse.Panel>
                    {originalDocument && (
                        <Collapse.Panel
                            key="5"
                            header={t('Changes')}
                            collapsible={readOnly ? 'disabled' : undefined}
                        >
                            <LawDiff originalDocument={originalDocument} slate={debouncedSlate} />
                        </Collapse.Panel>
                    )}
                </Collapse>
            </div>
        );
    // Note: Important to re-render on changes of debouncedSlate.children
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSlate, debouncedSlate.children, originalDocument, xml, t]);
};

export default EditorSidePanel;
import { Collapse } from 'antd';
import { exportSpeechXml, exportXml, SlateFragment } from 'law-document';
import { FC, useMemo } from 'react';
import { CodeBlock } from 'react-code-blocks';
import { Descendant } from 'slate';
import { useSlate } from 'slate-react';
import CopyClipboardButton from './CopyClipboardButton';
import NodeMetaForm from './NodeMetaForm';
import useDebounce from '../utils/useDebounce';
import LawDiff from './LawDiff';
import React from 'react';
import { Translator } from '../translations';

interface Props {
    originalDocument?: SlateFragment;
    xml?: string;
    readOnly?: boolean;
    isSpeech?: boolean;
    t: Translator;
}

const EditorSidePanel: FC<Props> = (props) => {
    const { originalDocument, xml, readOnly, isSpeech, t } = props;
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
                        <NodeMetaForm t={t} />
                    </Collapse.Panel>
                    {xml && <Collapse.Panel
                        key="2"
                        header={t('Old XML')}
                        extra={<CopyClipboardButton t={t} content={xml} />}
                    >
                        <CodeBlock
                            text={xml}
                            language={'xml'}
                        />
                    </Collapse.Panel>}
                    <Collapse.Panel
                        key="3"
                        header="Slate"
                        extra={<CopyClipboardButton t={t} content={slateState} />}
                    >
                        <CodeBlock
                            text={slateState}
                            language={'json'}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel
                        key="4"
                        header={t('New XML')}
                        extra={<CopyClipboardButton t={t} content={xmlExport} />}
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
                            <LawDiff originalDocument={originalDocument} slate={debouncedSlate} t={t} />
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
import { Button, Checkbox, Space } from 'antd';
import { Bill } from 'client-sdk';
import { LawEditor } from 'law-document';
import React, { FC } from 'react';
import { useSlateStatic } from 'slate-react';
import { useEditorConfig } from '../EditorConfig';
import { NavigationBlocker } from '../useEditorNaviationBlock';
import { Translator } from '../../translations';

interface Props {
    saveDocument?: (editor: LawEditor) => void;
    bill?: Bill;
    t: Translator;
    navigationBlocker: NavigationBlocker;
}

export const Toolbar: FC<Props> = ({ saveDocument, bill, t, navigationBlocker }) => {
    const {
        setAutoNumberIncrements,
        setHighlightStructure,
        highlightStructure,
        autoNumberIncrements,
    } = useEditorConfig(state => state);
    const slate = useSlateStatic();
    const { isNavigationBlocked, goTo } = navigationBlocker;

    return (
        <Space direction="horizontal" style={{ justifyContent: 'left', marginBottom: '10px', width: '100%' }}>
            <Checkbox checked={highlightStructure} onChange={(event) => setHighlightStructure(event.target.checked)}>
                {t('Highlight Structure')}
            </Checkbox>
            <Checkbox checked={autoNumberIncrements} onChange={(event) => setAutoNumberIncrements(event.target.checked)}>
                {t('Auto Increment Numbers')}
            </Checkbox>
            {saveDocument && <Button type={isNavigationBlocked ? 'primary' : 'default'} disabled={!isNavigationBlocked} onClick={() => saveDocument(slate)}>{t('Save')}</Button>}
            {bill && <Button onClick={() => goTo(`/bill/${bill.id}`)}>{t('Open Bill Preview')}</Button>}
        </Space>
    );
};
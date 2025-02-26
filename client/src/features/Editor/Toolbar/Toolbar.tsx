import { Button, Checkbox, Space } from 'antd';
import { FC } from 'react';
import { useSlateStatic } from 'slate-react';
import { LawEditor } from 'law-document';
import { Bill } from 'client-sdk';
import { useNavigate } from 'react-router';
import useLanguageContext from '../../App/useLanguageContext';
import useBlockNavigation from '../../App/useBlockNavigation';
import { useEditorConfig } from '../EditorConfig';

interface Props {
    saveDocument?: (editor: LawEditor) => void;
    bill?: Bill;
}

const Toolbar: FC<Props> = ({ saveDocument, bill }) => {
    const { t } = useLanguageContext();
    const {
        setAutoNumberIncrements,
        setHighlightStructure,
        highlightStructure,
        autoNumberIncrements,
    } = useEditorConfig(state => state);
    const slate = useSlateStatic();
    const navigate = useNavigate();
    const { isNavigationBlocked } = useBlockNavigation();

    return (
        <Space direction="horizontal" style={{ justifyContent: 'left', marginBottom: '10px', width: '100%' }}>
            <Checkbox checked={highlightStructure} onChange={(event) => setHighlightStructure(event.target.checked)}>
                {t('Highlight Structure')}
            </Checkbox>
            <Checkbox checked={autoNumberIncrements} onChange={(event) => setAutoNumberIncrements(event.target.checked)}>
                {t('Auto Increment Numbers')}
            </Checkbox>
            {saveDocument && <Button type={isNavigationBlocked ? 'primary' : 'default'} disabled={!isNavigationBlocked} onClick={() => saveDocument(slate)}>{t('Save')}</Button>}
            {bill && <Button onClick={() => navigate(`/bill/${bill.id}`)}>{t('Open Bill Preview')}</Button>}
        </Space>
    );
};

export default Toolbar;
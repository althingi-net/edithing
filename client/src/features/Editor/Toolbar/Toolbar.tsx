import { Button, Checkbox, Space } from 'antd';
import { FC } from 'react';
import { useSlateStatic } from 'slate-react';
import { LawEditor } from 'law-document';
import { Bill } from 'client-sdk';
import { useNavigate } from 'react-router-dom';
import useLanguageContext from '../../App/useLanguageContext';
import useBlockNavigation from '../../App/useBlockNavigation';
import useHighlightContext from './useHighlightContext';

interface Props {
    saveDocument: (editor: LawEditor) => void;
    bill?: Bill;
}

const Toolbar: FC<Props> = ({ saveDocument, bill }) => {
    const { t } = useLanguageContext();
    const highlight = useHighlightContext();
    const slate = useSlateStatic();
    const navigate = useNavigate();
    const { isNavigationBlocked } = useBlockNavigation();

    return (
        <Space direction="horizontal" style={{ justifyContent: 'left', marginBottom: '10px', width: '100%' }}>
            <Checkbox checked={highlight.isHighlighted} onChange={(event) => highlight.setHighlighted(event.target.checked)}>
                {t('Highlight elements')}
            </Checkbox>
            <Button type={isNavigationBlocked ? 'primary' : 'default'} disabled={!isNavigationBlocked} onClick={() => saveDocument(slate)}>{t('Save')}</Button>
            {bill && <Button onClick={() => navigate(`/bill/${bill.id}`)}>{t('Open Bill Preview')}</Button>}
        </Space>
    );
};

export default Toolbar;
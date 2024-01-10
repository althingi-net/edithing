import { Button, Checkbox, Space, notification } from 'antd';
import { DocumentService } from 'client-sdk';
import { useParams } from 'react-router-dom';
import { useSlateStatic } from 'slate-react';
import { exportXml } from 'law-document';
import useLanguageContext from '../../App/useLanguageContext';
import useHighlightContext from './useHighlightContext';

const Toolbar = () => {
    const { t } = useLanguageContext();
    const highlight = useHighlightContext();
    const { nr, year } = useParams();
    const slate = useSlateStatic();

    const handleSave = () => {
        const identifier = `${nr}.${year}`;
        const data = { content: exportXml(slate, true) };
        DocumentService.documentControllerUpdate(identifier, data)
            .then(() => notification.success({ message: t('Document saved') }))
            .catch(() => notification.error({ message: t('Error: Document not saved') }));
    };

    return (
        <Space direction="horizontal" style={{ justifyContent: 'right', marginBottom: '10px', width: '100%' }}>
            <Button onClick={handleSave}>{t('Save')}</Button>
            <Checkbox checked={highlight?.isHighlighted} onChange={(event) => highlight?.setHighlighted(event.target.checked)}>
                {t('Highlight elements')}
            </Checkbox>
        </Space>
    );
};

export default Toolbar;
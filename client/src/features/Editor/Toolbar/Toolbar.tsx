import { Button, Checkbox, Space } from 'antd';
import { FC } from 'react';
import { useSlateStatic } from 'slate-react';
import { LawEditor } from 'law-document';
import useLanguageContext from '../../App/useLanguageContext';
import useHighlightContext from './useHighlightContext';
interface Props {
    saveDocument: (editor: LawEditor) => void;
}

const Toolbar: FC<Props> = ({ saveDocument }) => {
    const { t } = useLanguageContext();
    const highlight = useHighlightContext();
    const slate = useSlateStatic();

    return (
        <Space direction="horizontal" style={{ justifyContent: 'left', marginBottom: '10px', width: '100%' }}>
            <Button onClick={() => saveDocument(slate)}>{t('Save')}</Button>
            <Checkbox checked={highlight?.isHighlighted} onChange={(event) => highlight?.setHighlighted(event.target.checked)}>
                {t('Highlight elements')}
            </Checkbox>
        </Space>
    );
};

export default Toolbar;
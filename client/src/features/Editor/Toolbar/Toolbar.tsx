import { Checkbox, Space } from 'antd';
import useHighlightContext from './useHighlightContext';
import useLanguageContext from '../../App/useLanguageContext';

const Toolbar = () => {
    const { t } = useLanguageContext();
    const highlight = useHighlightContext();

    return (
        <Space direction="horizontal" style={{ justifyContent: 'right', marginBottom: '10px', width: '100%' }}>
            <Checkbox checked={highlight?.isHighlighted} onChange={(event) => highlight?.setHighlighted(event.target.checked)}>
                {t('Highlight elements')}
            </Checkbox>
        </Space>
    );
};

export default Toolbar;
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Input } from 'antd';
import { ChangeEvent, FC, useCallback } from 'react';
import useLanguageContext from '../App/useLanguageContext';

interface Props {
    title: string;
    onFilter?: (value: string) => void;
}

const PanelHeader: FC<Props> = ({ title, onFilter }) => {
    const { t } = useLanguageContext();

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        onFilter?.(event.target.value);
    }, [onFilter]);

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div className='panel-header'>
                {title}
            </div>
            <div onClick={(event) => event.stopPropagation()}>
                <Input allowClear placeholder={t('Search')} onChange={handleChange} />
            </div>
        </div>
    );
};

export default PanelHeader;
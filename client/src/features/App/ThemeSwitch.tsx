import { Switch } from 'antd';
import { FC } from 'react';
import useThemeContext from './useThemeContext';
import { useTranslation } from './store/useTranslation';

const ThemeSwitch: FC = () => {
    const { theme, setTheme } = useThemeContext();
    const t = useTranslation();
    
    return (
        <Switch
            checked={theme === 'light'}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            checkedChildren={t('Light')}
            unCheckedChildren={t('Dark')}
        />
    );
};

export default ThemeSwitch;
import { Switch } from 'antd';
import { FC } from 'react';
import useThemeContext from './useThemeContext';
import { useStore } from './store/useStore';

const ThemeSwitch: FC = () => {
    const { theme, setTheme } = useThemeContext();
    const t = useStore((state) => state.t);
    
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
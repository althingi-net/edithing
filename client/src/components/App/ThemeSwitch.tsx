import { Switch } from 'antd';
import useThemeContext from './useThemeContext';
import { FC } from 'react';

const ThemeSwitch: FC = () => {
    const { theme, setTheme } = useThemeContext();
    
    return (
        <Switch
            checked={theme === 'light'}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            checkedChildren='Light'
            unCheckedChildren='Dark'
        />
    );
};

export default ThemeSwitch;
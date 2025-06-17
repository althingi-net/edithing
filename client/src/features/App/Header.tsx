import { Menu, Space } from 'antd';
import { Header as AntHeader } from 'antd/es/layout/layout';
import { MenuItemType } from 'antd/es/menu/interface';
import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import LanguageSelect from './LanguageSelect';
import LoginButton from './LoginButton';
import ProfileMenu from './ProfileMenu';
import useThemeContext from './useThemeContext';
import { useStore } from './store/useStore';

const useHeaderMenuItems = () => {
    const t = useStore((state) => state.t);

    const headerMenuItems: MenuItemType[] = useMemo(() => [{
        key: '/',
        label: t('Legal Codex'),
    }, {
        key: '/bills',
        label: t('Bills'),
    }], [t]);

    return headerMenuItems;
};

const Header: FC = () => {
    const { theme } = useThemeContext();
    const navigate = useNavigate();
    const location = useLocation();
    const headerMenuItems = useHeaderMenuItems();
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    
    return (
        <AntHeader
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: theme === 'light' ? '#fff' : '#001529',
                transition: 'border-color 0.3s, background 0.3s',
            }}
        >
            <Menu
                theme={theme}
                mode="horizontal"
                items={headerMenuItems}
                selectedKeys={[location.pathname]}
                onClick={({ key }) => navigate(key)}
                disabledOverflow
            />
            <Space style={{ marginLeft: 'auto' }}>
                <LoginButton />
                <ProfileMenu />
                {!isAuthenticated() && <LanguageSelect />}
            </Space>
        </AntHeader>
    );
};

export default Header;
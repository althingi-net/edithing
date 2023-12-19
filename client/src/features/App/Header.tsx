import { Menu, Space } from 'antd';
import { Header as AntHeader } from 'antd/es/layout/layout';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginButton from './LoginButton';
import ProfileMenu from './ProfileMenu';
import useThemeContext from './useThemeContext';
import useLanguageContext from './useLanguageContext';

const useHeaderMenuItems = () => {
    const { t } = useLanguageContext();

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
            </Space>
        </AntHeader>
    );
};

export default Header;
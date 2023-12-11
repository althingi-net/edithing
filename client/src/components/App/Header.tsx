import { Button, Menu, Space } from 'antd';
import { Header as AntHeader } from 'antd/es/layout/layout';
import { FC } from 'react';
import ProfileMenu from './ProfileMenu';
import useThemeContext from './useThemeContext';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import { useLocation, useNavigate } from 'react-router-dom';

const headerMenuItems: MenuItemType[] = [{
    key: '/',
    label: 'Laws',
}];

const Header: FC = () => {
    const { theme } = useThemeContext();
    const navigate = useNavigate();
    const location = useLocation();
    
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
            />
            <Space style={{ marginLeft: 'auto' }}>
                <Button type="primary">Login</Button>
                <ProfileMenu />
            </Space>
        </AntHeader>
    );
};

export default Header;
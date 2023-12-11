import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Button, Avatar } from 'antd';
import { FC, useState } from 'react';
import ThemeSwitch from './ThemeSwitch';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import LanguageSelect from './LanguageSelect';
import useThemeContext from './useThemeContext';

const profileMenuItems: ItemType[] = [
    {
        key: 'profile',
        label: 'Profile',
        icon: <UserOutlined />,
    },
    {
        key: 'settings',
        label: 'Settings',
        icon: <SettingOutlined />,
    },
    {
        type: 'divider',
    },
    {
        key: 'theme',
        label: (
            <span style={{ cursor: 'default' }}>
                <span style={{ marginRight: '35px' }}>Theme:</span><ThemeSwitch />
            </span>
        ),
    },
    {
        key: 'language',
        label: (
            <span style={{ cursor: 'default' }}>
                <span style={{ marginRight: '35px' }}>Language:</span>
                <LanguageSelect />
            </span>
        ),
    },
    {
        type: 'divider',
    },
    {
        key: 'logout',
        label: 'Logout',
        icon: <LogoutOutlined />,
        danger: true,
    },
];

const ProfileMenu: FC = () => {
    const [isOpen, setOpen] = useState(false);
    const { theme } = useThemeContext();

    return (
        <Dropdown open={isOpen} menu={{ items: profileMenuItems, theme }} placement="bottomRight" arrow>
            <Button
                onClick={() => setOpen(open => !open)}
                type='text'
                style={{ padding: 0 }}
            >
                <Avatar style={{ backgroundColor: '#f56a00' }}>SK</Avatar>
            </Button>
        </Dropdown>
    );
};

export default ProfileMenu;
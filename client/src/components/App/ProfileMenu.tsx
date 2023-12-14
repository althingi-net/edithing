import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Button, Avatar } from 'antd';
import { FC, useCallback, useMemo, useState } from 'react';
import ThemeSwitch from './ThemeSwitch';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import LanguageSelect from './LanguageSelect';
import useThemeContext from './useThemeContext';
import useSessionContext from './useSessionContext';
import useLanguageContext from './useLanguageContext';

const useProfileMenuItems = () => {
    const { t } = useLanguageContext();

    const profileMenuItems: ItemType[] = useMemo(() => [
        {
            key: 'profile',
            label: t('Profile'),
            icon: <UserOutlined />,
        },
        {
            key: 'settings',
            label: t('Settings'),
            icon: <SettingOutlined />,
        },
        {
            type: 'divider',
        },
        {
            key: 'theme',
            label: (
                <span style={{ cursor: 'default' }}>
                    <span style={{ marginRight: '35px' }}>{t('Theme')}:</span>
                    <ThemeSwitch />
                </span>
            ),
        },
        {
            key: 'language',
            label: (
                <span style={{ cursor: 'default' }}>
                    <span style={{ marginRight: '35px' }}>{t('Language')}:</span>
                    <LanguageSelect />
                </span>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: t('Logout'),
            icon: <LogoutOutlined />,
            danger: true,
        },
    ], [t]);

    return profileMenuItems;
};

const ProfileMenu: FC = () => {
    const [isOpen, setOpen] = useState(false);
    const { theme } = useThemeContext();
    const { isAuthenticated, session, logout } = useSessionContext();
    const profileMenuItems = useProfileMenuItems();

    const handleMenuItemClick = useCallback(({ key }: { key: string }) => {
        switch (key) {
        case 'logout': 
            logout();
            setOpen(false);
            break;
        }
    }, [logout]);

    if (!isAuthenticated() || !session) {
        return null;
    }

    const { firstName, lastName } = session.user;
    const initials = firstName[0].toUpperCase() + lastName[0].toUpperCase();

    return (
        <Dropdown open={isOpen} menu={{ items: profileMenuItems, theme, onClick: handleMenuItemClick }} placement="bottomRight" arrow>
            <Button
                onClick={() => setOpen(open => !open)}
                type='text'
                style={{ padding: 0 }}
            >
                <Avatar style={{ backgroundColor: '#f56a00' }}>{initials}</Avatar>
            </Button>
        </Dropdown>
    );
};

export default ProfileMenu;
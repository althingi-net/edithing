import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { FC, useCallback, useMemo, useState } from 'react';
import LanguageSelect from './LanguageSelect';
import ThemeSwitch from './ThemeSwitch';
import UserAvatar from './UserAvatar';
import useLanguageContext from './useLanguageContext';
import useSessionContext from './useSessionContext';
import useThemeContext from './useThemeContext';

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

    return (
        <Dropdown open={isOpen} menu={{ items: profileMenuItems, theme, onClick: handleMenuItemClick }} placement="bottomRight" arrow>
            <Button
                onClick={() => setOpen(open => !open)}
                type='text'
                style={{ padding: 0 }}
            >
                <UserAvatar user={session.user} />
            </Button>
        </Dropdown>
    );
};

export default ProfileMenu;
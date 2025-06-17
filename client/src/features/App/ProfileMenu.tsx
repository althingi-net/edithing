import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { FC, useCallback, useMemo, useState } from 'react';
import LanguageSelect from './LanguageSelect';
import ThemeSwitch from './ThemeSwitch';
import UserAvatar from './UserAvatar';
import { useStore } from './store/useStore';
import useThemeContext from './useThemeContext';
import useUserErrors from './useUserErrors';

const useProfileMenuItems = () => {
    const t = useStore((state) => state.t);

    const profileMenuItems: ItemType[] = useMemo(() => [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: t('Profile'),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: t('Settings'),
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
            icon: <LogoutOutlined />,
            label: t('Logout'),
            danger: true,
        },
    ], [t]);

    return profileMenuItems;
};

const ProfileMenu: FC = () => {
    const [isOpen, setOpen] = useState(false);
    const { theme } = useThemeContext();
    const { isAuthenticated, session, logout } = useStore();
    const { errorUnsavedChanges } = useUserErrors();
    const profileMenuItems = useProfileMenuItems();

    const handleLogout = useCallback(() => {
        const loggedOut = logout();
        if (!loggedOut) {
            errorUnsavedChanges();
        } else {
            setOpen(false);
        }
    }, [logout, errorUnsavedChanges]);

    const handleMenuItemClick = useCallback(({ key }: { key: string }) => {
        switch (key) {
        case 'logout': 
            handleLogout();
            break;
        }
    }, [handleLogout]);

    if (!isAuthenticated() || !session) {
        return (
            <Button type="text" icon={<UserOutlined />} />
        );
    }

    return (
        <Dropdown
            menu={{ items: profileMenuItems, theme, onClick: handleMenuItemClick }}
            open={isOpen}
            onOpenChange={setOpen}
            trigger={['click']}
            placement="bottomRight"
            arrow
        >
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
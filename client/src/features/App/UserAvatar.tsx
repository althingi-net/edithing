import { Avatar } from 'antd';
import { User } from 'client-sdk';
import { FC } from 'react';

interface Props {
    user: User
}

const UserAvatar: FC<Props> = ({ user }) => {
    const { firstName, lastName } = user;
    const initials = firstName[0].toUpperCase() + lastName[0].toUpperCase();

    return (
        <Avatar style={{ backgroundColor: '#f56a00' }}>{initials}</Avatar>
    );
};

export default UserAvatar;
import User, { UserRole } from '../entities/User';

const seedTestDb = async () => {
    // Clear all data from the database.
    User.clear();

    // Insert Users.
    const password = await User.hashPassword('123456');

    await Promise.all([
        User.save({
            id: 1,
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@edithing.x',
            password,
            role: UserRole.ADMIN,
            isActive: true,
        }),
        User.save({
            id: 2,
            firstName: 'Editor',
            lastName: 'User',
            email: 'editor@edithing.x',
            password,
            role: UserRole.EDITOR,
            isActive: true,
        }),
    ]);
};

export default seedTestDb;
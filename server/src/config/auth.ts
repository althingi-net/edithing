const auth = {
    jwt: {
        secret: process.env.JWT_SECRET || 'secret',
        expiresInSeconds: 60 * 60 * 24 * 7, // 7 days
    },  
};

if (process.env.NODE_ENV === 'production' && auth.jwt.secret === 'secret') {
    throw new Error('JWT_SECRET not set in production environment!');
}

export default auth;
import { sign } from 'jsonwebtoken';
import User from '../entities/User';
import auth from '../config/auth';
import server from '../config/server';

const generateJwtToken = (user: User) => {
    const data = {
        userId: user.id,
        expiresIn: Date.now() + auth.jwt.expiresInSeconds * 1000,
    };

    return sign(
        data,
        auth.jwt.secret,
        {
            issuer: server.host,
            audience: server.host,
            expiresIn: auth.jwt.expiresInSeconds,
        }
    );
};

export default generateJwtToken;
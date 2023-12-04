import { sign } from 'jsonwebtoken';
import User from '../entities/User';
import auth from '../config/auth';

const generateJwtToken = (user: User) => {
    const data = {
        id: user.id,
        expiresIn: Date.now() + auth.jwt.expiresInSeconds * 1000,
    };

    return sign(
        data,
        auth.jwt.secret,
        {
            expiresIn: auth.jwt.expiresInSeconds,
        }
    );
};

export default generateJwtToken;
import { StatusCodes } from 'http-status-codes';
import passport from 'koa-passport';
import { Body, BodyParam, HttpError, JsonController, Post, State, UseBefore } from 'routing-controllers';
import generateJwtToken from '../authentication/generateJwtToken';
import User from '../entities/User';

@JsonController('/auth')
export class AuthController {
    @Post('/login')
    @UseBefore(passport.authenticate('local', { session: false }))
    async postLogin(@State('user') user: User) {
        return {
            token: 'JWT ' + generateJwtToken(user),
            user,
        };
    }

    @Post('/register')
    async postRegister(@Body() user: User) {
        const existingUser = await  User.findOne({ where: { email: user.email } });
        if (existingUser) {
            throw new HttpError(StatusCodes.UNPROCESSABLE_ENTITY, 'That email address is already in use.');
        }

        await user.save();
                
        // emailService.sendActivation(savedUser);

        return {
            user: user.id,
        };
    }

    @Post('/activate')
    async postActivation(@BodyParam('authenticationToken') authenticationToken: string) {
        const user = await User.findOne({ where: { authenticationToken } });
        if (!user) {
            throw new HttpError(StatusCodes.UNPROCESSABLE_ENTITY, 'could not activate user');
        }

        user.authenticationToken = undefined;
        user.isActive = true;

        await user.save();

        return {
            token: 'JWT ' + generateJwtToken(user),
            user: user.id,
        };
    }
}
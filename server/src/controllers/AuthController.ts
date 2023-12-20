import { IsString, ValidateNested } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import passport from 'koa-passport';
import { Body, BodyParam, Get, HttpError, JsonController, Post, State, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import generateJwtToken from '../authentication/generateJwtToken';
import User from '../entities/User';

class LoginRequestBody {
    @IsString()
    email!: string;

    @IsString()
    password!: string;
}

class LoginResponse {
    @IsString()
    token!: string;

    @ValidateNested()
    user!: User;

}

@JsonController('/auth')
export class AuthController {
    @Post('/login')
    @OpenAPI({ summary: 'Authenticate with email and password' })
    @UseBefore(passport.authenticate('local', { session: false }))
    @ResponseSchema(LoginResponse)
    login(@Body() body: LoginRequestBody, @State('user') user: User) {
        return {
            token: generateJwtToken(user),
            user,
        };
    }

    @Post('/register')
    async register(@Body() user: User) {
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
    async activate(@BodyParam('authenticationToken') authenticationToken: string) {
        const user = await User.findOne({ where: { authenticationToken } });
        if (!user) {
            throw new HttpError(StatusCodes.UNPROCESSABLE_ENTITY, 'could not activate user');
        }

        user.authenticationToken = undefined;
        user.isActive = true;

        await user.save();

        return {
            token: generateJwtToken(user),
            user: user.id,
        };
    }

    @Get('/me')
    @UseBefore(passport.authenticate('jwt', { session: false }))
    getMe(@State('user') user: User) {
        return user;
    }
}
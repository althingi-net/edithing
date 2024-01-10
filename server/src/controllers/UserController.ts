import passport from 'koa-passport';
import { Authorized, Body, Get, JsonController, Param, Post, Put, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import User, { UserRole } from '../entities/User';

@JsonController()
@OpenAPI({
    security: [{ bearerAuth: [] }],
})
@UseBefore(passport.authenticate('jwt', { session: false }) )
class UserController {
    @Get('/users')
    @Authorized()
    @ResponseSchema(User, { isArray: true })
    getAll() {
        return User.find();
    }

    @Get('/users/:id')
    @Authorized()
    @ResponseSchema(User)
    get(@Param('id') id: number) {
        return User.findOneOrFail({ where: { id } });
    }

    @Post('/users')
    @Authorized(UserRole.ADMIN)
    @ResponseSchema(User)
    create(@Body() user: User) {
        return User.save(user);
    }

    @Put('/users/:id')
    @Authorized(UserRole.ADMIN)
    @ResponseSchema(User)
    update(
        @Param('id') id: number,
        @Body({ validate: { skipMissingProperties: true } }) user: Partial<User>
    ) {
        return User.update({ id }, user);
    }
}

export default UserController;
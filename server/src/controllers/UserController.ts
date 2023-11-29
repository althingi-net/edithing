import { Get, JsonController, Post } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { EntityFromBody, EntityFromParam } from 'typeorm-routing-controllers-extensions';
import User from '../entities/User';

@JsonController()
export class UserController {
    @Get('/users')
    @ResponseSchema(User, { isArray: true })
    getAll() {
        return User.find();
    }

    @Get('/users/:id')
    get(@EntityFromParam('id') user: User) {
        return user;
    }

    @Post('/users')
    save(@EntityFromBody() user: User) {
        return User.save(user);
    }
}
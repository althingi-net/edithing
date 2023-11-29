import { StatusCodes } from 'http-status-codes';
import { Body, Delete, Get, HttpCode, JsonController, Param, Post, Put } from 'routing-controllers';
import User from '../entities/User';
import { ResponseSchema } from 'routing-controllers-openapi';

@JsonController('/users')
export class UserController {
  @Get('/users')
      @ResponseSchema(User, { isArray: true })
    getAll(): User[] {
        return [{ id: '1', firstName: 'First', lastName: 'Last', createdAt: new Date(), updatedAt: new Date() }];
    }

  @Get('/users/:id')
  getOne(@Param('id') id: number) {
      return 'This action returns user #' + id;
  }

  @HttpCode(StatusCodes.CREATED)
  @Post('/users')
  post(@Body() user: unknown) {
      return 'Saving user...';
  }

  @Put('/users/:id')
  put(@Param('id') id: number, @Body() user: unknown) {
      return 'Updating a user...';
  }

  @Delete('/users/:id')
  remove(@Param('id') id: number) {
      return 'Removing user...';
  }
}
import { StatusCodes } from 'http-status-codes';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from 'routing-controllers';

@Controller()
export class UserController {
  @Get('/users')
    getAll() {
        return 'This action returns all users';
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
import passport from 'koa-passport';
import { Body, Get, JsonController, Param, Post, Put, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import Bill from '../entities/Bill';

@JsonController()
@OpenAPI({
    security: [{ bearerAuth: [] }],
})
@UseBefore(passport.authenticate('jwt', { session: false }) )
class BillController {
    @Get('/bills')
    @ResponseSchema(Bill, { isArray: true })
    getAll() {
        return Bill.find();
    }

    @Get('/bills/:id')
    @ResponseSchema(Bill)
    get(@Param('id') id: number) {
        return Bill.findOneOrFail({ where: { id } });
    }

    @Post('/bills')
    @ResponseSchema(Bill)
    create(@Body() bill: Bill) {
        return Bill.save(bill);
    }

    @Put('/bills/:id')
    @ResponseSchema(Bill)
    update(
        @Param('id') id: number,
        @Body({ validate: { skipMissingProperties: true } }) bill: Partial<Bill>
    ) {
        return Bill.update({ id }, bill);
    }
}

export default BillController;
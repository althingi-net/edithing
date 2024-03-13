import passport from 'koa-passport';
import { Body, Get, JsonController, Param, Post, Put, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { exportBillXml } from 'law-document';
import Bill from '../entities/Bill';
import BillDocument from '../entities/BillDocument';

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

    @Get('/bills/:id/xml')
    async getXml(@Param('id') id: number) {
        const bill = await Bill.findOneOrFail({ where: { id } }) ;
        const documents = await BillDocument.find({
            where: { bill },
            select: ['originalXml', 'content', 'events', 'identifier', 'title']
        });
        return exportBillXml(bill.title, documents);
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
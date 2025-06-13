import passport from 'koa-passport';
import { Body, Get, JsonController, Param, Post, Put, UseBefore, ContentType, HttpError } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { exportBillMetaXml, exportBillXml } from 'law-document';
import Bill, { BillStatus } from '../entities/Bill';
import BillDocument from '../entities/BillDocument';
import { postBillMeta, postBillForValidation, postBillForPublishing } from '../integration/lagasafnApi';

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
            select: ['originalXml', 'content', 'identifier', 'title']
        });
        return exportBillXml(documents);
    }

    @Post('/bills')
    @ResponseSchema(Bill)
    create(@Body() bill: Bill) {
        return Bill.save(bill);
    }

    @Post('/bills/:id/xml')
    @ContentType('text/xml')
    @OpenAPI({
        description: 'Publish bill XML',
    })
    async publishXml(
        @Param('id') id: number,
    ) {
        const bills = await Bill.find({ where: { id } });

        if ( bills.length < 1 || ! bills[0]?.documents ) {
            throw new HttpError( 404, 'Unable to find bill documents');
        }

        const billMetaXml = exportBillMetaXml( bills[0].lagasafnId, bills[0].title, bills[0].description ?? '' );
        await postBillMeta( billMetaXml );

        const billsXml: string[] = [];

        bills[0].documents.forEach( async bill => {
            const documents = await BillDocument.find({
                where: { id: bill.id },
                select: ['content']
            });

            const billXml = exportBillXml(documents);
            billsXml.push( billXml );

            try {
                // First, validate XML.
                await postBillForValidation( billXml );

                // Second, publish the XML.
                await postBillForPublishing( bills[0].lagasafnId, billXml );
            } catch( error: any ) {
                throw new HttpError( 400, <string>error?.message );
            }
        } );

        // Set status as 'published'.
        bills[0].status = BillStatus.PUBLISHED;
        bills[0].save();

        return billsXml;
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

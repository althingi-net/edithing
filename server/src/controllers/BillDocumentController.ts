import passport from 'koa-passport';
import { Body, Get, JsonController, Param, Post, Put, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import BillDocument from '../entities/BillDocument';

@JsonController()
@OpenAPI({
    security: [{ bearerAuth: [] }],
})
@UseBefore(passport.authenticate('jwt', { session: false }) )
class BillDocumentController {
    @Get('/billDocuments')
    @ResponseSchema(BillDocument, { isArray: true })
    getAll() {
        return BillDocument.find();
    }

    @Get('/billDocuments/:id')
    @ResponseSchema(BillDocument)
    get(@Param('id') id: number) {
        return BillDocument.findOneOrFail({ where: { id } });
    }

    @Post('/billDocuments')
    @ResponseSchema(BillDocument)
    create(@Body() billDocument: BillDocument) {
        return BillDocument.save(billDocument);
    }

    @Put('/billDocuments/:id')
    @ResponseSchema(BillDocument)
    update(
        @Param('id') id: number,
        @Body({ validate: { skipMissingProperties: true } }) billDocument: Partial<BillDocument>
    ) {
        return BillDocument.update({ id }, billDocument);
    }
}

export default BillDocumentController;
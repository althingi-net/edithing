import { IsString, ValidateNested } from 'class-validator';
import passport from 'koa-passport';
import { Body, Delete, Get, JsonController, Param, Post, Put, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import Bill from '../entities/Bill';
import BillDocument, { UpdateBillDocument } from '../entities/BillDocument';
import { findOrImportDocument } from '../services/DocumentService';

class CreateBillDocument {
    @IsString()
    identifier!: string;

    @ValidateNested()
    bill!: Bill;
}

@JsonController()
@OpenAPI({
    security: [{ bearerAuth: [] }],
})
@UseBefore(passport.authenticate('jwt', { session: false }) )
class BillDocumentController {
    @Get('/bill/:id/document')
    @ResponseSchema(BillDocument, { isArray: true })
    getAll(@Param('id') id: number) {
        return BillDocument.findBy({ bill: { id } });
    }

    @Get('/bill/:id/document/:identifier')
    @ResponseSchema(BillDocument)
    get(@Param('id') id: number, @Param('identifier') identifier: string) {
        return BillDocument.findOneOrFail({ where: { bill: { id }, identifier } });
    }

    @Post('/bill/document')
    @ResponseSchema(BillDocument)
    async create(@Body() { bill, identifier }: CreateBillDocument) {
        const { title, content, originalXml } = await findOrImportDocument(identifier);

        return BillDocument.save({
            bill,
            identifier,
            title,
            content,
            originalXml,
        });
    }

    @Put('/bill/document/:id')
    @ResponseSchema(BillDocument)
    async update(
        @Param('id') id: number,
        @Body() billDocument: UpdateBillDocument,
    ) {
        const result = await BillDocument.update({ id }, billDocument);
        return (result.affected ?? 0) > 1 ? true : false;
    }

    @Delete('/bill/:id/document/:identifier')
    delete(@Param('id') id: number, @Param('identifier') identifier: string) {
        return BillDocument.delete({ identifier, bill: { id } });
    }
}

export default BillDocumentController;
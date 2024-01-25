import { IsString, ValidateNested } from 'class-validator';
import passport from 'koa-passport';
import { Body, Get, JsonController, Param, Post, Put, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import Bill from '../entities/Bill';
import BillDocument from '../entities/BillDocument';
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
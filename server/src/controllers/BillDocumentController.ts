import { IsNumber, IsString } from 'class-validator';
import passport from 'koa-passport';
import { Body, Delete, Get, HttpError, JsonController, Param, Post, Put, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { validateDocument } from 'law-document';
import BillDocument, { UpdateBillDocument } from '../entities/BillDocument';
import { findOrImportDocument } from '../services/DocumentService';

class CreateBillDocument {
    @IsNumber()
    billId!: number;

    @IsString()
    identifier!: string;
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
        return BillDocument.find({
            where: { bill: { id } },
            select: ['id', 'identifier', 'title', 'content', 'originalXml', 'events'],
        });
    }

    @Get('/bill/:id/document/:identifier')
    @ResponseSchema(BillDocument)
    async get(@Param('id') id: number, @Param('identifier') identifier: string) {
        const document =  await BillDocument.findOne({
            where: {  bill: { id }, identifier },
            select: ['id', 'identifier', 'title', 'content', 'originalXml', 'events'],
        });
        
        if (!document) {
            throw new HttpError(404, 'BillDocument not found');
        }

        try {
            validateDocument(JSON.parse(document.content));
        } catch (error) {
            throw new HttpError(409, 'Invalid Document.');
        }

        return document;
    }

    @Post('/bill/document')
    @ResponseSchema(BillDocument)
    async create(@Body() { billId, identifier }: CreateBillDocument) {
        const { title, content, originalXml } = await findOrImportDocument(identifier);

        try {
            validateDocument(JSON.parse(content));
        } catch (error) {
            throw new HttpError(409, 'Invalid Document.');
        }

        await BillDocument.save({
            bill: { id: billId },
            identifier,
            title,
            content,
            originalXml,
            events: '[]'
        });

        return true;
    }

    @Put('/bill/document/:id')
    @ResponseSchema(BillDocument)
    async update(
        @Param('id') id: number,
        @Body() billDocument: UpdateBillDocument,
    ) {
        const result = await BillDocument.update({ id }, billDocument);
        return (result.affected ?? 0) >= 1 ? true : false;
    }

    @Delete('/bill/:id/document/:identifier')
    async delete(@Param('id') id: number, @Param('identifier') identifier: string) {
        const result = await BillDocument.delete({ identifier, bill: { id } });
        return (result.affected ?? 0) >= 1 ? true : false;
    }
}

export default BillDocumentController;
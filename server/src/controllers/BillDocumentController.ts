import { IsNumber, IsString } from 'class-validator';
import passport from 'koa-passport';
import { Body, Delete, Get, HttpError, JsonController, Param, Post, Put, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { validateDocument } from 'law-document';
import { Descendant } from 'slate';
import BillDocument, { UpdateBillDocument } from '../entities/BillDocument';
import { findOrImportDocument } from '../services/DocumentService';
import connection from '../integration/messageQueue/connection';
import BillDocumentUpdate, { UpdateStatus } from '../entities/BillDocumentUpdate';

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
            validateDocument(JSON.parse(document.content) as Descendant[]);
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
            validateDocument(JSON.parse(content) as Descendant[]);
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
        const update = await BillDocumentUpdate.save({
            billDocumentId: id,
            title: billDocument.title,
            content: billDocument.content,
            events: billDocument.events,
        });

        await connection.sendToQueue('BillDocumentUpdate', update.id!);

        await waitFor(async () => {
            const updated = await BillDocumentUpdate.findOneBy({ id: update.id! });
            return updated?.status !== UpdateStatus.PENDING;
        });
        
        return true;
    }

    @Delete('/bill/:id/document/:identifier')
    async delete(@Param('id') id: number, @Param('identifier') identifier: string) {
        const result = await BillDocument.delete({ identifier, bill: { id } });
        return (result.affected ?? 0) >= 1 ? true : false;
    }
}

const waitFor = (condition: () => Promise<boolean>) => {
    return new Promise<void>((resolve) => {
        setTimeout(async () => {

            if (await condition()) {
                resolve();
            } else {
                resolve(waitFor(condition));
            }
        }, 300);
    });
};

export default BillDocumentController;
import { Body, Get, JsonController, Param, Put } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import Document from '../entities/Document';
import { GithubFile } from '../integration/github/getLawEntries';
import { findOrImportDocument, loadIndexXml } from '../services/DocumentService';

@JsonController()
class DocumentController {

    /**
     * Get a list of all documents stored in a xml file on github.
     */
    @OpenAPI({ summary: 'Get a list of all documents stored in a xml file on github.' })
    @Get('/document')
    @ResponseSchema(GithubFile, { isArray: true })
    async getAll() {
        return loadIndexXml();
    }

    /**
     * Get a document from the database if it exists, otherwise it downloads it from github and saves it to the database.
     * @param path The path to the document on github. Example: `data/xml/1944.033.xml`
     * @returns The document.
     */
    @OpenAPI({ summary: 'Get a document from the database if it exists, otherwise it downloads it from github and saves it to the database.' })
    @Get('/document/:identifier')
    @ResponseSchema(Document)
    async get(@Param('identifier') identifier: string) {
        return findOrImportDocument(identifier);
    }

    /** Temporary update endpoint for presentation */
    @Put('/documents/:identifier')
    @ResponseSchema(Document)
    update(
        @Param('identifier') identifier: string,
        @Body({ validate: { skipMissingProperties: true } }) document: Partial<Document>
    ) {
        return Document.update({ identifier }, document);
    }
}



export default DocumentController;
import { Body, Get, JsonController, Param, Put } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import Document from '../entities/Document';
import downloadFile from '../integration/github/downloadFile';
import getLawEntries, { GithubFile } from '../integration/github/getLawEntries';


@JsonController()
class DocumentController {

    /**
     * Get a list of all documents stored in a xml file on github.
     */
    @OpenAPI({ summary: 'Get a list of all documents stored in a xml file on github.' })
    @Get('/document')
    @ResponseSchema(GithubFile, { isArray: true })
    async getAll() {
        return getLawEntries();
    }

    /**
     * Get a document from the database if it exists, otherwise it downloads it from github and saves it to the database.
     * @param path The path to the document on github. Example: `data/xml/1944.033.xml`
     * @returns The document.
     */
    @OpenAPI({ summary: 'Get a document from the database if it exists, otherwise it downloads it from github and saves it to the database.' })
    @Get('/document/:nr/:year')
    @ResponseSchema(Document)
    async get(@Param('nr') nr: string, @Param('year') year: string) {
        let document = await Document.findOneBy({ nr, year });

        if (!document) {
            const path = `data/xml/${year}.${nr}.xml`;
            const file = await downloadFile(path);

            document = await Document.create({
                path,
                content: file,
                year,
                nr,
            }).save();
        }

        return document;
    }

    /** Temporary update endpoint for presentation */
    @Put('/documents/:identifier')
    @ResponseSchema(Document)
    update(
        @Param('identifier') identifier: string,
        @Body({ validate: { skipMissingProperties: true } }) document: Partial<Document>
    ) {
        const [nr, year] = identifier.split('.');
        return Document.update({ nr, year }, document);
    }
}



export default DocumentController;
import { Get, JsonController, Param } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import Document from '../entities/Document';
import User from '../entities/User';
import downloadFile from '../integration/github/downloadFile';
import getLawEntries from '../integration/github/getLawEntries';


@JsonController()
class DocumentController {

    /**
     * Get a list of all documents stored in a xml file on github.
     */
    @OpenAPI({ summary: 'Get a list of all documents stored in a xml file on github.' })
    @Get('/document')
    @ResponseSchema(User, { isArray: true })
    async getAll() {
        return getLawEntries();
    }

    /**
     * Get a document from the database if it exists, otherwise it downloads it from github and saves it to the database.
     * @param path The path to the document on github. Example: `data/xml/1944.033.xml`
     * @returns The document.
     */
    @OpenAPI({ summary: 'Get a document from the database if it exists, otherwise it downloads it from github and saves it to the database.' })
    @Get('/document/:path')
    async get(@Param('path') path: string) {
        let document = await Document.findOneBy({ path });

        if (!document) {
            const file = await downloadFile(path);
            
            const pathParts = path.split('/');
            const identifier = pathParts[pathParts.length - 1].split('.');
            const year = identifier[0];
            const nr = identifier[1];

            document = await Document.create({
                path,
                content: file,
                year,
                nr,
            }).save();
        }

        return document;
    }

}



export default DocumentController;
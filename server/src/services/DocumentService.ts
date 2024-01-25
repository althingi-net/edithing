import { importXml, getTitle } from 'law-document';
import Document from '../entities/Document';
import downloadFile from '../integration/github/downloadFile';

export const findOrImportDocument = async (identifier: string) => {
    let document = await Document.findOneBy({ identifier });

    if (!document) {
        const path = `data/xml/${identifier}.xml`;
        const file = await downloadFile(path);
        const slate = importXml(file);
        const title = getTitle(slate);
        const content = JSON.stringify(slate);

        // Check again if document was created while we were downloading it
        document = await Document.findOneBy({ identifier });

        if (document) {
            return document;
        }

        document = await Document.create({
            identifier,
            title,
            content,
            originalXml: file,
        }).save();
    }

    return document;
};
import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import { ImportError, LawEditor, exportXml, getTitle, importXml, validateDocument } from 'law-document';
import Diff from 'text-diff';
import xmlFormat from 'xml-formatter';
import Document from '../entities/Document';
import downloadFile from '../integration/github/downloadFile';
import getLawEntries from '../integration/github/getLawEntries';

const cacheExpirationInMs = 1000 * 60 * 60 * 24; // 24 hour
const indexXmlCacheFile = 'data/index.json';

/**
 * Calls getLawEntries and saves the result to a file for caching with 24h expiration.
 * @returns result of getLawEntries
 */
export const loadIndexXml = async () => {
    await mkdir(indexXmlCacheFile.split('/').slice(0, -1).join('/'), { recursive: true });

    if (await isExpired(indexXmlCacheFile)) {
        const content = await getLawEntries();
        await writeFile(indexXmlCacheFile, JSON.stringify(content));
        return content;
    }

    const cache = await readFile(indexXmlCacheFile, { encoding: 'utf-8' });
    return JSON.parse(cache) as ReturnType<typeof getLawEntries>;
};

const isExpired = async (file: string) => {
    try {
        const stats = await stat(file);
        return stats.ctimeMs < (Date.now() - cacheExpirationInMs);
    } catch (error) {
        return true;
    }
};

/**
 * Downloads XML file from github if it isn't already cached in the database and parses it to Slate
 * @param identifier year and number of the law, e.g. 1944.033
 * @returns Parsed Slate document
 */
export const findOrImportDocument = async (identifier: string) => {
    let document = await Document.findOneBy({ identifier });

    if (!document) {
        const path = `data/xml/${identifier}.xml`;
        const file = await downloadFile(path);

        try {
            document = await createDocument(identifier, file);
        } catch (error) {
            console.error(error);
            document = await Document.findOneByOrFail({ identifier });
        }
    }

    return document;
};

const createDocument = async (identifier: string, file: string) => {
    try {
        const slate = importXml(file);
        validateDocument(slate);

        // check if import matches export
        const newXml = exportXml({ children: slate } as LawEditor, true);
        const oldXml = xmlFormat(file);
        if (newXml !== oldXml) {
            const diffs = getTextDiffs(oldXml, newXml);
            throw new ImportError(`Import does not match export in ${identifier}: \n${diffs.map(diff => diff[1]).join('\n')}`);
        }
    
        const title = getTitle(slate);
        const content = JSON.stringify(slate);
    
        return await Document.create({
            identifier,
            title,
            content,
            originalXml: file,
        }).save();
    } catch(error: any) {
        return await Document.create({
            identifier,
            title: '...',
            content: JSON.stringify([]),
            originalXml: file,
            importError: error.message,
        }).save();
    }
};

const getTextDiffs = (original: string, newText: string) => {
    const diff = new Diff();
    const changes = diff.main(original, newText) as [type: number, text: string][];
    diff.cleanupSemantic(changes);

    return changes.filter(change => change[0] !== 0);
};
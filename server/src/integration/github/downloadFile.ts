import { readFile } from 'fs/promises';
import { importAllDocuments, XML_CODEX_REPOSITORY } from './importAllDocuments';

const downloadFile = async (file: string) => {
    await importAllDocuments();
    
    return await readFile(`${XML_CODEX_REPOSITORY}/${file}`, { encoding: 'utf-8' });
};

export default downloadFile;
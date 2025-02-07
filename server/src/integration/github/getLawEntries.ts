/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { IsString } from 'class-validator';
import { XMLParser } from 'fast-xml-parser';
import downloadFile from './downloadFile';
import { LEGAL_CODEX_EPOCH } from './importAllDocuments';

export interface GithubFile {
    name: string;
    path: string;
    date: string;
    identifier: string;
}

export class GithubFile implements GithubFile {
    @IsString()
    name!: string;

    @IsString()
    path!: string;

    @IsString()
    date!: string;

    @IsString()
    identifier!: string;
}

interface LawEntry {
    'name': string;
    '@_identifier': string;
    '@_date': string;
    '@_year': string;
    '@_nr': string;
}

const getLawEntries = async (): Promise<GithubFile[]> => {
    const xml = await downloadFile(`data/xml/${LEGAL_CODEX_EPOCH}/index.xml`);
    const parser = new XMLParser({ ignoreAttributes: false });
    const object = parser.parse(xml);

    return object['index']['law-entries']['law-entry'].map((entry: LawEntry) => {
        return {
            name: entry['name'],
            date: entry['@_date'],
            identifier: convertIdentifier(entry['@_identifier']),
            path: `data/xml/${LEGAL_CODEX_EPOCH}/${entry['@_year']}.${entry['@_nr']}.xml`,
        };
    });
};

/**
 * Convert 68/2023 to 2023.68
 */
const convertIdentifier = (identifier: string) => {
    const [nr, year] = identifier.split('/');

    return `${year}.${nr}`;
};

export default getLawEntries;
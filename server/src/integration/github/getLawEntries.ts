/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { XMLParser } from 'fast-xml-parser';
import { IsString } from 'class-validator';
import downloadFile from './downloadFile';

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
    'identifier': string;
    '@_date': string;
    '@_year': string;
    '@_nr': string;
}

const getLawEntries = async (): Promise<GithubFile[]> => {
    const xml = await downloadFile('data/xml/index.xml');
    const parser = new XMLParser({ ignoreAttributes: false });
    const object = parser.parse(xml);

    return object['index']['law-entries']['law-entry'].map((entry: LawEntry) => {
        return {
            name: entry['name'],
            date: entry['@_date'],
            identifier: convertIdentifier(entry['identifier']),
            path: `data/xml/${entry['@_year']}.${entry['@_nr']}.xml`,
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
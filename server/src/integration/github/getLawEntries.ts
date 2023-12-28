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
    const result = await downloadFile('data/xml/index.xml');

    const parser = new XMLParser({ ignoreAttributes: false });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const object = parser.parse(result);

    return object['index']['law-entries']['law-entry'].map((entry: LawEntry) => {
        return {
            name: entry['name'],
            date: entry['@_date'],
            identifier: entry['identifier'],
            path: `data/xml/${entry['@_year']}.${entry['@_nr']}.xml`,
        };
    });
};

export default getLawEntries;
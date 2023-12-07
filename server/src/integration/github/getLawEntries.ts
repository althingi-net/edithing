import { XMLParser } from 'fast-xml-parser';
import downloadFile from './downloadFile';

interface GithubFile {
    name: string;
    path: string;
    date: string;
    identifier: string;
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
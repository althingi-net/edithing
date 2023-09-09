import { XMLParser } from "fast-xml-parser";
import GithubFile from "../models/GithubFile";
import downloadGitFile from "./downloadGitFile";
import fixBase64Decode from "./fixBase64Decode";

const getLawEntries = async (): Promise<GithubFile[]> => {
    let result = await downloadGitFile('data/xml/index.xml')
    result = fixBase64Decode(result)

    const parser = new XMLParser({ ignoreAttributes: false });
    let object = parser.parse(result);

    return object['index']['law-entries']['law-entry'].map((entry: any) => {
        return {
            name: entry['name'],
            date: entry['@_date'],
            identifier: entry['identifier'],
            path: `data/xml/${entry['@_year']}.${entry['@_nr']}.xml`,
        }
    })
}

export default getLawEntries;
import { Octokit } from "octokit";
import decodeBase64 from "./decodeBase64";
import GithubFile from "../models/GithubFile";

const DISABLE_GITHUB = true;
const exampleFile = `PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPGxhdyBu
cj0ibTAwZDAwIiB5ZWFyPSIxMjc1IiBwcmltaXRpdmUtbnI9IjAiPgogIDxu
YW1lPktyaXN0aW5yw6l0dHVyIMOBcm5hIGJpc2t1cHMgw55vcmzDoWtzc29u
YXI8L25hbWU+CiAgPG51bS1hbmQtZGF0ZT4KICAgIDxkYXRlPjEyNzUtMDAt
MDA8L2RhdGU+CiAgICA8b3JpZ2luYWw+MTI3NTwvb3JpZ2luYWw+CiAgPC9u
dW0tYW5kLWRhdGU+CiAgPHN1YmFydCBucj0iMSI+CiAgICA8cGFyYWdyYXBo
IG5yPSIxIj4KICAgICAgPHNlbi8+CiAgICA8L3BhcmFncmFwaD4KICA8L3N1
YmFydD4KICA8YXJ0IG5yPSIxMSI+CiAgICA8bnItdGl0bGU+MTEuPC9uci10
aXRsZT4KICAgIDxuYW1lIG9yaWdpbmFsLXVpLXN0eWxlPSJib2xkIj5VbSBm
b3Jyw6bDsGkgYmlza3VwcyDDoSBraXJranVtIG9rIGVpZ251bSDDvmVpcnJh
LjwvbmFtZT4KICA8L2FydD4KICA8YXJ0IG5yPSIxMiI+CiAgICA8bnItdGl0
bGU+MTIuPC9uci10aXRsZT4KICAgIDxuYW1lIG9yaWdpbmFsLXVpLXN0eWxl
PSJib2xkIj5VbSBraXJranV2w61nc2x1LjwvbmFtZT4KICA8L2FydD4KPC9s
YXc+Cg==`;

const octokit = new Octokit({
    // auth: 'YOUR-TOKEN',
});

const downloadGitFile = async (file: GithubFile) => {
    if (DISABLE_GITHUB) {
        return decodeBase64(exampleFile);
    }

    const result = await octokit.rest.repos.getContent({
        owner: 'althingi-net',
        repo: 'lagasafn-xml',
        path: file.path,
    });

    if (result.status !== 200) {
        throw new Error('Failed to download file from github');
    }

    // @ts-ignore
    if (result.data?.type !== 'file') {
        throw new Error('Github url is not a file');
    }

    // @ts-ignore
    if (result.data?.encoding === 'base64') {
        // @ts-ignore
        return decodeBase64(result.data?.content);
    }

    // @ts-ignore
    return result.data?.content;
}

export default downloadGitFile
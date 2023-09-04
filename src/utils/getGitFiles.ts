import { Octokit } from "octokit";

const DISABLE_GITHUB = true;

export interface GithubFile {
    name: string;
    path: string;
    download_url: string;
    type: string;
}

const octokit = new Octokit({
    // auth: 'YOUR-TOKEN',
});

const getGitFiles = async (page = 0): Promise<GithubFile[]> => {
    let items = [];

    if (DISABLE_GITHUB) {
        return [{
            name: 'test',
            path: 'data/xml/1998.22.xml',
            download_url: 'https://github.com/althingi-net/lagasafn-xml/blob/master/data/xml/1998.22.xml',
            type: 'test',
        }, {
            name: 'test',
            path: 'data/xml/1998.22.xml',
            download_url: 'https://github.com/althingi-net/lagasafn-xml/blob/master/data/xml/1998.22.xml',
            type: 'test',
        }]
    }

    let result = await octokit.request('GET /repos/althingi-net/lagasafn-xml/contents/data/xml/', {
        owner: 'althingi-net',
        repo: 'lagasafn-xml',
        path: 'data/xml/',
        page,
    })

    if (!result || result.status !== 200) {
        throw new Error('Failed to get files from github');
    }

    items = result.data;

    // Only paginate on the first call of getGitFiles
    if (page === 0) {
        while (result.data.length >= 1000) {
            const data = await getGitFiles(page + 1)

            if (!data || data.length === 0) {
                break;
            }
            
            items = [...items, ...data];
        }
    }

    return items
}

export default getGitFiles;
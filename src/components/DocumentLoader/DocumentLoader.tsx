import { Octokit } from "octokit";
import { FC } from "react";

const octokit = new Octokit({
    // auth: 'YOUR-TOKEN',
});

const DocumentLoader: FC = () => {
    octokit.request('GET /repos/althingi-net/lagasafn-xml/contents/data/xml/', {
        owner: 'althingi-net',
        repo: 'lagasafn-xml',
        path: 'data/xml/',
    }).then(({ data }) => {
        console.log(data);
    });

    return <div>DocumentLoader</div>
}

export default DocumentLoader;
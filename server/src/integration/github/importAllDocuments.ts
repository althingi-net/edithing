import path from 'path';
import { GitClient } from 'git-json-merger';
import github from '../../config/github';

export const LEGAL_CODEX_EPOCH = '154c';

export const XML_CODEX_REPOSITORY = path.resolve(process.cwd(), './tmp', 'xml-codex');

export const importAllDocuments = async () => {
    const git = new GitClient(XML_CODEX_REPOSITORY);
    
    if (await git.exists()) {
        await git.pull();
    } else {
        try {
            await git.clone(github.owner, github.repo, github.token);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to clone repository. Missing token?');
        }
    }
};
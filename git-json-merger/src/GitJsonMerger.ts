import { randomUUID } from 'crypto';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { parse, stringify } from 'yaml';
import { GitClient } from './GitClient';

export class GitJsonMerger {
    private mainBranch: string = 'main';
    private repositoriesFolder: string = './tmp';
    private repositoryFolder: string;
    public git: GitClient;

    public constructor(documentKey?: string, cwd?: string) {
        const repository = documentKey ?? randomUUID();
        cwd = cwd ?? process.cwd();
        this.repositoryFolder = path.resolve(cwd, this.repositoriesFolder, repository);

        this.git = new GitClient(this.repositoryFolder);
    }

    public async init(document: object) {
        await this.git.init();
        await this.writeDocument(document, 'Initial commit');
    }

    public async merge(document: object, headHash?: string) {
        const hash = headHash || await this.git.getFirstCommitHash();

        // Create branch and commit changes
        await this.git.switchBranch('temp', hash);
        await this.writeDocument(document, 'Update document');

        // Merge branch
        try {
            await this.git.switchBranch(this.mainBranch);
            await this.git.merge('temp');
            await this.git.deleteBranch('temp');
    
            return {
                hash: await this.git.getCurrentHash(),
                document: await this.readDocument(),
            };
        } catch (error) {
            console.error(error);
            return {
                error: 'Merge conflict',
            };
        }
    }

    private async writeDocument(document: object, msg = '') {
        let content = stringify(document, null, 2);

        // Add padding to each line, to avoid git merge conflicts
        content = content.split('\n').map((line) => line + '\n').join('\n');

        await writeFile(`${this.repositoryFolder}/document.yaml`, content);
        await this.git.addAndCommitAll(msg);
    }

    private async readDocument() {
        const document = await readFile(`${this.repositoryFolder}/document.yaml`, 'utf8');

        return parse(document);
    }
}
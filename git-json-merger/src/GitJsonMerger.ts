import { randomUUID } from 'crypto';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { SimpleGit, simpleGit } from 'simple-git';

export class GitJsonMerger {
    private mainBranch: string = 'main';
    private gitFolder: string = './tmp';
    private repository: string;
    private git?: SimpleGit;

    public constructor(documentKey?: string) {
        this.repository = documentKey ?? randomUUID();
    }

    public async init(document: object) {
        await this.createRepository();
        await this.writeDocument(document, 'Initial commit');
    }

    public async merge(document: object, headHash?: string) {

        if (!this.git) {
            throw new Error('Repository not initialized');
        }

        // Create branch and commit changes
        const start = headHash ?? await this.git.firstCommit();
        await this.git.checkoutBranch('temp', start);
        const hash = await this.writeDocument(document, 'Update document');

        // Merge branch
        try {
            await this.git.checkout(this.mainBranch);
            await this.git.merge(['temp']);
            await this.git.deleteLocalBranch('temp');
    
            return {
                hash: hash,
                document: await this.readDocument(),
            };
        } catch (error) {
            return {
                error: 'Merge conflict',
            };
        }
    }

    private async writeDocument(document: object, msg = '') {
        if (!this.git) {
            throw new Error('Repository not initialized');
        }

        const folder = `${this.gitFolder}/${this.repository}`;

        await mkdir(folder, { recursive: true });
        await writeFile(`${folder}/document.json`, JSON.stringify(document, null, 2));

        await this.git.add('.');
        const result = await this.git.commit(msg);

        return result.commit;
    }

    private async readDocument() {
        const folder = `${this.gitFolder}/${this.repository}`;
        const document = await readFile(`${folder}/document.json`, 'utf8');

        return JSON.parse(document);
    }

    private async createRepository() {
        const folder = `${this.gitFolder}/${this.repository}`;

        console.log('createRepository', folder);
        await rm(folder, { recursive: true, force: true });
        await mkdir(folder, { recursive: true });

        this.git = simpleGit(folder);
        await this.git.init();

        // Setup json merge driver
        //         await this.git.addConfig('merge.json.driver', '$(npm bin)/git-json-merge %A %O %B');
        //         await this.git.addConfig('merge.json.name', 'Custom merge driver for JSON files');
        //         await writeFile(`${folder}/.gitattributes`, '*.json merge=json');
        //         await writeFile(`${folder}/.gitconfig`, `
        // [core]
        //     attributesfile = ~/.gitattributes
        // [merge "json"]
        //     name = custom merge driver for json files
        //     driver = git-json-merge %A %O %B
        //         `);
    }
}
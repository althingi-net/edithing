import { exec } from 'child_process';
import { mkdir, rm } from 'fs/promises';
import { promisify } from 'util';

const run = promisify(exec);

export class GitClient {
    private debug = true;
    private options: object;

    public constructor(
        private repositoryFolder: string
    ) {
        this.options = {
            cwd: this.repositoryFolder,
        };
    }

    /**
     * Create and initialize repository
     */
    public async init() {
        // Create folder
        await mkdir(this.repositoryFolder, { recursive: true });

        // Init git
        await this.run('git init');
    }

    /**
     * Destroy git repository and delete content
     */
    public async destroy() {
        this.log('Destroying repository', this.repositoryFolder);
        await rm(this.repositoryFolder, {
            recursive: true,
            force: true,
        });
    }

    /**
     * Check if repository exists
     */
    public async exists() {
        try {
            await this.run('git status');
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Switch branch and creates if not exists
     * @param name of branch to switch to
     */
    public async switchBranch(name: string, startHash?: string) {
        if (startHash) {
            try {
                await this.run(`git checkout -b ${name} ${startHash}`);
            } catch (error) {
                // If hash is invalid, create branch without hash (this case could happen when git is reset and browser clients still have old hash)
                this.log('Failed to checkout branch with hash, trying without..', error);
                await this.run(`git checkout -b ${name}`);
            }
        } else {
            try {
                await this.run(`git switch -c ${name}`);
            } catch (error) {
                await this.run(`git switch ${name}`);
            }
        }
    }

    /**
     * Delete branch
     * @param name of branch to delete
     */
    public async deleteBranch(name: string) {
        await this.run(`git branch -D ${name}`);
    }

    /**
     * Add and commit all changes
     * @param message commit message
     */
    public async addAndCommitAll(message = '') {
        await this.run('git add .');
        await this.run(`git commit -m "${message}"`);
    }

    /**
     * Merge branch into current branch
     * @param branch name of branch to merge
     */
    public async merge(branch: string) {
        await this.run(`git merge ${branch}`);
    }

    public async abortMerge() {
        await this.run('git merge --abort');
    }

    public async getCurrentHash() {
        const { stdout } = await this.run('git rev-parse --short HEAD');
        return stdout;
    }

    public async getFirstCommitHash() {
        const { stdout } = await this.run('git rev-list --max-parents=0 HEAD');
        return stdout;
    }

    public async addConfig(key: string, value: string) {
        await this.run(`git config ${key} "${value}"`);
    }

    public async getDiff() {
        const { stdout } = await this.run('git diff');
        return stdout;
    }

    private async run(cmd: string) {
        this.log(cmd);

        const options = {
            cwd: this.repositoryFolder,
        };

        const { stderr, stdout } = await run(cmd, options);

        if (stdout) {
            this.log('  > ', stdout);
        }
        if (stderr) {
            this.log('  > ', stderr);
        }

        // Remove trailing newline
        const filteredStdout = stdout.replace(/\n$/, '');

        return {
            stderr,
            stdout: filteredStdout,
        };
    }

    private log(...args: any[]) {
        if (this.debug) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            console.log(...args);
        }
    }
}
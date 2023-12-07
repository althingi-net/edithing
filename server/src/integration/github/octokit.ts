import { Octokit } from 'octokit';
import github from '../../config/github';

if (!github.token) {
    throw new Error('Missing github token. Please create a .env file with a GITHUB_TOKEN variable.');
}

const octokit = new Octokit({
    auth: github.token,
});

export default octokit;
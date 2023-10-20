import { Octokit } from 'octokit';

if (!process.env.REACT_APP_GITHUB_TOKEN) {
    throw new Error('Missing github token. Please create a .env file with a REACT_APP_GITHUB_TOKEN variable.');
}

const octokit = new Octokit({
    auth: process.env.REACT_APP_GITHUB_TOKEN,
});

export default octokit;
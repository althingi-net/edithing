import { Octokit } from 'octokit';
import github from '../../config/github';

const octokit = new Octokit({
    auth: github.token,
});

export default octokit;
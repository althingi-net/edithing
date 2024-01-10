import github from '../../config/github';
import octokit from './octokit';

const downloadFile = async (file: string) => {
    const response = await octokit.rest.repos.getContent({
        owner: github.owner,
        repo: github.repo,
        path: file,
        mediaType: {
            format: 'raw',
        },
    });
    const { data } = response;

    return data as unknown as string;
};

export default downloadFile;
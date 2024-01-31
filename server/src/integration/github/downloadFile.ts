import { HttpError } from 'routing-controllers';
import github from '../../config/github';
import octokit from './octokit';

const downloadFile = async (file: string) => {
    try {
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
    } catch(error) {
        throw new HttpError(404, 'File not found');
    }
};

export default downloadFile;
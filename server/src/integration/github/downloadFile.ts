import github from '../../config/github';
import decodeBase64 from './decodeBase64';
import octokit from './octokit';

const downloadFile = async (file: string) => {
    const { data } = await octokit.rest.repos.getContent({
        owner: github.owner,
        repo: github.repo,
        path: file,
    });

    // @ts-expect-error type conflict
    if (data.type !== 'file') {
        throw new Error('Github url is not a file');
    }

    // @ts-expect-error type conflict
    if (data.encoding === 'base64') {
        // @ts-expect-error type conflict
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return decodeBase64(data.content);
    }

    // @ts-expect-error type conflict
    return data.content;
};

export default downloadFile;
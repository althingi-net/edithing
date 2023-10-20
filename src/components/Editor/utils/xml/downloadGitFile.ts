/* eslint-disable @typescript-eslint/ban-ts-comment */
import github from '../../../../api/github';
import decodeBase64 from './decodeBase64';

const exampleXml = `
    <law nr="33" year="1944">
    <chapter nr="1" nr-type="roman" roman-nr="I">
        <nr-title>I.</nr-title>
        <art nr="1">
        <nr-title>1. gr.</nr-title>
        <subart nr="1">
            <paragraph nr="1">
            <sen>Ísland er lýðveldi með þingbundinni stjórn.</sen>
            </paragraph>
        </subart>
        </art>
        <art nr="2">
        <nr-title>2. gr.</nr-title>
        <subart nr="1">
            <paragraph nr="1">
            <sen>Alþingi og forseti Íslands fara saman með löggjafarvaldið.</sen>
            <sen>Forseti og önnur stjórnarvöld samkvæmt stjórnarskrá þessari og öðrum landslögum fara með framkvæmdarvaldið.</sen>
            <sen>Dómendur fara með dómsvaldið.</sen>
            </paragraph>
        </subart>
        </art>
    </chapter>
    </law> 
`;

const downloadGitFile = async (file: string) => {
    if (process.env.REACT_APP_DISABLE_GITHUB === 'true') {
        return exampleXml;
    }

    const { data, status } = await github.rest.repos.getContent({
        owner: 'althingi-net',
        repo: 'lagasafn-xml',
        path: file,
    });

    if (status !== 200) {
        throw new Error('Failed to download file from github');
    }

    // @ts-ignore
    if (data.type !== 'file') {
        throw new Error('Github url is not a file');
    }

    // @ts-ignore
    if (data.encoding === 'base64') {
        // @ts-ignore
        return decodeBase64(data?.content);
    }

    // @ts-ignore
    return data.content;
};

export default downloadGitFile;
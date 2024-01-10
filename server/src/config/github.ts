const github = {
    disable: process.env.DISABLE_GITHUB === 'true',
    token: process.env.GITHUB_TOKEN,
    owner: 'althingi-net',
    repo: 'lagasafn-xml',
};

export default github;
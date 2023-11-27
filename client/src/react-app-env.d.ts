/// <reference types="react-scripts" />
declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_DEBUG: string;
        REACT_APP_GITHUB_TOKEN: string;
        REACT_APP_DISABLE_GITHUB: string;
    }
}
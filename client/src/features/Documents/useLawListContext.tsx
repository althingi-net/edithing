import { DocumentService, GithubFile } from 'client-sdk';
import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import handleError from '../App/handleError';

type LawListContextType = {
    lawList: GithubFile[];
}

const LawListContext = createContext<LawListContextType>({
    lawList: [],
});

export const LawListContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [lawList, setLawList] = useState<GithubFile[]>([]);

    useEffect(() => {
        DocumentService.documentControllerGetAll()
            .then(setLawList)
            .catch(handleError);
    }, []);

    return (
        <LawListContext.Provider value={{ lawList }}>
            {children}
        </LawListContext.Provider>
    );
};

const useLawListContext = () => {
    return useContext(LawListContext);
};

export default useLawListContext;
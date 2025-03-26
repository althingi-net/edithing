import { DocumentService, GithubFile } from 'client-sdk';
import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import handleError from '../App/handleError';

type LawListContextType = {
    lawList: GithubFile[];
}

const LawListContext = createContext<LawListContextType>([] as unknown as LawListContextType);

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
    const context = useContext(LawListContext);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!context) {
        throw new Error('useLawListContext must be used within a LawListContextProvider');
    }

    return context;
};

export default useLawListContext;
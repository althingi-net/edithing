import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import GithubFile from "../../models/GithubFile";
import getLawEntries from "./getLawEntries";

type LawListContextType = {
    lawList: GithubFile[];
}

const LawListContext = createContext<LawListContextType>({
    lawList: [],
})

export const LawListContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [lawList, setLawList] = useState<GithubFile[]>([]);

    useEffect(() => {
        getLawEntries().then(setLawList);
    }, []);

    return (
        <LawListContext.Provider value={{ lawList }}>
            {children}
        </LawListContext.Provider>
    )
}

const useLawListContext = () => {
  return useContext(LawListContext);
}

export default useLawListContext;
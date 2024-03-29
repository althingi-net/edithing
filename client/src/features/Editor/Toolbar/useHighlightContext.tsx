import { FC, PropsWithChildren, createContext, useContext, useState } from 'react';

type HighlightContextType = {
    isHighlighted: boolean;
    setHighlighted: (highlightedSentences: boolean) => void;
}

const HighlightContext = createContext<HighlightContextType | null>(null);

export const HightlightContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [isHighlighted, setHighlighted] = useState(true);

    return (
        <HighlightContext.Provider value={{ isHighlighted, setHighlighted }}>
            {children}
        </HighlightContext.Provider>
    );
};

const useHighlightContext = () => {
    const context = useContext(HighlightContext);

    if (!context) {
        throw new Error('useHighlightContext must be used within a HightlightContextProvider');
    }

    return context;
};

export default useHighlightContext;
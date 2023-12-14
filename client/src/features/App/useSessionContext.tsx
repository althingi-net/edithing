import { LoginResponse, User } from 'client-sdk';
import { FC, PropsWithChildren, createContext, useContext, useState } from 'react';

interface Session extends LoginResponse {
    token: string;
    user: User;
}

type SessionContextType = {
    session: Session | null;
    setSession: (session: Session) => void;
    isAuthenticated: () => boolean;
    logout: () => void;
};

const SessionContext = createContext<SessionContextType | null>(null);

const retrieveLocalSession = () => {
    const session = localStorage.getItem('session');
    if (session) {
        return JSON.parse(session) as Session;
    } else {
        return null;
    }
};

export const SessionContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [session, setSession] = useState(retrieveLocalSession());

    const handleSetSession = (session: Session | null) => {
        setSession(session);
        localStorage.setItem('session', JSON.stringify(session));
    };

    const isAuthenticated = () => {
        return !!session;
    };

    const logout = () => {
        handleSetSession(null);
    };
    
    return (
        <SessionContext.Provider value={{ session, setSession: handleSetSession, isAuthenticated, logout }}>
            {children}
        </SessionContext.Provider>
    );
};

const useSessionContext = () => {
    const context = useContext(SessionContext);

    if (!context) {
        throw new Error('useSessionContext must be used within a SessionContextProvider');
    }

    return context;
};

export default useSessionContext;
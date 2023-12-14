import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [theme, setTheme] = useState(getBrowserTheme());

    const proxySetTheme = (theme: 'light' | 'dark') => {
        setTheme(theme);
        localStorage.setItem('theme', theme);
    };
    
    useEffect(() => {
        if('matchMedia' in window){
            const updateColorScheme = (event: MediaQueryListEvent) => {
                if(event.matches){
                    setTheme('dark');
                } else {
                    setTheme('light');
                }
            };

            const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            colorSchemeQuery.addEventListener('change', updateColorScheme);

            return () => {
                colorSchemeQuery.removeEventListener('change', updateColorScheme);
            };
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme: proxySetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

const getBrowserTheme = () => {
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
        return storedTheme as 'light' | 'dark';
    }

    if ('matchMedia' in window) {
        if(window.matchMedia('(prefers-color-scheme: dark)').matches){
            return 'dark' as const;
        } else {
            return 'light' as const;
        }
    } else {
        return 'light' as const;
    }
};

const useThemeContext = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeContextProvider');
    }

    return context;
};

export default useThemeContext;
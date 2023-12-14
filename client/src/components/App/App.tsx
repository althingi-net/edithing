import { Layout } from 'antd';
import { LawListContextProvider } from '../DocumentSelector/useLawListContext';
import { HightlightContextProvider } from '../Editor/Toolbar/useHighlightContext';
import Router from './Router';
import { LanguageContextProvider } from './useLanguageContext';
import { ThemeContextProvider } from './useThemeContext';
import { SessionContextProvider } from './useSessionContext';

function App() {
    return (
        <ThemeContextProvider>
            <SessionContextProvider>
                <LanguageContextProvider>
                    <HightlightContextProvider>
                        <LawListContextProvider>
                            <Layout>
                                <Router />
                            </Layout>
                        </LawListContextProvider>
                    </HightlightContextProvider>
                </LanguageContextProvider>
            </SessionContextProvider>
        </ThemeContextProvider>
    );
}

export default App;

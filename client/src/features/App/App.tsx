import { Layout } from 'antd';
import { LawListContextProvider } from '../DocumentSelector/useLawListContext';
import { HightlightContextProvider } from '../Editor/Toolbar/useHighlightContext';
import Router from './Router';
import { LanguageContextProvider } from './useLanguageContext';
import { ThemeContextProvider } from './useThemeContext';
import { SessionContextProvider } from './useSessionContext';

function App() {
    return (
        <SessionContextProvider>
            <ThemeContextProvider>
                <LanguageContextProvider>
                    <HightlightContextProvider>
                        <LawListContextProvider>
                            <Layout style={{ height: '100vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                                <Router />
                            </Layout>
                        </LawListContextProvider>
                    </HightlightContextProvider>
                </LanguageContextProvider>
            </ThemeContextProvider>
        </SessionContextProvider>
    );
}

export default App;

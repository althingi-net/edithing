import { Layout } from 'antd';
import { LawListContextProvider } from '../DocumentSelector/useLawListContext';
import { HightlightContextProvider } from '../Editor/Toolbar/useHighlightContext';
import Router from './Router';
import { LanguageContextProvider } from './useLanguageContext';
import { ThemeContextProvider } from './useThemeContext';

function App() {
    return (
        <ThemeContextProvider>
            <LanguageContextProvider>
                <HightlightContextProvider>
                    <LawListContextProvider>
                        <Layout>
                            <Router />
                        </Layout>
                    </LawListContextProvider>
                </HightlightContextProvider>
            </LanguageContextProvider>
        </ThemeContextProvider>
    );
}

export default App;

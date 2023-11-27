import { Layout } from 'antd';
import { LawListContextProvider } from '../DocumentSelector/useLawListContext';
import { HightlightContextProvider } from '../Editor/Toolbar/useHighlightContext';
import Router from './Router';
import { LanguageContextProvider } from './useLanguageContext';

function App() {
    return (
        <LanguageContextProvider>
            <HightlightContextProvider>
                <LawListContextProvider>
                    <Layout>
                        <Router />
                    </Layout>
                </LawListContextProvider>
            </HightlightContextProvider>
        </LanguageContextProvider>
    );
}

export default App;

import { Layout } from 'antd';
import { LawListContextProvider } from '../DocumentSelector/useLawListContext';
import { HightlightContextProvider } from '../Editor/Toolbar/useHighlightContext';
import Router from './Router';

function App() {
    return (
        <HightlightContextProvider>
            <LawListContextProvider>
                <Layout>
                    <Router />
                </Layout>
            </LawListContextProvider>
        </HightlightContextProvider>
    );
}

export default App;

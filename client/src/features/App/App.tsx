/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Layout } from 'antd';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import BillPage from '../../pages/BillPage';
import BillsPage from '../../pages/BillsPage';
import LawListPage from '../../pages/LawListPage';
import LawPage from '../../pages/LawPage';
import { LawListContextProvider } from '../Documents/useLawListContext';
import { BlockNavigationProvider } from './useBlockNavigation';
import { LanguageContextProvider } from './useLanguageContext';
import { SessionContextProvider } from './useSessionContext';
import { ThemeContextProvider } from './useThemeContext';
import Header from './Header';
import UnknownError from './UnknownError';
import { EditorConfigContextProvider } from 'law-document-editor';

const router = createBrowserRouter([{
    element: (
        <LanguageContextProvider>
            <BlockNavigationProvider>
                <SessionContextProvider>
                    <ThemeContextProvider>
                        <EditorConfigContextProvider>
                            <LawListContextProvider>
                                <Layout style={{ height: '100vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                                    <Header />
                                    <ErrorBoundary FallbackComponent={UnknownError} >
                                        <Outlet />
                                    </ErrorBoundary>
                                </Layout>
                            </LawListContextProvider>
                        </EditorConfigContextProvider>
                    </ThemeContextProvider>
                </SessionContextProvider>
            </BlockNavigationProvider>
        </LanguageContextProvider>
    ),
    children: [
        {
            path: '/',
            element: <LawListPage />,
        }, {
            path: '/law/:identifier',
            element: <LawPage />,
        }, {
            path: '/bills',
            element: <BillsPage />,
        }, {
            path: '/bill/:id',
            element: <BillPage />,
        }, {
            path: '/bill/:id/document/:identifier',
            element: <BillPage />,
        },
    ],
}]);

// @ts-ignore
if (import.meta.hot) {
    // @ts-ignore
    import.meta.hot.dispose(() => router.dispose());
}

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
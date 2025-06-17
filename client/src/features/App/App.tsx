/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Layout } from 'antd';
import { EditorConfigContextProvider } from 'law-document-editor';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';
import BillPage from '../../pages/BillPage';
import BillsPage from '../../pages/BillsPage';
import LawListPage from '../../pages/LawListPage';
import LawPage from '../../pages/LawPage';
import { LawListContextProvider } from '../Documents/useLawListContext';
import Header from './Header';
import UnknownError from './UnknownError';
import { ThemeContextProvider } from './useThemeContext';
import BlockNavigation from './BlockNavigation';

const router = createBrowserRouter([{
    element: (
        <EditorConfigContextProvider>
            <LawListContextProvider>
                <BlockNavigation>
                    <Layout style={{ height: '100vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <Header />
                        <ErrorBoundary FallbackComponent={UnknownError} >
                            <Outlet />
                        </ErrorBoundary>
                    </Layout>
                </BlockNavigation>
            </LawListContextProvider>
        </EditorConfigContextProvider>
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

const App = () => {
    return (
        <ThemeContextProvider>
            <RouterProvider router={router} />
        </ThemeContextProvider>
    );
};

export default App;
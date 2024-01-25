/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LawListPage from '../../pages/LawListPage';
import LawPage from '../../pages/LawPage';
import BillsPage from '../../pages/BillsPage';
import BillPage from '../../pages/BillPage';
import useLanguageContext from './useLanguageContext';

const router = createBrowserRouter([{
    path: '/',
    element: <LawListPage/>,
}, {
    path: '/law/:identifier',
    element: <LawPage/>,
}, {
    path: '/bills',
    element: <BillsPage/>,
}, {
    path: '/bill/:id',
    element: <BillPage/>,
}]);

const Router: FC = () => {
    const { t } = useLanguageContext();

    return <RouterProvider router={router} fallbackElement={<p>{t('Loading...')}</p>} />;
};

export default Router;

// @ts-ignore
if (import.meta.hot) {
    // @ts-ignore
    import.meta.hot.dispose(() => router.dispose());
}

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LawListPage from '../../pages/LawListPage';
import LawPage from '../../pages/LawPage';

const router = createBrowserRouter([{
    path: '/',
    element: <LawListPage/>,
}, {
    path: '/law/:nr/:year',
    element: <LawPage/>,
}]);

const Router: FC = () => {
    return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
};

export default Router;

// @ts-ignore
if (import.meta.hot) {
    // @ts-ignore
    import.meta.hot.dispose(() => router.dispose());
}

import { createBrowserRouter } from 'react-router';
import { App } from './app';
import { ROUTES } from '../shared/constants/routes';
import { HomePageLazy } from '../pages/home/home-page-lazy.ts';
import { NotFoundPageLazy } from '../pages/errors/not-found-page/not-found-page.lazy.ts';
import { NotAccessPageLazy } from '../pages/errors/not-access-page/not-access-page.lazy.ts';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePageLazy />,
      },
      {
        path: ROUTES.NOT_FOUND,
        element: <NotFoundPageLazy />,
      },
      {
        path: ROUTES.NOT_ACCESS,
        element: <NotAccessPageLazy />,
      },
      { path: '*', element: <NotFoundPageLazy /> },
    ],
  },
]);

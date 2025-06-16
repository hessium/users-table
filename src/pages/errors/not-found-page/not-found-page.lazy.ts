import { lazy } from 'react';

export const NotFoundPageLazy = lazy(() =>
  import('./not-found-page.tsx').then((res) => ({
    default: res.NotFoundPage,
  })),
);

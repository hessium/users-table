import { lazy } from 'react';

export const NotAccessPageLazy = lazy(() =>
  import('./not-access-page.tsx').then((res) => ({
    default: res.NotAccessPage,
  })),
);

import { lazy } from 'react';

export const HomePageLazy = lazy(() =>
  import('./home-page.tsx').then((res) => ({
    default: res.HomePage,
  })),
);

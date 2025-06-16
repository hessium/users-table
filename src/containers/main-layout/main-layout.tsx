import type { PropsWithChildren } from 'react';

export const MainLayout = (props: PropsWithChildren) => {
  return (
    <main className="md:px-11 md:py-8 p-2 min-h-screen">{props.children}</main>
  );
};

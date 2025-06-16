import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundaryLayout } from "./containers/error-boundary/error-boundary.tsx";
import { RouterProvider } from "react-router";
import { router } from "./router.tsx";
import "../public/styles/index.css";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      retry: 0,
      staleTime: 5 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundaryLayout>
        <RouterProvider router={router} />
      </ErrorBoundaryLayout>
    </QueryClientProvider>
  </StrictMode>,
);

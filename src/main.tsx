import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundaryLayout } from "./containers/error-boundary/error-boundary.tsx";

import "../public/styles/index.css";
import { App } from "./app.tsx";

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
        <App />
      </ErrorBoundaryLayout>
    </QueryClientProvider>
  </StrictMode>,
);

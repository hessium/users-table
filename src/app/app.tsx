import { Outlet } from "react-router";
import { Toaster } from "../shared/ui/sonner/sonner.tsx";
import { MainLayout } from "../containers/main-layout/main-layout.tsx";

export function App() {
  return (
    <MainLayout>
      <Toaster />
      <Outlet />
    </MainLayout>
  );
}

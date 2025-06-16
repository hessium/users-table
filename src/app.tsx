import { Toaster } from "./shared/ui/sonner/sonner.tsx";
import { MainLayout } from "./containers/main-layout/main-layout.tsx";
import { HomePage } from "./components/home/home-page.tsx";

export function App() {
  return (
    <MainLayout>
      <Toaster />

      <HomePage />
    </MainLayout>
  );
}

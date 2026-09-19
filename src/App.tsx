import { Outlet } from "react-router";
import { Toaster } from "sonner";

import { BottomNav } from "./components/layout/BottomNav";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";

/** Layout principal: cabeçalho e rodapé fixos, com a página atual no meio. */
export function App() {
  return (
    // O espaço embaixo no celular evita que o BottomNav cubra o conteúdo.
    // O overflow-x segura o fundo dos detalhes, que é mais largo que a coluna de conteúdo.
    <div className="flex min-h-screen flex-col overflow-x-hidden pb-16 sm:pb-0">
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <Footer />
      <BottomNav />

      {/* Avisos de sucesso e erro. No celular sobem um pouco para não ficar atrás do BottomNav. */}
      <Toaster
        position="top-center"
        mobileOffset={{ bottom: "76px", left: "16px", right: "16px" }}
        theme="dark"
        richColors
        closeButton
      />
    </div>
  );
}

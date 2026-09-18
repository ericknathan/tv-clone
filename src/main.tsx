import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import "./index.css";

import { App } from "./App";
import { ListsLayout } from "./components/layout/ListsLayout";
import { AppDataProvider } from "./context/AppDataContext";
import { Home } from "./pages/Home";
import { ListDetails } from "./pages/ListDetails";
import { Lists } from "./pages/Lists";
import { NotFound } from "./pages/NotFound";
import { Profile } from "./pages/Profile";
import { SearchResults } from "./pages/SearchResults";
import { TitleDetails } from "./pages/TitleDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // layout principal (cabeçalho e rodapé)
    children: [
      { index: true, element: <Home /> },
      { path: "buscar", element: <SearchResults /> },
      { path: "titulo/:mediaType/:id", element: <TitleDetails /> }, // rota dinâmica
      { path: "perfil", element: <Profile /> },
      {
        path: "listas",
        element: <ListsLayout />, // layout das páginas de listas
        children: [
          { index: true, element: <Lists /> },
          { path: ":listId", element: <ListDetails /> }, // rota dinâmica
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppDataProvider>
      <RouterProvider router={router} />
    </AppDataProvider>
  </StrictMode>,
);

import { House, ListPlus, User } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router";

import { SearchBar } from "../SearchBar";

/** Deixa o link da página atual em destaque. */
function estiloDoLink({ isActive }: { isActive: boolean }) {
  const base = "flex items-center gap-1 transition-colors";
  return isActive ? `${base} text-destaque` : `${base} text-texto-suave hover:text-texto`;
}

export function Header() {
  const navegar = useNavigate();

  function handleSearch(termo: string) {
    if (!termo) return;
    navegar(`/buscar?q=${encodeURIComponent(termo)}`, { viewTransition: true });
  }

  return (
    <header className="border-b border-borda bg-superficie">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
        <Link
          to="/"
          viewTransition
          className="text-lg font-bold text-destaque transition-opacity hover:opacity-80"
        >
          TV Clone
        </Link>

        {/* No celular esta navegação dá lugar ao BottomNav. */}
        <nav className="hidden gap-4 text-sm sm:flex">
          <NavLink to="/" end viewTransition className={estiloDoLink}>
            <House className="size-4" />
            Início
          </NavLink>

          <NavLink to="/listas" viewTransition className={estiloDoLink}>
            <ListPlus className="size-4" />
            Minhas listas
          </NavLink>

          <NavLink to="/perfil" viewTransition className={estiloDoLink}>
            <User className="size-4" />
            Perfil
          </NavLink>
        </nav>

        <div className="sm:ml-auto sm:w-80">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </header>
  );
}

import { House, ListPlus, User } from "lucide-react";
import { NavLink } from "react-router";

/** Deixa o item da página atual em destaque. */
function estiloDoItem({ isActive }: { isActive: boolean }) {
  const base = "flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors";
  return isActive ? `${base} text-destaque` : `${base} text-texto-suave`;
}

/**
 * Navegação inferior do celular, no lugar do menu do topo (como no app original).
 * Fica escondida a partir do breakpoint sm, onde o menu do Header assume.
 */
export function BottomNav() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-10 flex border-t border-borda bg-superficie pb-[env(safe-area-inset-bottom)] sm:hidden"
    >
      <NavLink to="/" end className={estiloDoItem}>
        <House className="size-5" />
        Início
      </NavLink>

      <NavLink to="/listas" className={estiloDoItem}>
        <ListPlus className="size-5" />
        Listas
      </NavLink>

      <NavLink to="/perfil" className={estiloDoItem}>
        <User className="size-5" />
        Perfil
      </NavLink>
    </nav>
  );
}

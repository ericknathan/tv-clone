import { Outlet } from "react-router";

/** Layout das páginas de listas: mantém o título da seção fixo e troca só o conteúdo. */
export function ListsLayout() {
  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold">Minhas listas</h1>
        <p className="text-sm text-texto-suave">
          Organize os filmes e séries que você quer assistir do seu jeito.
        </p>
      </div>

      <Outlet />
    </section>
  );
}

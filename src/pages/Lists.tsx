import { Trash2 } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";

import { EmptyState } from "../components/EmptyState";
import { useAppData } from "../context/AppDataContext";

export function Lists() {
  const { lists, createList, deleteList, isLoaded } = useAppData();
  const [nome, setNome] = useState("");

  function handleCriar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const nomeLimpo = nome.trim();
    if (!nomeLimpo) return;

    createList(nomeLimpo);
    setNome("");
  }

  // Evita mostrar o estado vazio por um instante antes de ler o que está salvo.
  if (!isLoaded) return null;

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleCriar} className="flex gap-2">
        <input
          type="text"
          value={nome}
          onChange={(evento) => setNome(evento.target.value)}
          placeholder="Nome da nova lista (ex: Quero assistir)"
          className="flex-1 rounded-lg border border-borda bg-superficie px-3 py-2 text-sm outline-none transition-colors placeholder:text-texto-suave focus:border-destaque focus:ring-2 focus:ring-destaque/30"
        />

        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-destaque px-4 py-2 text-sm font-semibold text-fundo transition-opacity hover:opacity-90"
        >
          Criar lista
        </button>
      </form>

      {lists.length === 0 ? (
        <EmptyState
          title="Você ainda não tem listas"
          description="Crie sua primeira lista no campo acima para começar a organizar filmes e séries."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((lista) => (
            <li
              key={lista.id}
              className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-borda bg-superficie p-4 transition-colors hover:border-destaque/60"
            >
              <Link to={`/listas/${lista.id}`} className="group min-w-0 flex-1">
                <p className="truncate font-semibold transition-colors group-hover:text-destaque">
                  {lista.name}
                </p>
                <p className="text-sm text-texto-suave">
                  {lista.items.length} {lista.items.length === 1 ? "título" : "títulos"}
                </p>
              </Link>

              <button
                type="button"
                onClick={() => deleteList(lista.id)}
                aria-label={`Excluir a lista ${lista.name}`}
                className="cursor-pointer rounded-full border border-borda p-2 text-texto-suave transition-colors hover:border-red-400 hover:text-red-400"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

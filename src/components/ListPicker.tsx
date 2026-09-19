import { Check, Plus } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

import { useAppData } from "../context/AppDataContext";
import type { TitleSummary } from "../types";

/** Marca em quais listas do usuário o título está, e permite criar uma lista nova. */
export function ListPicker({ title }: { title: TitleSummary }) {
  const { lists, createList, addTitleToList, removeTitleFromList, isTitleInList } = useAppData();
  const [novaLista, setNovaLista] = useState("");

  function handleAlternar(listId: string) {
    if (isTitleInList(listId, title.mediaType, title.id)) {
      removeTitleFromList(listId, title.mediaType, title.id);
    } else {
      addTitleToList(listId, title);
    }
  }

  function handleCriarLista(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const nome = novaLista.trim();
    if (!nome) return;

    const lista = createList(nome);
    addTitleToList(lista.id, title);
    setNovaLista("");
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-borda bg-superficie p-4">
      <h2 className="font-semibold">Minhas listas</h2>

      {lists.length === 0 ? (
        <p className="text-sm text-texto-suave">
          Você ainda não tem listas. Crie a primeira abaixo e este título já entra nela.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {lists.map((lista) => {
            const contem = isTitleInList(lista.id, title.mediaType, title.id);

            return (
              <li key={lista.id}>
                <button
                  type="button"
                  onClick={() => handleAlternar(lista.id)}
                  className={
                    contem
                      ? "flex w-full cursor-pointer items-center justify-between rounded-lg border border-destaque bg-fundo px-3 py-2 text-sm transition-colors hover:bg-superficie"
                      : "flex w-full cursor-pointer items-center justify-between rounded-lg border border-borda bg-fundo px-3 py-2 text-sm transition-colors hover:border-destaque"
                  }
                >
                  <span>{lista.name}</span>

                  {contem ? (
                    <span className="flex items-center gap-1 text-destaque">
                      <Check className="size-4" />
                      Na lista
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-texto-suave">
                      <Plus className="size-4" />
                      Adicionar
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={handleCriarLista} className="flex gap-2">
        <input
          type="text"
          value={novaLista}
          onChange={(evento) => setNovaLista(evento.target.value)}
          placeholder="Nova lista (ex: Maratona)"
          className="flex-1 rounded-lg border border-borda bg-fundo px-3 py-2 text-sm outline-none transition-colors placeholder:text-texto-suave focus:border-destaque focus:ring-2 focus:ring-destaque/30"
        />

        <button
          type="submit"
          disabled={novaLista.trim() === ""}
          className="cursor-pointer rounded-lg bg-destaque px-3 py-2 text-sm font-semibold text-fundo transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:opacity-40"
        >
          Criar
        </button>
      </form>
    </div>
  );
}

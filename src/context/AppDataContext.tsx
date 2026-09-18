import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { MediaType, Review, TitleSummary, UserList } from "../types";

const CHAVE_AVALIACOES = "tvclone:avaliacoes";
const CHAVE_LISTAS = "tvclone:listas";

/** Lista criada automaticamente pelo botão "+" dos cards. */
const LISTA_PADRAO = "Quero assistir";

type AppDataContextValue = {
  reviews: Review[];
  lists: UserList[];
  /** Indica que os dados salvos já foram lidos do navegador. */
  isLoaded: boolean;
  getReview: (mediaType: MediaType, titleId: number) => Review | undefined;
  saveReview: (title: TitleSummary, rating: number, comment: string) => void;
  createList: (name: string) => UserList;
  deleteList: (listId: string) => void;
  addTitleToList: (listId: string, title: TitleSummary) => void;
  removeTitleFromList: (listId: string, mediaType: MediaType, titleId: number) => void;
  isTitleInList: (listId: string, mediaType: MediaType, titleId: number) => boolean;
  toggleTitleInDefaultList: (title: TitleSummary) => void;
  isTitleInDefaultList: (mediaType: MediaType, titleId: number) => boolean;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

/** Lê uma lista salva no navegador, protegendo contra conteúdo inválido. */
function lerDoNavegador<T>(chave: string): T[] {
  try {
    const bruto = localStorage.getItem(chave);
    if (!bruto) return [];

    const dados = JSON.parse(bruto);
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function gravarNoNavegador(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // Aba anônima ou armazenamento cheio: a aplicação continua funcionando sem salvar.
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [lists, setLists] = useState<UserList[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega as avaliações e listas salvas quando a aplicação abre.
  useEffect(() => {
    setReviews(lerDoNavegador<Review>(CHAVE_AVALIACOES));
    setLists(lerDoNavegador<UserList>(CHAVE_LISTAS));
    setIsLoaded(true);
  }, []);

  // Salva a cada mudança. A guarda impede gravar o estado vazio antes da carga terminar.
  useEffect(() => {
    if (!isLoaded) return;
    gravarNoNavegador(CHAVE_AVALIACOES, reviews);
  }, [reviews, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    gravarNoNavegador(CHAVE_LISTAS, lists);
  }, [lists, isLoaded]);

  function getReview(mediaType: MediaType, titleId: number) {
    return reviews.find(
      (avaliacao) => avaliacao.mediaType === mediaType && avaliacao.titleId === titleId,
    );
  }

  function saveReview(title: TitleSummary, rating: number, comment: string) {
    const nova: Review = {
      mediaType: title.mediaType,
      titleId: title.id,
      rating,
      comment,
      title,
      createdAt: new Date().toISOString(),
    };

    // Uma avaliação por título: a anterior é substituída pela nova.
    setReviews((anteriores) => [
      nova,
      ...anteriores.filter(
        (avaliacao) => !(avaliacao.mediaType === title.mediaType && avaliacao.titleId === title.id),
      ),
    ]);
  }

  function createList(name: string) {
    const nova: UserList = {
      id: String(Date.now()),
      name: name.trim(),
      items: [],
      createdAt: new Date().toISOString(),
    };

    // Forma funcional em todos os mutadores: assim duas ações disparadas no mesmo
    // clique (criar a lista e já adicionar o título) enxergam o estado atualizado.
    setLists((anteriores) => [...anteriores, nova]);
    return nova;
  }

  function deleteList(listId: string) {
    setLists((anteriores) => anteriores.filter((lista) => lista.id !== listId));
  }

  function addTitleToList(listId: string, title: TitleSummary) {
    setLists((anteriores) =>
      anteriores.map((lista) => {
        const jaTem = lista.items.some(
          (item) => item.mediaType === title.mediaType && item.id === title.id,
        );

        if (lista.id !== listId || jaTem) return lista;
        return { ...lista, items: [...lista.items, title] };
      }),
    );
  }

  function removeTitleFromList(listId: string, mediaType: MediaType, titleId: number) {
    setLists((anteriores) =>
      anteriores.map((lista) => {
        if (lista.id !== listId) return lista;

        return {
          ...lista,
          items: lista.items.filter(
            (item) => !(item.mediaType === mediaType && item.id === titleId),
          ),
        };
      }),
    );
  }

  function isTitleInList(listId: string, mediaType: MediaType, titleId: number) {
    const lista = lists.find((item) => item.id === listId);
    if (!lista) return false;

    return lista.items.some((item) => item.mediaType === mediaType && item.id === titleId);
  }

  /**
   * Botão dos cards: coloca o título na lista "Quero assistir" ou tira, se ele já
   * estiver lá. Na primeira vez a lista é criada junto — criar e adicionar precisam
   * acontecer na mesma atualização de estado, senão a segunda chamada trabalharia
   * com a lista antiga e perderia a lista recém-criada.
   */
  function toggleTitleInDefaultList(title: TitleSummary) {
    setLists((anteriores) => {
      const existente = anteriores.find((lista) => lista.name === LISTA_PADRAO);

      if (!existente) {
        const nova: UserList = {
          id: String(Date.now()),
          name: LISTA_PADRAO,
          items: [title],
          createdAt: new Date().toISOString(),
        };

        return [...anteriores, nova];
      }

      const jaTem = existente.items.some(
        (item) => item.mediaType === title.mediaType && item.id === title.id,
      );

      const items = jaTem
        ? existente.items.filter(
            (item) => !(item.mediaType === title.mediaType && item.id === title.id),
          )
        : [...existente.items, title];

      return anteriores.map((lista) =>
        lista.id === existente.id ? { ...lista, items } : lista,
      );
    });
  }

  function isTitleInDefaultList(mediaType: MediaType, titleId: number) {
    const lista = lists.find((item) => item.name === LISTA_PADRAO);
    if (!lista) return false;

    return lista.items.some((item) => item.mediaType === mediaType && item.id === titleId);
  }

  return (
    <AppDataContext.Provider
      value={{
        reviews,
        lists,
        isLoaded,
        getReview,
        saveReview,
        createList,
        deleteList,
        addTitleToList,
        removeTitleFromList,
        isTitleInList,
        toggleTitleInDefaultList,
        isTitleInDefaultList,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

/** Atalho para ler o contexto sem precisar importar o createContext em cada página. */
export function useAppData() {
  const contexto = useContext(AppDataContext);

  if (!contexto) {
    throw new Error("useAppData precisa ser usado dentro do AppDataProvider.");
  }

  return contexto;
}

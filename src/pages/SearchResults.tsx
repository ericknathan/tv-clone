import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { EmptyState } from "../components/EmptyState";
import { TitleCard } from "../components/TitleCard";
import { TitleCardSkeleton } from "../components/TitleCardSkeleton";
import { useAppData } from "../context/AppDataContext";
import { buscarTitulos } from "../services/tmdb";
import type { TitleSummary } from "../types";

/** Quantidade de skeletons mostrados enquanto os resultados não chegam. */
const SKELETONS = [1, 2, 3, 4, 5, 6];

export function SearchResults() {
  const { toggleTitleInDefaultList, isTitleInDefaultList } = useAppData();

  // O termo vem da própria URL (/buscar?q=matrix), então a busca pode ser compartilhada.
  const [searchParams] = useSearchParams();
  const termo = searchParams.get("q") || "";

  const [resultados, setResultados] = useState<TitleSummary[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  // Refaz a busca sempre que o termo da URL muda.
  useEffect(() => {
    if (!termo) {
      setResultados([]);
      setCarregando(false);
      return;
    }

    let ativo = true;
    setCarregando(true);
    setErro("");

    buscarTitulos(termo)
      .then((dados) => {
        // Se o termo mudou enquanto a resposta vinha, ela é descartada.
        if (ativo) setResultados(dados);
      })
      .catch((problema: Error) => {
        if (ativo) setErro(problema.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [termo, tentativa]);

  if (!termo) {
    return (
      <EmptyState
        title="Busque um filme ou série"
        description="Digite o nome de um título no campo de busca do topo da página."
      />
    );
  }

  if (erro) {
    return (
      <EmptyState
        variant="erro"
        title="A busca falhou"
        description={erro}
        actionLabel="Tentar novamente"
        onAction={() => setTentativa(tentativa + 1)}
      />
    );
  }

  if (!carregando && resultados.length === 0) {
    return (
      <EmptyState
        title="Nenhum resultado encontrado"
        description={`Não encontramos filmes ou séries para "${termo}". Tente outro nome.`}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4" aria-busy={carregando}>
      <div>
        <h1 className="text-2xl font-bold">Resultados para "{termo}"</h1>

        <p className="text-sm text-texto-suave">
          {carregando
            ? "Buscando no TMDB..."
            : `${resultados.length} ${resultados.length === 1 ? "título encontrado" : "títulos encontrados"}`}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {carregando
          ? SKELETONS.map((numero) => <TitleCardSkeleton key={numero} />)
          : resultados.map((resultado) => (
              <TitleCard
                key={`${resultado.mediaType}-${resultado.id}`}
                title={resultado}
                onQuickToggle={toggleTitleInDefaultList}
                isAdded={isTitleInDefaultList(resultado.mediaType, resultado.id)}
              />
            ))}
      </div>
    </div>
  );
}

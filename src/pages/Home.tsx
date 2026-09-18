import { useEffect, useState } from "react";

import { EmptyState } from "../components/EmptyState";
import { TitleCard } from "../components/TitleCard";
import { TitleCardSkeleton } from "../components/TitleCardSkeleton";
import { useAppData } from "../context/AppDataContext";
import { getPopulares } from "../services/tmdb";
import type { TitleSummary } from "../types";

/** Quantidade de skeletons mostrados enquanto os títulos não chegam. */
const SKELETONS = [1, 2, 3, 4, 5, 6];

const GRADE = "grid gap-3 sm:grid-cols-2 lg:grid-cols-3";

export function Home() {
  const { toggleTitleInDefaultList, isTitleInDefaultList } = useAppData();

  const [filmes, setFilmes] = useState<TitleSummary[]>([]);
  const [series, setSeries] = useState<TitleSummary[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  // Busca filmes e séries populares no TMDB assim que a página abre.
  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro("");

    Promise.all([getPopulares("movie"), getPopulares("tv")])
      .then(([filmesPopulares, seriesPopulares]) => {
        if (!ativo) return;
        setFilmes(filmesPopulares);
        setSeries(seriesPopulares);
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
  }, [tentativa]);

  if (erro) {
    return (
      <EmptyState
        variant="erro"
        title="Não foi possível carregar os destaques"
        description={erro}
        actionLabel="Tentar novamente"
        onAction={() => setTentativa(tentativa + 1)}
      />
    );
  }

  if (!carregando && filmes.length === 0 && series.length === 0) {
    return (
      <EmptyState
        title="Nenhum destaque disponível"
        description="O TMDB não retornou títulos em alta no momento. Tente a busca no topo da página."
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Descubra o que assistir</h1>
        <p className="text-sm text-texto-suave">
          Os títulos mais populares do momento, direto do TMDB.
        </p>
      </div>

      <section className="flex flex-col gap-3" aria-busy={carregando}>
        <h2 className="text-lg font-semibold">Filmes em alta</h2>

        <div className={GRADE}>
          {carregando
            ? SKELETONS.map((numero) => <TitleCardSkeleton key={numero} />)
            : filmes.map((filme) => (
                <TitleCard
                  key={`${filme.mediaType}-${filme.id}`}
                  title={filme}
                  onQuickToggle={toggleTitleInDefaultList}
                  isAdded={isTitleInDefaultList(filme.mediaType, filme.id)}
                />
              ))}
        </div>
      </section>

      <section className="flex flex-col gap-3" aria-busy={carregando}>
        <h2 className="text-lg font-semibold">Séries em alta</h2>

        <div className={GRADE}>
          {carregando
            ? SKELETONS.map((numero) => <TitleCardSkeleton key={numero} />)
            : series.map((serie) => (
                <TitleCard
                  key={`${serie.mediaType}-${serie.id}`}
                  title={serie}
                  onQuickToggle={toggleTitleInDefaultList}
                  isAdded={isTitleInDefaultList(serie.mediaType, serie.id)}
                />
              ))}
        </div>
      </section>
    </div>
  );
}

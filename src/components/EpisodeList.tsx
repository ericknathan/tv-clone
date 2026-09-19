import { Check, ChevronDown, Eye, ImageOff, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { useAppData } from "../context/AppDataContext";
import { getEpisodios } from "../services/tmdb";
import type { Episode, Season } from "../types";

type EpisodeListProps = {
  seriesId: number;
  seasons: Season[];
};

const SKELETONS = [1, 2, 3, 4];

/** Nenhuma temporada aberta. */
const FECHADA = 0;

export function EpisodeList({ seriesId, seasons }: EpisodeListProps) {
  const { toggleWatchedEpisode, isEpisodeWatched, countWatchedInSeason } = useAppData();

  // A primeira temporada já abre, para a lista de episódios aparecer de cara.
  const [temporadaAberta, setTemporadaAberta] = useState(seasons[0].number);
  // Episódios já buscados, guardados por número de temporada.
  const [episodiosPorTemporada, setEpisodiosPorTemporada] = useState<Record<number, Episode[]>>({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  // Os episódios de uma temporada só são buscados quando ela é aberta pela primeira vez.
  useEffect(() => {
    if (temporadaAberta === FECHADA) return;

    if (episodiosPorTemporada[temporadaAberta]) {
      setCarregando(false);
      return;
    }

    let ativo = true;
    setCarregando(true);
    setErro("");

    getEpisodios(seriesId, temporadaAberta)
      .then((dados) => {
        if (!ativo) return;
        setEpisodiosPorTemporada((anteriores) => ({ ...anteriores, [temporadaAberta]: dados }));
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
  }, [seriesId, temporadaAberta, tentativa]);

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-borda bg-superficie p-4">
      <h2 className="font-semibold">Episódios</h2>

      <ul className="flex flex-col gap-2">
        {seasons.map((temporada) => {
          const aberta = temporada.number === temporadaAberta;
          const episodios = episodiosPorTemporada[temporada.number];
          const mostrarErro = aberta && Boolean(erro) && !episodios;
          const mostrarSkeleton = aberta && carregando && !episodios && !erro;
          const assistidos = countWatchedInSeason(seriesId, temporada.number);

          return (
            <li key={temporada.id} className="rounded-lg border border-borda bg-fundo">
              <button
                type="button"
                onClick={() => setTemporadaAberta(aberta ? FECHADA : temporada.number)}
                aria-expanded={aberta}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-3 text-left transition-colors hover:text-destaque"
              >
                <span className="font-semibold">
                  {temporada.name}
                  {temporada.year && (
                    <span className="font-normal text-texto-suave"> · {temporada.year}</span>
                  )}
                </span>

                <span className="flex shrink-0 items-center gap-2 text-sm text-texto-suave">
                  {assistidos > 0 ? (
                    <span className="text-destaque">
                      {assistidos}/{temporada.episodeCount} assistidos
                    </span>
                  ) : (
                    <>
                      {temporada.episodeCount}{" "}
                      {temporada.episodeCount === 1 ? "episódio" : "episódios"}
                    </>
                  )}
                  <ChevronDown
                    className={
                      aberta
                        ? "size-4 rotate-180 transition-transform duration-300 motion-reduce:transition-none"
                        : "size-4 transition-transform duration-300 motion-reduce:transition-none"
                    }
                  />
                </span>
              </button>

              {/*
                O bloco abre e fecha animando de 0fr para 1fr: a altura acompanha o
                conteúdo sem precisar medi-lo em JavaScript. Por isso os episódios
                continuam montados quando a temporada fecha — se saíssem da tela na
                hora, o que encolheria seria uma caixa vazia.
              */}
              <div
                className={
                  aberta
                    ? "grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none"
                    : "grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none"
                }
              >
                {/* Fechado, o conteúdo continua no DOM para poder animar — o `inert`
                    tira ele do leitor de tela e da navegação por teclado. */}
                <div className="overflow-hidden" inert={!aberta}>
                  <div className="border-t border-borda px-3 py-3">
                    {mostrarErro && (
                      <div className="flex flex-col items-start gap-2">
                        <p className="text-sm text-red-400">{erro}</p>

                        <button
                          type="button"
                          onClick={() => setTentativa(tentativa + 1)}
                          className="cursor-pointer text-sm font-semibold text-destaque"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    )}

                    {mostrarSkeleton && (
                      <ul aria-hidden="true" className="flex animate-pulse flex-col gap-3">
                        {SKELETONS.map((numero) => (
                          <li key={numero} className="flex items-center gap-3">
                            <div className="h-14 w-24 shrink-0 rounded-md bg-superficie" />

                            <div className="flex w-full flex-col gap-2">
                              <div className="h-3 w-1/2 rounded bg-superficie" />
                              <div className="h-3 w-24 rounded bg-superficie" />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    {episodios && episodios.length === 0 && (
                      <p className="text-sm text-texto-suave">
                        O TMDB não tem os episódios desta temporada.
                      </p>
                    )}

                    {episodios && episodios.length > 0 && (
                      <ul className="flex flex-col gap-3">
                        {episodios.map((episodio) => {
                          const assistido = isEpisodeWatched(episodio.id);

                          return (
                          <li key={episodio.id} className="flex items-center gap-3">
                            {episodio.stillUrl ? (
                              <img
                                src={episodio.stillUrl}
                                alt=""
                                className="h-14 w-24 shrink-0 rounded-md object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-md bg-superficie">
                                <ImageOff className="size-4 text-texto-suave" />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {episodio.number}. {episodio.name}
                              </p>

                              <p className="flex items-center gap-2 text-xs text-texto-suave">
                                {episodio.airDate}

                                {episodio.voteAverage > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Star className="size-3 fill-destaque text-destaque" />
                                    {episodio.voteAverage.toFixed(1)}
                                  </span>
                                )}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                toggleWatchedEpisode({
                                  seriesId,
                                  seasonNumber: temporada.number,
                                  episodeId: episodio.id,
                                })
                              }
                              aria-pressed={assistido}
                              aria-label={
                                assistido
                                  ? `Desmarcar "${episodio.name}" como assistido`
                                  : `Marcar "${episodio.name}" como assistido`
                              }
                              title={assistido ? "Assistido" : "Marcar como assistido"}
                              className={
                                assistido
                                  ? "shrink-0 cursor-pointer rounded-full bg-destaque p-2 text-fundo transition-colors"
                                  : "shrink-0 cursor-pointer rounded-full border border-borda p-2 text-texto-suave transition-colors hover:border-destaque hover:text-destaque"
                              }
                            >
                              {assistido ? (
                                <Check className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </button>
                          </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

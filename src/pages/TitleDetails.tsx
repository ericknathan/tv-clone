import { ImageOff, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useParams } from "react-router";
import { toast } from "sonner";

import { EmptyState } from "../components/EmptyState";
import { EpisodeList } from "../components/EpisodeList";
import { ListPicker } from "../components/ListPicker";
import { RatingStars } from "../components/RatingStars";
import { TitleBackdrop } from "../components/TitleBackdrop";
import { TitleDetailsSkeleton } from "../components/TitleDetailsSkeleton";
import { WhereToWatch } from "../components/WhereToWatch";
import { WhereToWatchSkeleton } from "../components/WhereToWatchSkeleton";
import { useAppData } from "../context/AppDataContext";
import { getDetalhes } from "../services/tmdb";
import type { MediaType, TitleDetail, TitleSummary } from "../types";

export function TitleDetails() {
  const { mediaType, id } = useParams();
  const location = useLocation();

  // Os parâmetros da URL chegam como texto, então normalizamos antes de usar.
  const tipo: MediaType = mediaType === "tv" ? "tv" : "movie";
  const idNumerico = Number(id);

  const { reviews, saveReview, isLoaded } = useAppData();

  const [detalhes, setDetalhes] = useState<TitleDetail | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");

  // Se já existe avaliação salva, o formulário está editando em vez de criar.
  const avaliacaoSalva = reviews.find(
    (avaliacao) => avaliacao.mediaType === tipo && avaliacao.titleId === idNumerico,
  );
  const jaAvaliado = Boolean(avaliacaoSalva);

  // Sem nota não há o que salvar; e se nada mudou em relação ao que já está guardado,
  // não há o que atualizar. Nos dois casos o botão fica desabilitado.
  const semNota = nota === 0;
  const semMudanca =
    avaliacaoSalva?.rating === nota && avaliacaoSalva?.comment === comentario.trim();

  const avisoDoBotao = semNota
    ? "Escolha uma nota para salvar."
    : semMudanca
      ? "Nada mudou desde a última vez que você salvou."
      : "";

  // Quem chega clicando em um card manda junto o resumo do título. Com isso o pôster
  // já aparece enquanto o TMDB responde — e é o que permite a imagem do card crescer
  // até aqui na transição, em vez de virar um retângulo cinza.
  const estadoDaNavegacao = location.state as { title?: TitleSummary } | null;
  const resumo: TitleDetail | TitleSummary | undefined = detalhes || estadoDaNavegacao?.title;

  // Busca os detalhes do título no TMDB.
  useEffect(() => {
    if (!Number.isFinite(idNumerico)) {
      setErro("Endereço inválido: o título não foi identificado.");
      setCarregando(false);
      return;
    }

    let ativo = true;
    setCarregando(true);
    setErro("");

    getDetalhes(tipo, idNumerico)
      .then((dados) => {
        if (ativo) setDetalhes(dados);
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
  }, [tipo, idNumerico, tentativa]);

  // Preenche o formulário com a avaliação já salva para este título, se existir.
  // Depende só do título e da carga inicial (e não de `reviews`): o formulário é
  // preenchido ao abrir a página e, a partir daí, quem manda no que está escrito é o usuário.
  useEffect(() => {
    if (!isLoaded) return;

    const salva = reviews.find(
      (avaliacao) => avaliacao.mediaType === tipo && avaliacao.titleId === idNumerico,
    );

    setNota(salva ? salva.rating : 0);
    setComentario(salva ? salva.comment : "");
  }, [isLoaded, tipo, idNumerico]);

  function handleSalvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!resumo) return;

    if (nota === 0) {
      toast.error("Escolha uma nota de 0,5 a 5 estrelas antes de salvar.");
      return;
    }

    saveReview(
      {
        id: resumo.id,
        mediaType: resumo.mediaType,
        name: resumo.name,
        year: resumo.year,
        posterUrl: resumo.posterUrl,
        backdropUrl: resumo.backdropUrl,
        voteAverage: resumo.voteAverage,
      },
      nota,
      comentario.trim(),
    );

    toast.success(
      jaAvaliado
        ? `Avaliação de ${resumo.name} atualizada!`
        : `Avaliação de ${resumo.name} salva!`,
    );
  }

  if (erro) {
    return (
      <EmptyState
        variant="erro"
        title="Não foi possível abrir este título"
        description={erro}
        actionLabel="Tentar novamente"
        onAction={() => setTentativa(tentativa + 1)}
      />
    );
  }

  // Sem nem o resumo da navegação, não há o que mostrar antes da API responder.
  if (!resumo) {
    return <TitleDetailsSkeleton />;
  }

  return (
    <div className="relative flex flex-col gap-6" aria-busy={carregando}>
      <TitleBackdrop imageUrl={resumo.backdropUrl} />

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* O mesmo nome usado no card faz o pôster crescer do card até aqui. */}
        {resumo.posterUrl ? (
          <img
            src={resumo.posterUrl}
            alt={resumo.name}
            style={{ viewTransitionName: "poster-do-titulo" }}
            className="h-72 w-48 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div
            style={{ viewTransitionName: "poster-do-titulo" }}
            className="flex h-72 w-48 shrink-0 items-center justify-center rounded-xl bg-superficie"
          >
            <ImageOff className="size-8 text-texto-suave" />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-2xl font-bold">
              {resumo.name} {resumo.year && <span className="text-texto-suave">{resumo.year}</span>}
            </h1>

            <p className="text-sm font-medium text-destaque">
              {resumo.mediaType === "tv" ? "Série" : "Filme"}
            </p>
          </div>

          <p className="flex items-center gap-1 text-sm text-texto-suave">
            <Star className="size-4 fill-destaque text-destaque" />
            {resumo.voteAverage.toFixed(1)} — nota do TMDB
          </p>

          {detalhes ? (
            <>
              {detalhes.genres.length > 0 && (
                <p className="text-sm text-texto-suave">{detalhes.genres.join(" • ")}</p>
              )}

              <p className="max-w-2xl text-sm">{detalhes.overview}</p>

              {detalhes.cast.length > 0 && (
                <p className="text-sm text-texto-suave">
                  <span className="font-semibold text-texto">Elenco: </span>
                  {detalhes.cast.join(", ")}
                </p>
              )}
            </>
          ) : (
            // Gêneros, sinopse e elenco ainda estão vindo do TMDB.
            <div aria-hidden="true" className="flex max-w-2xl animate-pulse flex-col gap-2 pt-1">
              <div className="h-3 w-40 rounded bg-superficie" />
              <div className="h-3 w-full rounded bg-superficie" />
              <div className="h-3 w-full rounded bg-superficie" />
              <div className="h-3 w-4/5 rounded bg-superficie" />
            </div>
          )}
        </div>
      </div>

      {detalhes ? <WhereToWatch providers={detalhes.providers} /> : <WhereToWatchSkeleton />}

      {detalhes && detalhes.seasons.length > 0 && (
        <EpisodeList seriesId={detalhes.id} seasons={detalhes.seasons} />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={handleSalvar}
          className="flex flex-col gap-3 rounded-xl border border-borda bg-superficie p-4"
        >
          <h2 className="font-semibold">Sua nota</h2>

          <RatingStars value={nota} onChange={(novaNota) => setNota(novaNota)} />

          <textarea
            value={comentario}
            onChange={(evento) => setComentario(evento.target.value)}
            rows={4}
            placeholder="Escreva um comentário sobre o que achou (opcional)"
            className="rounded-lg border border-borda bg-fundo px-3 py-2 text-sm outline-none transition-colors placeholder:text-texto-suave focus:border-destaque focus:ring-2 focus:ring-destaque/30"
          />

          {avisoDoBotao && <p className="text-xs text-texto-suave">{avisoDoBotao}</p>}

          <button
            type="submit"
            disabled={semNota || semMudanca}
            className="cursor-pointer self-start rounded-lg bg-destaque px-4 py-2 text-sm font-semibold text-fundo transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:opacity-40"
          >
            {jaAvaliado ? "Atualizar avaliação" : "Salvar avaliação"}
          </button>
        </form>

        <ListPicker
          title={{
            id: resumo.id,
            mediaType: resumo.mediaType,
            name: resumo.name,
            year: resumo.year,
            posterUrl: resumo.posterUrl,
            backdropUrl: resumo.backdropUrl,
            voteAverage: resumo.voteAverage,
          }}
        />
      </div>
    </div>
  );
}

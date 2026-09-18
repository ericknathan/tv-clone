import { ImageOff, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

import { EmptyState } from "../components/EmptyState";
import { ListPicker } from "../components/ListPicker";
import { RatingStars } from "../components/RatingStars";
import { TitleDetailsSkeleton } from "../components/TitleDetailsSkeleton";
import { useAppData } from "../context/AppDataContext";
import { getDetalhes } from "../services/tmdb";
import type { MediaType, TitleDetail } from "../types";

export function TitleDetails() {
  const { mediaType, id } = useParams();

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
  const jaAvaliado = reviews.some(
    (avaliacao) => avaliacao.mediaType === tipo && avaliacao.titleId === idNumerico,
  );

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
    if (!detalhes) return;

    if (nota === 0) {
      toast.error("Escolha uma nota de 0,5 a 5 estrelas antes de salvar.");
      return;
    }

    saveReview(
      {
        id: detalhes.id,
        mediaType: detalhes.mediaType,
        name: detalhes.name,
        year: detalhes.year,
        posterUrl: detalhes.posterUrl,
        voteAverage: detalhes.voteAverage,
      },
      nota,
      comentario.trim(),
    );

    toast.success(
      jaAvaliado
        ? `Avaliação de ${detalhes.name} atualizada!`
        : `Avaliação de ${detalhes.name} salva!`,
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

  if (carregando || !detalhes) {
    return <TitleDetailsSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        {detalhes.posterUrl ? (
          <img
            src={detalhes.posterUrl}
            alt={detalhes.name}
            className="h-72 w-48 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-72 w-48 shrink-0 items-center justify-center rounded-xl bg-superficie">
            <ImageOff className="size-8 text-texto-suave" />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-2xl font-bold">
              {detalhes.name} {detalhes.year && <span className="text-texto-suave">{detalhes.year}</span>}
            </h1>

            <p className="text-sm font-medium text-destaque">
              {detalhes.mediaType === "tv" ? "Série" : "Filme"}
            </p>
          </div>

          <p className="flex items-center gap-1 text-sm text-texto-suave">
            <Star className="size-4 fill-destaque text-destaque" />
            {detalhes.voteAverage.toFixed(1)} — nota do TMDB
          </p>

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
        </div>
      </div>

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

          <button
            type="submit"
            className="cursor-pointer self-start rounded-lg bg-destaque px-4 py-2 text-sm font-semibold text-fundo transition-opacity hover:opacity-90"
          >
            {jaAvaliado ? "Atualizar avaliação" : "Salvar avaliação"}
          </button>
        </form>

        <ListPicker
          title={{
            id: detalhes.id,
            mediaType: detalhes.mediaType,
            name: detalhes.name,
            year: detalhes.year,
            posterUrl: detalhes.posterUrl,
            voteAverage: detalhes.voteAverage,
          }}
        />
      </div>
    </div>
  );
}

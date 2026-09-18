import { Check, ImageOff, Plus, Star, Trash2, X } from "lucide-react";
import { Link, useViewTransitionState } from "react-router";

import type { TitleSummary } from "../types";

type TitleCardProps = {
  title: TitleSummary;
  /** Botão do card, que coloca ou tira o título da lista padrão (Referência 01). */
  onQuickToggle?: (title: TitleSummary) => void;
  /** Indica que o título já está na lista padrão, mudando o botão para "remover". */
  isAdded?: boolean;
  /** Botão de remover, usado na página de uma lista. */
  onRemove?: () => void;
};

export function TitleCard({ title, onQuickToggle, isAdded = false, onRemove }: TitleCardProps) {
  const rotuloDoBotao = isAdded
    ? `Remover ${title.name} de Quero assistir`
    : `Adicionar ${title.name} em Quero assistir`;

  const endereco = `/titulo/${title.mediaType}/${title.id}`;

  // Verdadeiro só enquanto a navegação para este card está acontecendo. Assim apenas
  // o pôster clicado recebe o nome da transição, e não os 40 cards da página.
  const emTransicao = useViewTransitionState(endereco);
  const estiloDoPoster = emTransicao ? { viewTransitionName: "poster-do-titulo" } : undefined;

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-borda bg-superficie p-3 transition-colors hover:border-destaque/60">
      {/* O resumo viaja junto na navegação para a página de detalhes já ter o pôster. */}
      <Link
        to={endereco}
        state={{ title }}
        viewTransition
        className="group flex min-w-0 flex-1 items-center gap-3"
      >
        {title.posterUrl ? (
          <img
            src={title.posterUrl}
            alt={title.name}
            style={estiloDoPoster}
            className="h-24 w-16 shrink-0 rounded-md object-cover"
          />
        ) : (
          <div
            style={estiloDoPoster}
            className="flex h-24 w-16 shrink-0 items-center justify-center rounded-md bg-fundo"
          >
            <ImageOff className="size-5 text-texto-suave" />
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate font-semibold transition-colors group-hover:text-destaque">
            {title.name} {title.year && <span className="text-texto-suave">{title.year}</span>}
          </p>

          <p className="text-xs font-medium text-destaque">
            {title.mediaType === "tv" ? "Série" : "Filme"}
          </p>

          <p className="mt-1 flex items-center gap-1 text-sm text-texto-suave">
            <Star className="size-4 fill-destaque text-destaque" />
            {title.voteAverage.toFixed(1)}
            <span className="text-xs">TMDB</span>
          </p>
        </div>
      </Link>

      {onQuickToggle && (
        <button
          type="button"
          onClick={() => onQuickToggle(title)}
          aria-label={rotuloDoBotao}
          title={rotuloDoBotao}
          className={
            isAdded
              ? "group shrink-0 cursor-pointer rounded-full bg-destaque p-2 text-fundo transition-colors hover:bg-red-400"
              : "shrink-0 cursor-pointer rounded-full border border-destaque p-2 text-destaque transition-colors hover:bg-destaque hover:text-fundo"
          }
        >
          {isAdded ? (
            <>
              {/* Já está na lista: o check vira um X ao passar o mouse, avisando que dá para tirar. */}
              <Check className="size-4 group-hover:hidden" />
              <X className="hidden size-4 group-hover:block" />
            </>
          ) : (
            <Plus className="size-4" />
          )}
        </button>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${title.name} da lista`}
          className="shrink-0 cursor-pointer rounded-full border border-borda p-2 text-texto-suave transition-colors hover:border-red-400 hover:text-red-400"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}

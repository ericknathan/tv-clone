import { User } from "lucide-react";
import { useNavigate } from "react-router";

import { EmptyState } from "../components/EmptyState";
import { RatingStars } from "../components/RatingStars";
import { TitleCard } from "../components/TitleCard";
import { useAppData } from "../context/AppDataContext";

export function Profile() {
  const { reviews, lists, isLoaded } = useAppData();
  const navegar = useNavigate();

  // Evita mostrar o estado vazio antes de ler as avaliações salvas.
  if (!isLoaded) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 rounded-xl border border-borda bg-superficie p-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-destaque text-fundo">
          <User className="size-6" />
        </div>

        <div>
          <h1 className="text-xl font-bold">Meu perfil</h1>
          <p className="text-sm text-texto-suave">
            {reviews.length} {reviews.length === 1 ? "avaliação" : "avaliações"} ·{" "}
            {lists.length} {lists.length === 1 ? "lista" : "listas"}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold">Minhas avaliações</h2>

      {reviews.length === 0 ? (
        <EmptyState
          title="Você ainda não avaliou nada"
          description="Abra um filme ou série, dê sua nota e o registro aparece aqui."
          actionLabel="Descobrir títulos"
          onAction={() => navegar("/")}
        />
      ) : (
        <ul className="flex flex-col gap-5">
          {reviews.map((avaliacao) => (
            <li
              key={`${avaliacao.mediaType}-${avaliacao.titleId}`}
              className="flex flex-col gap-2"
            >
              <TitleCard title={avaliacao.title} />

              <div className="flex flex-col gap-2 rounded-xl border border-borda bg-superficie p-3">
                <div className="flex items-center gap-2">
                  <RatingStars value={avaliacao.rating} readOnly />
                  <span className="text-sm text-texto-suave">Sua nota</span>
                </div>

                {avaliacao.comment ? (
                  <p className="text-sm">{avaliacao.comment}</p>
                ) : (
                  <p className="text-sm text-texto-suave italic">Sem comentário.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

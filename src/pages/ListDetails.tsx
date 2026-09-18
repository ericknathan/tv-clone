import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

import { EmptyState } from "../components/EmptyState";
import { TitleCard } from "../components/TitleCard";
import { useAppData } from "../context/AppDataContext";

export function ListDetails() {
  const { listId } = useParams();
  const { lists, removeTitleFromList, isLoaded } = useAppData();
  const navegar = useNavigate();

  const lista = lists.find((item) => item.id === listId);

  // Espera a leitura do que está salvo antes de decidir se a lista existe ou não.
  if (!isLoaded) return null;

  if (!lista) {
    return (
      <EmptyState
        title="Lista não encontrada"
        description="Essa lista não existe mais ou o endereço está incorreto."
        actionLabel="Ver minhas listas"
        onAction={() => navegar("/listas", { viewTransition: true })}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{lista.name}</h2>
          <p className="text-sm text-texto-suave">
            {lista.items.length} {lista.items.length === 1 ? "título" : "títulos"}
          </p>
        </div>

        <Link
          to="/listas"
          viewTransition
          className="flex items-center gap-1 text-sm text-texto-suave transition-colors hover:text-texto"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </div>

      {lista.items.length === 0 ? (
        <EmptyState
          title="Lista vazia"
          description="Abra um filme ou série e adicione a esta lista para vê-lo aqui."
          actionLabel="Descobrir títulos"
          onAction={() => navegar("/", { viewTransition: true })}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {lista.items.map((item) => (
            <TitleCard
              key={`${item.mediaType}-${item.id}`}
              title={item}
              onRemove={() => removeTitleFromList(lista.id, item.mediaType, item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

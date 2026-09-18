import { useNavigate } from "react-router";

import { EmptyState } from "../components/EmptyState";

export function NotFound() {
  const navegar = useNavigate();

  return (
    <EmptyState
      title="Página não encontrada"
      description="O endereço que você tentou abrir não existe no TV Clone."
      actionLabel="Voltar para o início"
      onAction={() => navegar("/")}
      variant="erro"
    />
  );
}

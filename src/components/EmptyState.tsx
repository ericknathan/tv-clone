import { AlertCircle, Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "vazio" | "erro";
};

/** Usado tanto para "nada por aqui" quanto para falhas de carregamento. */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  variant = "vazio",
}: EmptyStateProps) {
  const ehErro = variant === "erro";
  const Icone = ehErro ? AlertCircle : Inbox;

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-borda bg-superficie px-6 py-14 text-center">
      <Icone className={ehErro ? "size-10 text-red-400" : "size-10 text-texto-suave"} />

      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="max-w-md text-sm text-texto-suave">{description}</p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 cursor-pointer rounded-lg bg-destaque px-4 py-2 text-sm font-semibold text-fundo transition-opacity hover:opacity-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

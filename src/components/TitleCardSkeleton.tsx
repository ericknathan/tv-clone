/**
 * Espelha o layout do TitleCard enquanto os dados do TMDB não chegam.
 * Como ocupa o mesmo espaço do card real, a página não "pula" quando os dados chegam.
 */
export function TitleCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex min-w-0 animate-pulse items-center gap-3 rounded-xl border border-borda bg-superficie p-3"
    >
      <div className="h-24 w-16 shrink-0 rounded-md bg-borda" />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="h-4 w-3/4 rounded bg-borda" />
        <div className="h-3 w-14 rounded bg-borda" />
        <div className="h-3 w-24 rounded bg-borda" />
      </div>

      <div className="size-8 shrink-0 rounded-full bg-borda" />
    </div>
  );
}

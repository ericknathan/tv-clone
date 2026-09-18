/** Espelha o layout da página de detalhes enquanto o TMDB responde. */
export function TitleDetailsSkeleton() {
  return (
    <div aria-hidden="true" className="flex animate-pulse flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="h-72 w-48 shrink-0 rounded-xl bg-superficie" />

        <div className="flex flex-1 flex-col gap-3">
          <div className="h-7 w-2/3 rounded bg-superficie" />
          <div className="h-4 w-20 rounded bg-superficie" />
          <div className="h-4 w-32 rounded bg-superficie" />

          <div className="flex flex-col gap-2 pt-2">
            <div className="h-3 w-full rounded bg-superficie" />
            <div className="h-3 w-full rounded bg-superficie" />
            <div className="h-3 w-4/5 rounded bg-superficie" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-56 rounded-xl border border-borda bg-superficie" />
        <div className="h-56 rounded-xl border border-borda bg-superficie" />
      </div>
    </div>
  );
}
